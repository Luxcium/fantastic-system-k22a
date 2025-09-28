#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[INFO] %s\n' "$1"
}

warn() {
  printf '[WARN] %s\n' "$1"
}

log "Genesis foundation verification starting..."

foundation=(
  .editorconfig
  .gitattributes
  .gitignore
  LICENSE
  README.md
  VERSION
  scripts/README.md
  scripts/init.sh
)

missing=()
for target in "${foundation[@]}"; do
  if [[ -e "$target" ]]; then
    log "Found $target"
  else
    warn "Missing $target"
    missing+=("$target")
  fi
done

if [[ ${#missing[@]} -eq 0 ]]; then
  log "All foundation artifacts are present."
else
  warn "Foundation missing ${#missing[@]} item(s). See log above."
fi

if [[ -d scripts ]]; then
  chmod +x scripts/*.sh 2>/dev/null || true
  log "Ensured scripts are executable."
fi

if [[ ! -d .git ]]; then
  log "Initializing new git repository..."
  git init >/dev/null
  git add .
  git commit -m "Scientia est lux principium✨" >/dev/null
  log "Repository initialized and initial commit created."
else
  log "Git repository already initialized."
fi

log "Execution completed at $(date --iso-8601=seconds)"
