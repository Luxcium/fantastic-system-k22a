---
description: Pre-flight validation protocol for markdown files. Ensures compliance before creation to prevent validation failures.
tools: ['codebase']
---

<!-- memory-bank/prompts/validate-before-create.prompt.md -->

# Pre-Creation Markdown Validation

Validate markdown content BEFORE file creation to ensure compliance with Layer 4B resilience protocol.

## Slash Command: /validate-ready - Pre-flight markdown validation checklist

Run this checklist before creating any markdown file to ensure compliance.

### Pre-Flight Checklist

Before creating any `.md`, `.instructions.md`, `.prompt.md`, or `.chatmode.md` file:

#### 1. Frontmatter Validation

- Required: `description` field with clear, concrete explanation
- Format: Valid YAML syntax (three dashes, key-value pairs)
- Position: Must be first lines in file, no content above
- Optional fields: `tools`, `model`, `applyTo` (never add `applyTo` without explicit approval)

#### 2. Path Marker Validation (for factory files)

- Exactly one blank line after frontmatter closing `---`
- Path comment in format: `<!-- memory-bank/path/to/file.md -->`
- Exactly one blank line after path comment
- Path must match actual file location

#### 3. Structure Validation

- Exactly one H1 heading (using `#` ATX style)
- For prompt files: First H2 must be slash command (e.g., `## /command-name`)
- Proper heading hierarchy (no skipping levels: H1 → H2 → H3, never H1 → H3)
- All headings use ATX style with space: `# Heading` not `#Heading`

#### 4. Content Validation

- **Lists**: Use dashes (`-`) consistently, 2-space indent for nested items
- **Code blocks**: Must specify language after opening fence
- **Links**: Use proper markdown syntax, no bare URLs
- **Images**: Must include alt text in `![alt text](path)`
- **Emphasis**: Use asterisks (`*italic*`, `**bold**`)
- **Line endings**: No trailing spaces or hard tabs
- **File ending**: Single newline at end of file

#### 5. Heading Spacing

- Blank line before each heading (except file start)
- Blank line after each heading
- Exception: Frontmatter can be followed directly by path comment

#### 6. Output Verification Workflow

1. Draft content following all rules above
2. Mentally validate against checklist
3. If creating file, run post-creation validation:
   - `./scripts/check-markdown.sh` for full validation
   - `./scripts/auto-repair-markdown.sh` if issues detected
4. Guarantee clean output before marking task complete

### Common Pitfalls to Avoid

- ❌ Missing language on code fences (`` ```bash `` not just `` ``` ``)
- ❌ Bare URLs instead of links (wrap in angle brackets or convert to proper markdown links)
- ❌ Multiple H1 headings in one file
- ❌ Trailing spaces at end of lines
- ❌ Hard tabs instead of spaces
- ❌ Missing blank lines around headings
- ❌ Inconsistent list markers (mixing `*` and `-`)
- ❌ Missing alt text on images

### Integration with Layers

- **Layer 3A** (Instructions): Apply before creating `.instructions.md` files
- **Layer 3B** (Chatmodes): Apply before creating `.chatmode.md` files  
- **Layer 3C** (Prompts): Apply before creating `.prompt.md` files
- **Layer 4B**: This prompt is part of the resilience protocol

### Success Criteria

- ✅ All items in pre-flight checklist validated
- ✅ No validation errors when file is created
- ✅ Agent guarantees compliant output
- ✅ Prevention first: catch issues before creation, not after
