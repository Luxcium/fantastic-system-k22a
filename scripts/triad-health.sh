#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[INFO] %s\n' "$1"
}

scripts=(
  "$(dirname "$0")/validate-memory-bank.sh"
  "$(dirname "$0")/validate-chatmodes.sh"
  "$(dirname "$0")/validate-prompts.sh"
)

status=0
for script in "${scripts[@]}"; do
  if "$script"; then
    log "$(basename "$script") passed"
  else
    log "$(basename "$script") failed"
    status=1
  fi
done

instructions_count=$(find memory-bank/instructions -maxdepth 1 -name '*.instructions.md' | wc -l | tr -d ' ')
chatmode_count=$(find memory-bank/chatmodes -maxdepth 1 -name '*.chatmode.md' | wc -l | tr -d ' ')
prompt_count=$(find memory-bank/prompts -maxdepth 1 -name '*.prompt.md' | wc -l | tr -d ' ')

log "Instructions: $instructions_count"
log "Chat modes: $chatmode_count"
log "Prompt cards: $prompt_count"

python3 <<'PY'
import json
import sys
from pathlib import Path

settings_path = Path('.vscode/settings.json')
missing = []
if not settings_path.exists():
    missing.append(".vscode/settings.json is missing")
else:
    data = json.loads(settings_path.read_text(encoding='utf-8'))
    instructions_locations = data.get("chat.instructionsFilesLocations", {})
    if "memory-bank/instructions" not in instructions_locations:
        missing.append("settings.json missing chat.instructionsFilesLocations entry")

    if not data.get("chat.promptFiles", False):
        missing.append("settings.json missing chat.promptFiles toggle")

    prompt_locations = data.get("chat.promptFilesLocations", {})
    if "memory-bank/prompts" not in prompt_locations:
        missing.append("settings.json missing chat.promptFilesLocations entry")

    mode_locations = data.get("chat.modeFilesLocations", {})
    if "memory-bank/chatmodes" not in mode_locations:
        missing.append("settings.json missing chat.modeFilesLocations entry")

if missing:
    for item in missing:
        print(item)
    sys.exit(1)
PY
settings_status=$?

if (( status != 0 )); then
  log "Triad health failed due to validator errors."
fi

if (( settings_status != 0 )); then
  log "Triad health failed due to settings configuration."
fi

if (( status != 0 )) || (( settings_status != 0 )); then
  exit 1
fi

log "Triad health check passed."
