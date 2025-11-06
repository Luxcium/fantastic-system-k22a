#!/usr/bin/env bash

# Markdown Validation Script for AI Agents
# This script ensures markdown files meet strict quality standards
# AI agents MUST run this script after making any markdown changes

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Markdown Validation for AI Agents                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the web directory
if [ ! -f "$WEB_DIR/package.json" ]; then
  echo -e "${RED}✗ Error: Must be run from web directory or its subdirectories${NC}"
  exit 1
fi

cd "$WEB_DIR"

echo -e "${YELLOW}→ Checking for markdown files...${NC}"
MD_COUNT=$(find . -name "*.md" -not -path "./node_modules/*" -not -path "./.next/*" | wc -l)
echo -e "${GREEN}✓ Found ${MD_COUNT} markdown file(s) to validate${NC}"
echo ""

echo -e "${YELLOW}→ Running markdownlint validation...${NC}"
if pnpm markdown:lint; then
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✓ SUCCESS: All markdown files pass validation!             ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${GREEN}All markdown files conform to the strict quality standards:${NC}"
  echo -e "  ${GREEN}✓${NC} Proper heading hierarchy (incremental levels)"
  echo -e "  ${GREEN}✓${NC} Consistent list formatting (dashes, proper indentation)"
  echo -e "  ${GREEN}✓${NC} No trailing whitespace"
  echo -e "  ${GREEN}✓${NC} No hard tabs (spaces only)"
  echo -e "  ${GREEN}✓${NC} Blank lines around headings, lists, and code blocks"
  echo -e "  ${GREEN}✓${NC} Language specified for all code blocks"
  echo -e "  ${GREEN}✓${NC} Alt text present for all images"
  echo -e "  ${GREEN}✓${NC} No bare URLs (properly formatted links)"
  echo -e "  ${GREEN}✓${NC} Files end with single newline"
  echo ""
  exit 0
else
  EXIT_CODE=$?
  echo ""
  echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ✗ FAILURE: Markdown validation errors detected!            ║${NC}"
  echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${RED}AI Agent Action Required:${NC}"
  echo -e "${YELLOW}1. Review the errors listed above${NC}"
  echo -e "${YELLOW}2. Fix the violations in the affected files${NC}"
  echo -e "${YELLOW}3. Run 'pnpm markdown:fix' to auto-fix simple issues${NC}"
  echo -e "${YELLOW}4. Run this script again to verify fixes${NC}"
  echo -e "${YELLOW}5. Report the validation results in your progress update${NC}"
  echo ""
  echo -e "${RED}DO NOT proceed with committing changes until all markdown errors are resolved!${NC}"
  echo ""
  exit $EXIT_CODE
fi
