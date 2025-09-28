#!/usr/bin/env bash
set -euo pipefail

python3 <<'PY'
import pathlib
import sys

errors = []
allowed_keys = {"description", "mode", "model", "tools"}

for path in sorted(pathlib.Path("memory-bank/prompts").glob("*.prompt.md")):
    text = path.read_text(encoding="utf-8").splitlines()
    if not text or text[0].strip() != "---":
        errors.append(f"{path}: missing front-matter start")
        continue
    try:
        end = text.index('---', 1)
    except ValueError:
        errors.append(f"{path}: missing front-matter end")
        continue

    frontmatter = text[1:end]
    if not any(line.startswith("description:") for line in frontmatter):
        errors.append(f"{path}: front-matter missing description")

    for line in frontmatter:
        if not line.strip():
            continue
        if ':' not in line:
            continue
        key = line.split(':', 1)[0].strip()
        if key not in allowed_keys:
            errors.append(f"{path}: disallowed front-matter key '{key}'")

    if len(text) <= end + 1 or text[end + 1].strip() != "":
        errors.append(f"{path}: expected blank line after front-matter")
        continue

    expected_marker = f"<!-- memory-bank/prompts/{path.name} -->"
    if len(text) <= end + 2 or text[end + 2].strip() != expected_marker:
        errors.append(f"{path}: missing or incorrect path marker comment")
        continue

    if len(text) <= end + 3 or text[end + 3].strip() != "":
        errors.append(f"{path}: expected blank line after path marker")
        continue

    body = text[end + 4 :]
    if not body or not body[0].startswith("# "):
        errors.append(f"{path}: expected H1 title immediately after marker block")
        continue

    first_h2_index = None
    for idx, line in enumerate(body):
        if line.startswith("## "):
            first_h2_index = idx
            break

    if first_h2_index is None:
        errors.append(f"{path}: missing Slash Command section")
        continue

    if not body[first_h2_index].startswith("## Slash Command: "):
        errors.append(f"{path}: first H2 must be a Slash Command section")

    if any("http://" in line or "https://" in line for line in text):
        errors.append(f"{path}: external links are not allowed")

if errors:
    print("[FAIL] Prompt validation failed:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)

print("[OK] Prompt validation passed.")
PY
