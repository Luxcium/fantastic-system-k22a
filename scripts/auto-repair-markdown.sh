#!/usr/bin/env bash
set -euo pipefail

# auto-repair-markdown.sh
# Self-healing markdown repair with automatic retry cycles
# Part of Layer 4B markdown resilience protocol

log() {
  printf '[INFO] %s\n' "$1"
}

error() {
  printf '[ERROR] %s\n' "$1" >&2
}

cd "$(dirname "$0")/.." || exit 1

MAX_ATTEMPTS=3
attempt=1

log "Starting markdown auto-repair cycle..."
log "Maximum attempts: $MAX_ATTEMPTS"

while (( attempt <= MAX_ATTEMPTS )); do
  log ""
  log "========================================="
  log "Attempt $attempt of $MAX_ATTEMPTS"
  log "========================================="
  
  # Step 1: Prettier formatting
  log "Running Prettier formatting..."
  npx prettier --write \
    "**/*.md" \
    "**/*.chatmode.md" \
    "**/*.prompt.md" \
    "**/*.instructions.md" \
    --ignore-path .prettierignore 2>/dev/null || true
  
  # Step 2: markdownlint auto-fix
  log "Running markdownlint auto-fix..."
  npx markdownlint-cli2 \
    --config .markdownlint-cli2.jsonc \
    --fix \
    "**/*.md" "**/*.chatmode.md" "**/*.prompt.md" "**/*.instructions.md" \
    "#node_modules" "#.next" "#dist" "#build" "#coverage" "#.git" "#vendor" 2>/dev/null || true
  
  # Step 3: Re-validate
  log "Validating repairs..."
  if ./scripts/check-markdown.sh 2>/dev/null; then
    log ""
    log "✅ SUCCESS: All markdown files repaired and validated on attempt $attempt"
    exit 0
  else
    log "⚠️  Attempt $attempt failed validation"
    (( attempt++ )) || true
  fi
done

error ""
error "❌ FAILED: Unable to auto-repair markdown after $MAX_ATTEMPTS attempts"
error ""
error "Manual intervention required. Common issues:"
error "  1. Missing language specifiers in code blocks"
error "  2. Incorrect heading hierarchy (skipping levels)"
error "  3. Missing alt text on images"
error "  4. Bare URLs that need proper markdown links"
error ""
error "Run validation to see specific errors:"
error "  ./scripts/check-markdown.sh"
error ""
exit 1
