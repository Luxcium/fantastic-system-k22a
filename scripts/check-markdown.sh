#!/usr/bin/env bash
set -euo pipefail

# check-markdown.sh
# Two-phase markdown validation: Format first, then validate
# Integrates with Layer 4B markdown resilience protocol

log() {
  printf '[INFO] %s\n' "$1"
}

error() {
  printf '[ERROR] %s\n' "$1" >&2
}

cd "$(dirname "$0")/.." || exit 1

log "Starting markdown validation..."
log "Phase 1: Auto-formatting with Prettier"

# Phase 1: Auto-format markdown files
if ! npx prettier --write \
  "**/*.md" \
  "**/*.chatmode.md" \
  "**/*.prompt.md" \
  "**/*.instructions.md" \
  --ignore-path .prettierignore 2>/dev/null; then
  error "Prettier formatting failed"
  exit 1
fi

log "Phase 2: Strict validation with markdownlint"

# Phase 2: Validate all markdown files
if ! npx markdownlint-cli2 \
  --config .markdownlint-cli2.jsonc \
  "**/*.md" "**/*.chatmode.md" "**/*.prompt.md" "**/*.instructions.md" \
  "#node_modules" "#.next" "#dist" "#build" "#coverage" "#.git" "#vendor"; then
  error "Markdown validation failed"
  error ""
  error "To attempt automatic repair, run:"
  error "  ./scripts/auto-repair-markdown.sh"
  error ""
  error "Or manually fix the issues above and re-run validation."
  exit 1
fi

log "✅ All markdown files are valid and properly formatted"
