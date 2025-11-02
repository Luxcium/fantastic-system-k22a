#!/usr/bin/env bash
# Genesis 22 - Setup Verification Script
# This script verifies that all required components are properly installed and configured

# Don't use set -e because we want to continue checking even if some checks fail

# Source environment detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../../scripts/detect-env.sh
source "$SCRIPT_DIR/../../scripts/detect-env.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verification functions
check_node() {
    print_check "Checking Node.js version..."
    if command -v node &> /dev/null; then
        NODE_VERSION_RAW=$(node --version)
        NODE_MAJOR=$(echo "$NODE_VERSION_RAW" | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_MAJOR" -lt 22 ]; then
            print_fail "Node.js $NODE_VERSION_RAW found, but v22+ is required"
        elif [ "$NODE_MAJOR" -gt 22 ]; then
            print_warn "Node.js $NODE_VERSION_RAW detected. Baseline requirement is v22+. This major version hasn't been validated yet"
        else
            print_pass "Node.js $NODE_VERSION_RAW satisfies the v22+ requirement"
        fi
    else
        print_fail "Node.js is not installed"
    fi
}

check_pnpm() {
    print_check "Checking pnpm version..."
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version 2>/dev/null || echo "unknown")
        print_pass "pnpm $PNPM_VERSION installed"
    else
        print_fail "pnpm is not installed. Install with: npm install -g pnpm"
    fi
}

check_docker() {
    print_check "Checking Docker..."
    if command -v docker &> /dev/null; then
        if docker ps &> /dev/null; then
            print_pass "Docker is installed and running"
        else
            print_warn "Docker is installed but not running. Start Docker Desktop."
        fi
    else
        # In cloud environments, Docker might not be needed if using DATABASE_URL
        if [[ "$GENESIS_ENV" =~ ^(codespaces|ci)$ ]] && [[ -n "${DATABASE_URL:-}" ]]; then
            print_info "Docker not required in cloud environment with DATABASE_URL"
        else
            print_fail "Docker is not installed"
        fi
    fi
}

check_dependencies() {
    print_check "Checking Node.js dependencies..."
    if [ -d "node_modules" ]; then
        print_pass "node_modules directory exists"
    else
        print_fail "node_modules not found. Run: pnpm install"
    fi
}

check_env_file() {
    print_check "Checking environment configuration..."
    if [ -f ".env.local" ]; then
        print_pass ".env.local file exists"

        # Check for required variables
        if grep -q "NEXTAUTH_SECRET" .env.local; then
            SECRET=$(grep "NEXTAUTH_SECRET" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d ' ')
            if [ ${#SECRET} -ge 32 ]; then
                print_pass "NEXTAUTH_SECRET is properly configured (${#SECRET} characters)"
            else
                print_warn "NEXTAUTH_SECRET should be at least 32 characters"
            fi
        else
            print_fail "NEXTAUTH_SECRET not found in .env.local"
        fi

        if grep -q "DATABASE_URL" .env.local; then
            print_pass "DATABASE_URL is configured"
        else
            print_fail "DATABASE_URL not found in .env.local"
        fi
    else
        print_warn ".env.local not found. Copy from .env.example and configure"
    fi
}

check_directories() {
    print_check "Checking directory structure..."

    REQUIRED_DIRS=(
        "src/app"
        "src/components"
        "src/lib"
        "src/features"
        ".key"
        "prisma"
    )

    for dir in "${REQUIRED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            print_pass "Directory exists: $dir"
        else
            print_fail "Missing directory: $dir"
        fi
    done
}

check_database() {
    print_check "Checking database connection..."

    # Cloud environment: check for DATABASE_URL
    if [[ "$GENESIS_ENV" =~ ^(codespaces|ci)$ ]] && [[ -n "${DATABASE_URL:-}" ]]; then
        print_pass "DATABASE_URL configured for cloud environment"
        # Try to check migrations status
        if command -v pnpm &> /dev/null; then
            if pnpm prisma migrate status &> /dev/null; then
                print_pass "Database migrations are current"
            else
                print_warn "Database migrations may need to be applied. Run: pnpm db:migrate"
            fi
        fi
    # Local environment: check Docker container
    elif docker ps --format '{{.Names}}' 2>/dev/null | grep -q "genesis-postgres"; then
        print_pass "PostgreSQL container is running"
    else
        if [[ "$GENESIS_ENV" == "local" ]]; then
            print_warn "PostgreSQL container not running. Start with: pnpm db:init"
        else
            print_warn "No database configuration found. Configure DATABASE_URL or start container."
        fi
    fi
}

check_prisma() {
    print_check "Checking Prisma setup..."

    if [ -f "prisma/schema.prisma" ]; then
        print_pass "Prisma schema exists"
    else
        print_fail "Prisma schema not found"
    fi

    if [ -d "prisma/generated/client" ]; then
        print_pass "Prisma Client is generated"
    else
        print_warn "Prisma Client not generated. Run: pnpm db:generate"
    fi
}

check_typescript() {
    print_check "Checking TypeScript configuration..."
    if [ -f "tsconfig.json" ]; then
        print_pass "tsconfig.json exists"

        # Only check compilation if pnpm is available
        if command -v pnpm &> /dev/null; then
            if pnpm run type-check &> /dev/null; then
                print_pass "TypeScript compilation successful"
            else
                print_warn "TypeScript has compilation errors. Run: pnpm type-check"
            fi
        else
            print_info "Skipping TypeScript compilation check (pnpm not available)"
        fi
    else
        print_fail "tsconfig.json not found"
    fi
}

check_git_hooks() {
    print_check "Checking Git hooks..."
    if [ -d "../.husky" ]; then
        print_pass "Husky is configured"
        if [ -f "../.husky/pre-commit" ]; then
            print_pass "Pre-commit hook exists"
        else
            print_warn "Pre-commit hook not found"
        fi
    else
        print_warn "Husky not initialized. Git hooks may not be active."
    fi
}

check_build() {
    print_check "Checking build configuration..."
    if [ -f "next.config.ts" ]; then
        print_pass "Next.js configuration exists"
    else
        print_fail "next.config.ts not found"
    fi

    if [ -f "biome.json" ]; then
        print_pass "Biome configuration exists"
    else
        print_fail "biome.json not found"
    fi
}

# Main execution
print_header "Genesis 22 Setup Verification"

print_info "Starting verification checks..."
echo ""

print_header "System Requirements"
check_node
check_pnpm
check_docker

print_header "Project Structure"
check_directories

print_header "Dependencies"
check_dependencies

print_header "Configuration"
check_env_file
check_typescript
check_build
check_git_hooks

print_header "Database"
check_database
check_prisma

# Summary
print_header "Verification Summary"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo -e "${GREEN}Your development environment is ready.${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  1. ${BLUE}pnpm dev${NC}          - Start development server"
    echo -e "  2. ${BLUE}pnpm test${NC}         - Run tests"
    echo -e "  3. ${BLUE}pnpm db:seed${NC}      - Seed database with test data"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo -e "Common fixes:"
    echo -e "  - Install missing dependencies: ${BLUE}pnpm install${NC}"
    echo -e "  - Create .env.local: ${BLUE}cp .env.example .env.local${NC}"
    echo -e "  - Generate Prisma Client: ${BLUE}pnpm db:generate${NC}"
    echo -e "  - Start database: ${BLUE}pnpm db:init${NC}"
    echo ""
    exit 1
fi
