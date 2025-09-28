#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
files=(memory-bank/prompts/*.prompt.md)
if (( ${#files[@]} == 0 )); then
  echo "No prompt files found." >&2
  exit 1
fi

grep -Hn '^## Slash Command:' "${files[@]}"
