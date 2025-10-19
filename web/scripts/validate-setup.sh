#!/bin/bash
# Genesis Utilities - System Validation Script
# Validates the complete foundation setup

set -e

echo "🔍 Genesis Utilities - System Validation"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0

# Helper functions
success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

info() {
    echo -e "  $1"
}

# Check prerequisites
echo "📋 Checking Prerequisites"
echo "------------------------"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ "${NODE_VERSION:1:2}" -ge "22" ]]; then
        success "Node.js $NODE_VERSION"
    else
        error "Node.js version must be 22 or higher (found $NODE_VERSION)"
    fi
else
    error "Node.js is not installed"
fi

# pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    success "pnpm $PNPM_VERSION"
else
    error "pnpm is not installed"
fi

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | tr -d ',')
    success "Docker $DOCKER_VERSION"
else
    error "Docker is not installed"
fi

# Docker Compose
if command -v docker compose &> /dev/null || command -v docker-compose &> /dev/null; then
    success "Docker Compose available"
else
    error "Docker Compose is not available"
fi

echo ""

# Check file structure
echo "📁 Checking File Structure"
echo "-------------------------"

REQUIRED_FILES=(
    "package.json"
    "docker-compose.yml"
    ".env.local.example"
    "prisma/schema.prisma"
    "prisma/seed.ts"
    "src/middleware.ts"
    "src/lib/db/prisma.ts"
    "src/lib/navigation/registry.ts"
    "vitest.config.ts"
    "playwright.config.ts"
    "SETUP.md"
    "README.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        success "$file"
    else
        error "Missing file: $file"
    fi
done

echo ""

# Check dependencies
echo "📦 Checking Dependencies"
echo "-----------------------"

if [[ -d "node_modules" ]]; then
    success "node_modules directory exists"

    # Check key dependencies
    KEY_DEPS=("next" "react" "prisma" "@prisma/client" "next-auth" "zustand" "vitest" "@playwright/test")
    for dep in "${KEY_DEPS[@]}"; do
        if [[ -d "node_modules/$dep" ]]; then
            success "$dep installed"
        else
            error "$dep not installed"
        fi
    done
else
    warning "node_modules not found - run 'pnpm install'"
fi

echo ""

# Check environment configuration
echo "🔧 Checking Environment"
echo "----------------------"

if [[ -f ".env.local" ]]; then
    success ".env.local exists"

    # Check required variables
    if grep -q "DATABASE_URL=" .env.local; then
        success "DATABASE_URL configured"
    else
        error "DATABASE_URL not found in .env.local"
    fi

    if grep -q "NEXTAUTH_SECRET=" .env.local; then
        SECRET=$(grep "NEXTAUTH_SECRET=" .env.local | cut -d '=' -f2)
        if [[ ${#SECRET} -ge 32 ]]; then
            success "NEXTAUTH_SECRET configured (${#SECRET} characters)"
        else
            error "NEXTAUTH_SECRET too short (must be at least 32 characters)"
        fi
    else
        error "NEXTAUTH_SECRET not found in .env.local"
    fi

    if grep -q "NEXTAUTH_URL=" .env.local; then
        success "NEXTAUTH_URL configured"
    else
        error "NEXTAUTH_URL not found in .env.local"
    fi
else
    error ".env.local not found - copy from .env.local.example"
fi

echo ""

# Check database
echo "🗄️ Checking Database"
echo "-------------------"

if command -v docker &> /dev/null; then
    if docker ps | grep -q "genesis-postgres"; then
        success "PostgreSQL container is running"

        # Check if container is healthy
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' genesis-postgres 2>/dev/null || echo "none")
        if [[ "$HEALTH" == "healthy" ]]; then
            success "Database health check passing"
        elif [[ "$HEALTH" == "none" ]]; then
            warning "Database health check not configured"
        else
            error "Database health check failing (status: $HEALTH)"
        fi
    else
        warning "PostgreSQL container not running - run 'pnpm db:init'"
    fi
fi

echo ""

# Check Prisma
echo "🔷 Checking Prisma"
echo "-----------------"

if [[ -d "prisma/generated" ]] || [[ -d "node_modules/.prisma/client" ]]; then
    success "Prisma client generated"
else
    warning "Prisma client not generated - run 'pnpm db:generate'"
fi

if [[ -d "prisma/migrations" ]]; then
    MIGRATION_COUNT=$(ls -1 prisma/migrations | wc -l)
    if [[ $MIGRATION_COUNT -gt 0 ]]; then
        success "Database migrations exist ($MIGRATION_COUNT migrations)"
    else
        warning "No migrations found - run 'pnpm db:migrate'"
    fi
else
    warning "Migrations directory not found - run 'pnpm db:migrate'"
fi

echo ""

# Check build
echo "🏗️ Checking Build Status"
echo "-----------------------"

if [[ -d ".next" ]]; then
    success ".next build directory exists"
else
    info "No build found - run 'pnpm build' to create production build"
fi

echo ""

# Summary
echo "📊 Validation Summary"
echo "===================="
echo ""

if [[ $ERRORS -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}🎉 All checks passed! Your system is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start development server: pnpm dev"
    echo "  2. Run tests: pnpm test"
    echo "  3. Run E2E tests: pnpm test:e2e"
    echo ""
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}⚠ Validation completed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Your system is functional but has some warnings."
    echo "Review the warnings above and address them if needed."
    echo ""
    exit 0
else
    echo -e "${RED}✗ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo "Refer to SETUP.md for detailed setup instructions."
    echo ""
    exit 1
fi
