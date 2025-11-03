#!/usr/bin/env bash
# memory-bank-summary.sh - Generate Memory Bank context summary
# Creates memory-bank/SESSION_START.md with current state
set -euo pipefail

# Source environment detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=detect-env.sh
source "$SCRIPT_DIR/detect-env.sh"

# Colors
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

log() { printf "${GREEN}[INFO]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
info() { printf "${BLUE}[SUMMARY]${NC} %s\n" "$1"; }

# Core Memory Bank files (the "Biograms")
readonly MEMORY_BANK_DIR="memory-bank"
readonly CORE_FILES=(
  "projectbrief.md"
  "productContext.md"
  "activeContext.md"
  "systemPatterns.md"
  "techContext.md"
  "dependencies.md"
  "progress.md"
)

readonly OUTPUT_FILE="$MEMORY_BANK_DIR/SESSION_START.md"
readonly SESSION_FILE=".vscode/.genesis-session"

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

log "Generating Memory Bank summary..."
log "Environment: $GENESIS_ENV"
log "Timestamp: $TIMESTAMP"

# Check if Memory Bank directory exists
if [[ ! -d "$MEMORY_BANK_DIR" ]]; then
  warn "Memory Bank directory not found: $MEMORY_BANK_DIR"
  exit 1
fi

# Load previous session data
PREV_TIMESTAMP="Never"
declare -A PREV_CHECKSUMS
if [[ -f "$SESSION_FILE" ]]; then
  if command -v python3 &>/dev/null; then
    PREV_TIMESTAMP=$(python3 -c "import json; print(json.load(open('$SESSION_FILE')).get('lastSessionTimestamp', 'Never'))" 2>/dev/null || echo "Never")
    # Load previous checksums
    while IFS='=' read -r key value; do
      PREV_CHECKSUMS["$key"]="$value"
    done < <(python3 -c "import json; checksums = json.load(open('$SESSION_FILE')).get('memoryBankChecksums', {}); [print(f'{k}={v}') for k, v in checksums.items()]" 2>/dev/null || true)
  fi
fi

# Generate summary file
{
  echo "# Memory Bank Session Start"
  echo ""
  echo "**Generated:** $TIMESTAMP"
  echo "**Environment:** \`$GENESIS_ENV\`"
  echo "**Previous Session:** $PREV_TIMESTAMP"
  echo ""
  echo "---"
  echo ""

  # Process each core file
  for file in "${CORE_FILES[@]}"; do
    filepath="$MEMORY_BANK_DIR/$file"

    echo "## $(basename "$file" .md | sed 's/\b\(.\)/\u\1/g')"
    echo ""

    if [[ ! -f "$filepath" ]]; then
      echo "⚠️ **File not found**"
      echo ""
      continue
    fi

    # Calculate checksum
    CURRENT_CHECKSUM=$(sha256sum "$filepath" | awk '{print $1}')
    PREV_CHECKSUM="${PREV_CHECKSUMS[$file]:-none}"

    if [[ "$CURRENT_CHECKSUM" != "$PREV_CHECKSUM" ]]; then
      if [[ "$PREV_CHECKSUM" == "none" ]]; then
        echo "📄 **Status:** New file"
      else
        echo "✏️ **Status:** Modified since last session"
      fi
    else
      echo "✅ **Status:** Unchanged"
    fi
    echo ""

    # Extract key content (first heading + first paragraph)
    # Get first H1 or H2 heading
    HEADING=$(grep -m 1 -E '^#{1,2} ' "$filepath" 2>/dev/null || echo "# $file")
    echo "$HEADING"
    echo ""

    # Get first substantial paragraph (skip empty lines and headings)
    FIRST_PARA=$(sed -n '/^[^#]/,/^$/p' "$filepath" | head -n 5 | sed '/^$/d')
    if [[ -n "$FIRST_PARA" ]]; then
      echo "$FIRST_PARA"
    else
      echo "*No content preview available*"
    fi
    echo ""

    # For activeContext.md, show current focus
    if [[ "$file" == "activeContext.md" ]]; then
      CURRENT_FOCUS=$(grep -A 2 "^- Current focus:" "$filepath" 2>/dev/null | tail -n 1 || echo "Not specified")
      echo "**Current Focus:** $CURRENT_FOCUS"
      echo ""
    fi

    # For progress.md, show latest entry
    if [[ "$file" == "progress.md" ]]; then
      LATEST_DATE=$(grep -m 1 "^## 202" "$filepath" 2>/dev/null || echo "No recent activity")
      echo "**Latest Activity:** $LATEST_DATE"
      echo ""
    fi

    echo "---"
    echo ""
  done

  # Additional context files
  echo "## Additional Context"
  echo ""
  echo "**Instructions:** $(find "$MEMORY_BANK_DIR/instructions" -name "*.instructions.md" 2>/dev/null | wc -l) files"
  echo "**Chat Modes:** $(find "$MEMORY_BANK_DIR/chatmodes" -name "*.chatmode.md" 2>/dev/null | wc -l) files"
  echo "**Prompts:** $(find "$MEMORY_BANK_DIR/prompts" -name "*.prompt.md" 2>/dev/null | wc -l) files"
  echo ""

  # Next steps recommendation
  echo "---"
  echo ""
  echo "## Recommended Next Steps"
  echo ""
  echo "1. Review **activeContext.md** for current work focus"
  echo "2. Check **progress.md** for recent changes and blockers"
  echo "3. Validate environment with \`pnpm verify\` (in web/ directory)"
  echo "4. Run \`scripts/triad-health.sh\` to validate Memory Bank structure"
  echo "5. Start development server with \`pnpm dev\` (in web/ directory)"
  echo ""

} > "$OUTPUT_FILE"

log "Summary generated: $OUTPUT_FILE"

# Display key highlights
echo ""
info "=== Memory Bank Summary ==="
echo ""
info "Last Session: $PREV_TIMESTAMP"
info "Current Time: $TIMESTAMP"
echo ""

# Count changes
CHANGED_COUNT=0
for file in "${CORE_FILES[@]}"; do
  filepath="$MEMORY_BANK_DIR/$file"
  if [[ -f "$filepath" ]]; then
    CURRENT_CHECKSUM=$(sha256sum "$filepath" | awk '{print $1}')
    PREV_CHECKSUM="${PREV_CHECKSUMS[$file]:-none}"
    if [[ "$CURRENT_CHECKSUM" != "$PREV_CHECKSUM" ]]; then
      ((CHANGED_COUNT++)) || true
      info "  ✏️  $file"
    fi
  fi
done

if [[ $CHANGED_COUNT -eq 0 ]]; then
  info "No changes detected in Memory Bank files"
else
  info "$CHANGED_COUNT file(s) modified since last session"
fi

echo ""
log "View full summary: cat $OUTPUT_FILE"
