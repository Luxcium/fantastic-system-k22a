#!/usr/bin/env bash
# startup.sh - Unified Genesis 22 workspace startup sequence
# Validates environment, loads Memory Bank, checks services
set -euo pipefail

# Source environment detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=detect-env.sh
source "$SCRIPT_DIR/detect-env.sh"

# Colors
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

log() { printf "${GREEN}[INFO]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; }
section() { printf "\n${CYAN}━━━ %s ━━━${NC}\n\n" "$1"; }

# Session state file
readonly SESSION_FILE=".vscode/.genesis-session"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Counters
PHASE_PASSED=0
PHASE_WARNINGS=0
PHASE_FAILED=0

section "Genesis 22 Workspace Startup"
log "Environment: $GENESIS_ENV"
log "Timestamp: $TIMESTAMP"

# Phase 1: Foundation Check
section "Phase 1: Foundation Validation"
if [[ -x "$SCRIPT_DIR/init.sh" ]]; then
  log "Running foundation validation..."
  if "$SCRIPT_DIR/init.sh" > /dev/null 2>&1; then
    log "✓ Foundation validation passed"
    ((PHASE_PASSED++))
  else
    warn "Foundation validation had issues"
    ((PHASE_WARNINGS++))
  fi
else
  error "Foundation script not found: $SCRIPT_DIR/init.sh"
  ((PHASE_FAILED++))
fi

# Phase 2: Environment Validation
section "Phase 2: Environment Validation"
if [[ -f "web/scripts/verify-setup.sh" ]]; then
  log "Running environment checks..."
  if bash web/scripts/verify-setup.sh; then
    log "✓ Environment validation passed"
    ((PHASE_PASSED++))
  else
    warn "Environment validation had warnings"
    ((PHASE_WARNINGS++))
  fi
else
  warn "Environment validation script not found"
  ((PHASE_WARNINGS++))
fi

# Phase 3: Memory Bank Loading
section "Phase 3: Memory Bank Context Loading"
if [[ -x "$SCRIPT_DIR/memory-bank-summary.sh" ]]; then
  log "Generating Memory Bank summary..."
  if "$SCRIPT_DIR/memory-bank-summary.sh"; then
    log "✓ Memory Bank summary generated"
    ((PHASE_PASSED++))
  else
    warn "Memory Bank summary generation had issues"
    ((PHASE_WARNINGS++))
  fi
else
  warn "Memory Bank summary script not found"
  ((PHASE_WARNINGS++))
fi

# Phase 4: Service Health (Environment-Aware)
section "Phase 4: Service Health Checks"
if [[ "$GENESIS_ENV" == "local" ]]; then
  # Local: Check Docker container
  if command -v docker &>/dev/null; then
    if docker ps --filter "name=genesis-postgres" --format "{{.Names}}" | grep -q "genesis-postgres"; then
      log "✓ PostgreSQL container running"
      ((PHASE_PASSED++))
    else
      warn "PostgreSQL container not running"
      warn "Start with: cd web && pnpm db:init"
      ((PHASE_WARNINGS++))
    fi
  else
    warn "Docker not available - skipping container checks"
    ((PHASE_WARNINGS++))
  fi
elif [[ -n "${DATABASE_URL:-}" ]]; then
  # Cloud: Check DATABASE_URL present
  log "✓ DATABASE_URL configured for cloud environment"
  ((PHASE_PASSED++))
else
  warn "No database configuration found"
  warn "Local: Run 'cd web && pnpm db:init'"
  warn "Cloud: Set DATABASE_URL in Codespaces secrets"
  ((PHASE_WARNINGS++))
fi

# Phase 5: Session State Tracking
section "Phase 5: Session State Update"

# Create .vscode directory if needed
mkdir -p .vscode

# Calculate checksums for Memory Bank core files
declare -A CHECKSUMS
CORE_FILES=(
  "memory-bank/projectbrief.md"
  "memory-bank/productContext.md"
  "memory-bank/activeContext.md"
  "memory-bank/systemPatterns.md"
  "memory-bank/techContext.md"
  "memory-bank/dependencies.md"
  "memory-bank/progress.md"
)

for file in "${CORE_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    CHECKSUM=$(sha256sum "$file" | awk '{print $1}')
    CHECKSUMS["$(basename "$file")"]="$CHECKSUM"
  fi
done

# Load previous session
PREV_TIMESTAMP="Never"
if [[ -f "$SESSION_FILE" ]]; then
  if command -v python3 &>/dev/null; then
    PREV_TIMESTAMP=$(python3 -c "import json; print(json.load(open('$SESSION_FILE')).get('lastSessionTimestamp', 'Never'))" 2>/dev/null || echo "Never")
  fi
fi

# Write new session state
if command -v python3 &>/dev/null; then
  python3 << EOF
import json
from pathlib import Path

checksums = {
$(for key in "${!CHECKSUMS[@]}"; do
  echo "    '$key': '${CHECKSUMS[$key]}',"
done)
}

session_data = {
    "lastSessionTimestamp": "$TIMESTAMP",
    "previousSessionTimestamp": "$PREV_TIMESTAMP",
    "environment": "$GENESIS_ENV",
    "memoryBankChecksums": checksums,
    "healthCheckPassed": $PHASE_FAILED == 0
}

Path("$SESSION_FILE").write_text(json.dumps(session_data, indent=2))
EOF
  log "✓ Session state saved"
else
  warn "Python3 not available - session state not saved"
fi

# Display session info
if [[ "$PREV_TIMESTAMP" != "Never" ]]; then
  log "Session resumed from: $PREV_TIMESTAMP"
else
  log "New session started"
fi

# Summary
section "Startup Summary"
echo ""
printf "  ${GREEN}✓ Passed:${NC}   %d phase(s)\n" "$PHASE_PASSED"
printf "  ${YELLOW}⚠ Warnings:${NC} %d phase(s)\n" "$PHASE_WARNINGS"
printf "  ${RED}✗ Failed:${NC}   %d phase(s)\n" "$PHASE_FAILED"
echo ""

if [[ $PHASE_FAILED -gt 0 ]]; then
  error "Startup completed with failures"
  echo ""
  warn "Fix critical issues before proceeding"
  exit 1
elif [[ $PHASE_WARNINGS -gt 0 ]]; then
  warn "Startup completed with warnings"
  echo ""
  log "Review warnings above - some features may be limited"
else
  log "All startup checks passed!"
fi

# Next steps
echo ""
section "Recommended Next Steps"
echo ""
log "1. Review Memory Bank context:"
log "   cat memory-bank/SESSION_START.md"
echo ""
log "2. Navigate to web workspace:"
log "   cd web"
echo ""
log "3. Start development server:"
log "   pnpm dev"
echo ""

if [[ "$GENESIS_ENV" == "codespaces" ]]; then
  log "Codespaces tip: Ports 3022 and 5433 should auto-forward"
fi

exit 0
