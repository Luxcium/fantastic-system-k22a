#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
errors=()
allow_external=(
  'layer-*'
  conventional-commits-must-be-used.instructions.md
  gitmoji-complete-list.instructions.md
)

allow_external_file() {
  local name=$1
  for pattern in "${allow_external[@]}"; do
    if [[ $name == $pattern ]]; then
      return 0
    fi
  done
  return 1
}

for file in memory-bank/instructions/*.instructions.md; do
  [[ -f "$file" ]] || continue
  basename=$(basename "$file")

  if ! grep -Eq '^[[:space:]]*description:' "$file"; then
    errors+=("$file: missing description header")
  fi

  if ! allow_external_file "$basename"; then
    if grep -Eq 'https?://|http://|ftp://' "$file"; then
      errors+=("$file: external links are not allowed")
    fi
  fi

done

if (( ${#errors[@]} > 0 )); then
  printf '[FAIL] Memory-bank instructions validation failed:\n'
  printf '  - %s\n' "${errors[@]}"
  exit 1
fi

printf '[OK] Memory-bank instructions validation passed.\n'
