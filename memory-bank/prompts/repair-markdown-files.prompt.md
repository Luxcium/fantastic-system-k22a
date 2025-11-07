---
description: Automated repair protocol for markdown files with validation failures. Self-healing workflow with retry cycles.
tools: ['codebase', 'editFiles']
---

<!-- memory-bank/prompts/repair-markdown-files.prompt.md -->

# Markdown Repair and Compliance Protocol

Automatically detect and repair markdown validation failures before they block workflows.

## Slash Command: /repair-markdown - Auto-repair markdown validation failures

Run this command to detect and automatically fix markdown validation issues using the resilience protocol.

### Repair Workflow

#### Phase 1: Detection

1. Run validation: `./scripts/check-markdown.sh`
2. Parse error output to identify specific violations
3. Categorize issues:
   - **Auto-fixable**: Trailing spaces, tabs, list formatting, spacing
   - **Semi-auto**: Code block languages, bare URLs (needs context)
   - **Manual**: Complex structural issues, heading hierarchy

#### Phase 2: Auto-Repair

Common auto-fixable issues:

- **MD009 - Trailing spaces**: Remove all trailing whitespace
- **MD010 - Hard tabs**: Convert to spaces (2-space indent)
- **MD022 - Heading spacing**: Add blank lines around headings
- **MD004/MD007 - List formatting**: Use dashes, 2-space indent
- **MD012 - Multiple blanks**: Reduce to single blank line
- **MD031/MD032 - Fenced code/list spacing**: Add blank lines

Semi-automatic fixes (require judgment):

- **MD040 - Code block language**: Infer from content or context
  - Shell commands → `bash`
  - JSON data → `json`
  - JavaScript → `javascript` or `typescript`
  - Plain text listings → `text`
- **MD034 - Bare URLs**: Wrap in angle brackets `<url>` or convert to link

#### Phase 3: Automated Repair Cycle

Run the repair script:

```bash
./scripts/auto-repair-markdown.sh
```

This script:

1. Runs Prettier for consistent formatting
2. Runs `markdownlint --fix` for structural fixes
3. Re-validates with `check-markdown.sh`
4. Repeats up to 3 times
5. Reports success or escalates to manual

#### Phase 4: Manual Fixes

If auto-repair fails after 3 attempts, manually fix:

1. **Heading hierarchy**: Ensure no levels are skipped
   - ✅ H1 → H2 → H3
   - ❌ H1 → H3 (missing H2)

2. **Multiple H1s**: Only one H1 per file
   - Convert additional H1s to H2 or H3 as appropriate

3. **Image alt text**: Add descriptive alt text
   - ❌ `![](image.png)`
   - ✅ `![Screenshot of dashboard](image.png)`

4. **Link syntax**: Fix broken link references
   - Verify all `[text](url)` links work
   - Check relative paths resolve correctly

5. **Frontmatter**: Fix YAML syntax errors
   - Proper indentation
   - Quoted values with special characters
   - Valid key-value pairs

#### Phase 5: Validation

After repairs:

1. Run `./scripts/check-markdown.sh` again
2. Verify all errors resolved
3. If new errors appear, analyze and fix
4. Repeat until validation passes

#### Phase 6: Prevention

Document patterns to prevent recurrence:

1. Update agent instructions if issue is common
2. Add to validation checklist
3. Improve factory templates
4. Share learnings in Memory Bank

### Quick Reference

```bash
# Full validation
./scripts/check-markdown.sh

# Auto-repair cycle (up to 3 attempts)
./scripts/auto-repair-markdown.sh

# Manual lint check (no auto-format)
cd web && pnpm markdown:lint

# Manual fix (single pass)
cd web && pnpm markdown:fix
```

### Common Error Patterns

#### Pattern: Missing Code Languages

**Error**: `MD040/fenced-code-language`

**Fix**: Add language after opening fence

```text
# Before
```
code here
```

# After
```bash
code here
```
```

#### Pattern: Bare URLs

**Error**: `MD034/no-bare-urls`

**Fix**: Wrap in angle brackets or make proper link

```text
Before: Bare URL in text
Fix Option 1: Wrap in angle brackets
Fix Option 2: Convert to proper markdown link with descriptive text
```

#### Pattern: Heading Spacing

**Error**: `MD022/blanks-around-headings`

**Fix**: Add blank lines

```markdown
<!-- Before -->
Some paragraph.
## Heading
Content starts here.

<!-- After -->
Some paragraph.

## Heading

Content starts here.
```

#### Pattern: Trailing Spaces

**Error**: `MD009/no-trailing-spaces`

**Fix**: Remove spaces at line end (auto-fixable)

### Success Metrics

- ✅ Zero validation errors after repair
- ✅ Auto-repair successful within 3 attempts (ideal)
- ✅ Clear error messages guide manual fixes
- ✅ Patterns documented to prevent recurrence
- ✅ All files pass `check-markdown.sh`

### Integration with Layer 4B

This repair prompt is part of the three-stage markdown resilience pipeline:

1. **Prevention** (validate-before-create) → Catch issues before creation
2. **Detection** (check-markdown.sh) → Identify violations
3. **Repair** (THIS PROMPT + auto-repair-markdown.sh) → Self-healing fixes

See [Layer 4B instructions](../instructions/layer-4b-markdown-resilience.instructions.md) for complete protocol.
