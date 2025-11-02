#!/usr/bin/env bash
set -euo pipefail

# Source environment detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=detect-env.sh
source "$SCRIPT_DIR/detect-env.sh"

log() {
  printf '[INFO] %s\n' "$1"
}

warn() {
  printf '[WARN] %s\n' "$1"
}

log "Genesis foundation verification starting..."
log "Environment: $GENESIS_ENV"

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
if [[ ! -d .git ]]; then
  log "Initializing new git repository..."
  git init >/dev/null
  git add .
  git commit -m "Scientia est lux principium✨" >/dev/null
  log "Repository initialized and initial commit created."
else
  log "Git repository already initialized."
fi

# Cloud-specific guidance
if [[ "$GENESIS_ENV" == "codespaces" ]]; then
  log "Running in GitHub Codespaces"
  log "Tip: Configure secrets in Codespaces settings for environment variables"
elif [[ "$GENESIS_ENV" == "ci" ]]; then
  log "Running in CI environment"
fi

log "Execution completed at $(date --iso-8601=seconds)"ll
  log "Repository initialized and initial commit created."
else
  log "Git repository already initialized."
fi

log "Execution completed at $(date --iso-8601=seconds)"
