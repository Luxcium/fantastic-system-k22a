#!/usr/bin/env bash
# setup-cloud.sh - Cloud-specific initialization (Codespaces, CI)
# No Docker dependencies, relies on environment variables
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
readonly NC='\033[0m'

log() { printf "${GREEN}[INFO]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; }
info() { printf "${BLUE}[SETUP]${NC} %s\n" "$1"; }

info "=== Genesis 22 Cloud Setup ==="
log "Environment: $GENESIS_ENV"
echo ""

# Validate required environment variables
MISSING_VARS=()
REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")

info "Checking required environment variables..."
for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    MISSING_VARS+=("$var")
    error "  ✗ $var not set"
  else
    log "  ✓ $var configured"
  fi
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  echo ""
  warn "Missing required environment variables!"
  warn "In GitHub Codespaces, set these as secrets:"
  warn "  Settings → Codespaces → New secret"
  echo ""
  warn "Required secrets:"
  for var in "${MISSING_VARS[@]}"; do
    warn "  - $var"
  done
  echo ""
  warn "Alternatively, create web/.env.local manually"
  warn "Setup will continue but features may be limited"
  echo ""
fi

# Run Memory Bank validation
info "Validating Memory Bank structure..."
if [[ -x "$SCRIPT_DIR/triad-health.sh" ]]; then
  "$SCRIPT_DIR/triad-health.sh" || warn "Triad health check had warnings"
else
  warn "Triad health script not found or not executable"
fi

# Install dependencies
info "Installing web dependencies..."
if [[ -d "web" ]]; then
  cd web

  if command -v pnpm &>/dev/null; then
    log "Running pnpm install..."
    pnpm install || error "pnpm install failed"
  else
    error "pnpm not found. Please install pnpm first."
    exit 1
  fi

  # Generate Prisma Client
  info "Generating Prisma Client..."
  pnpm db:generate || warn "Prisma generate failed"

  # Run migrations if DATABASE_URL is available
  if [[ -n "${DATABASE_URL:-}" ]]; then
    info "Running database migrations..."
    pnpm db:migrate || warn "Migrations failed - database may not be accessible"
  else
    warn "DATABASE_URL not set - skipping migrations"
  fi

  cd ..
else
  error "web/ directory not found"
  exit 1
fi

# Success message
echo ""
log "=== Cloud setup complete! ==="
echo ""
info "Next steps:"
info "  1. Verify setup: cd web && pnpm verify"
info "  2. Start dev server: cd web && pnpm dev"
info "  3. View Memory Bank summary: cat memory-bank/SESSION_START.md"
echo ""

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  warn "Note: Some environment variables are missing"
  warn "Full functionality requires DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL"
fi
