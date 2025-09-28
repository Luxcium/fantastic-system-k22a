#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
errors=()
allowed_models=("GPT-5 (Preview)" "GPT-5 mini (Preview)")
expected_tools="['codebase', 'editFiles', 'fetch']"

for file in memory-bank/chatmodes/*.chatmode.md; do
  [[ -f "$file" ]] || continue
  in_front=0
  description_found=0
  model_value=""
  tools_value=""

  while IFS='' read -r line; do
    if [[ $line == '---' ]]; then
      if (( in_front == 0 )); then
        in_front=1
        continue
      else
        break
      fi
    fi

    if (( in_front == 1 )); then
      case $line in
        description:*) description_found=1 ;;
        model:*) model_value=${line#model: } ;;
        tools:*) tools_value=${line#tools: } ;;
      esac
    fi
  done < "$file"

  if (( description_found == 0 )); then
    errors+=("$file: missing description in front-matter")
  fi

  if [[ -z $model_value ]]; then
    errors+=("$file: missing model in front-matter")
  else
    match=0
    for allowed in "${allowed_models[@]}"; do
      if [[ $model_value == "$allowed" ]]; then
        match=1
        break
      fi
    done
    if (( match == 0 )); then
      errors+=("$file: model '$model_value' is not allowed")
    fi
  fi

  if [[ -z $tools_value ]]; then
    errors+=("$file: missing tools in front-matter")
  elif [[ $tools_value != "$expected_tools" ]]; then
    errors+=("$file: tools must be exactly $expected_tools")
  fi

  h1_count=$(grep -c '^# ' "$file" || true)
  if [[ $h1_count -ne 1 ]]; then
    errors+=("$file: expected exactly one H1 heading, found $h1_count")
  fi

  if grep -Eq 'https?://|http://|ftp://' "$file"; then
    errors+=("$file: external links are not allowed")
  fi

  if grep -Eq '://[^ )]+' "$file"; then
    errors+=("$file: links must be relative")
  fi

done

if (( ${#errors[@]} > 0 )); then
  printf '[FAIL] Chatmode validation failed:\n'
  printf '  - %s\n' "${errors[@]}"
  exit 1
fi

printf '[OK] Chatmode validation passed.\n'
