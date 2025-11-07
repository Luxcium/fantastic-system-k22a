# Strict Markdown Protocol for AI Agents

## Overview

This document defines the mandatory markdown linting and validation protocol that **all AI agents must follow** when creating or modifying markdown files in this repository. This ensures consistent, high-quality markdown that is readable, accessible, and maintainable.

## Core Principle

**AI agents MUST NOT leave markdown files in a broken or non-compliant state.** Every markdown change must be validated before committing.

## Tooling

The project uses **markdownlint-cli2** for markdown linting and validation, configured via:

- `.markdownlint-cli2.jsonc` - Comprehensive linting rules
- `.markdownlintignore` - Files/directories to exclude from linting

## Mandatory Validation Workflow

### For Every Markdown Change

1. **After making any markdown edits**, run validation:

   ```bash
   cd web
   pnpm markdown:validate
   ```

2. **If validation fails**:
   - Review the specific errors reported
   - Fix violations manually or run auto-fix:
     ```bash
     pnpm markdown:fix
     ```
   - Re-run validation until all errors are resolved

3. **Report validation status** in your progress update:
   - ✅ "All markdown files pass validation"
   - ⚠️ "Fixed X markdown violations before committing"

### Available Commands

```bash
# Full validation with formatted output (USE THIS)
pnpm markdown:validate

# Direct linting (shows raw errors)
pnpm markdown:lint

# Auto-fix simple issues
pnpm markdown:fix
```

## Enforced Rules

The following markdown standards are strictly enforced:

### Headings

- ✅ Use ATX-style headings with single space: `# Heading`
- ✅ Increment heading levels by one at a time (H1 → H2, not H1 → H3)
- ✅ Surround headings with blank lines
- ✅ Single top-level heading (H1) per document
- ✅ No trailing punctuation in headings (`.`, `,`, `;`, `:`, `!`, `?`)

### Lists

- ✅ Use dashes (`-`) for unordered lists consistently
- ✅ Use 2 spaces for list indentation
- ✅ Surround lists with blank lines
- ✅ Ordered lists can use any numbering style (1,2,3 or 1,1,1)
- ✅ Single space after list markers

### Whitespace

- ✅ No trailing spaces at end of lines
- ✅ No hard tabs - use spaces only
- ✅ Maximum 1 consecutive blank line
- ✅ No spaces inside emphasis, code spans, or links

### Code Blocks

- ✅ Always specify language for fenced code blocks:
  ```typescript
  // Good
  const x = 1;
  ```
- ✅ Use backticks (```) for fenced code blocks, not tildes
- ✅ Surround code blocks with blank lines
- ✅ Use `text` or `bash` for plain text/shell output

### Links and Images

- ✅ Use descriptive link text (not "click here")
- ✅ All images must have alt text for accessibility
- ✅ No bare URLs - use proper markdown links or angle brackets
- ✅ Format: `[descriptive text](url)` or `<url>`

### Other Rules

- ✅ Files must end with single newline character
- ✅ Limit inline HTML to essential elements only
- ✅ Use consistent horizontal rule style: `---`
- ✅ No emphasis used instead of headings

## Special Exceptions

Files matching these patterns are excluded from linting:

- `*.prompt.md` - Agent prompt cards with specific formatting
- `*.chatmode.md` - Chat mode cards with specific formatting
- `node_modules/` - Dependencies
- `.next/`, `dist/`, `build/` - Build outputs

## Integration with Git Workflow

Markdown validation is integrated into the pre-commit hook via `lint-staged`:

```json
"lint-staged": {
  "*.md": [
    "markdownlint-cli2 --fix",
    "biome format --write --no-errors-on-unmatched"
  ]
}
```

This means:

1. When you stage markdown files for commit
2. markdownlint automatically fixes issues
3. Biome formats the file
4. Changes are re-staged
5. Commit proceeds only if no errors remain

## Configuration Details

### Strict Rules Enabled

The configuration enforces CommonMark and GitHub Flavored Markdown (GFM) standards:

- **MD001** - Heading increment by one level
- **MD003** - ATX-style headings
- **MD004** - Consistent unordered list style (dash)
- **MD007** - List indentation (2 spaces)
- **MD009** - No trailing spaces (strict mode)
- **MD010** - No hard tabs
- **MD012** - Max 1 consecutive blank line
- **MD022** - Blank lines around headings
- **MD031** - Blank lines around fenced code blocks
- **MD032** - Blank lines around lists
- **MD034** - No bare URLs
- **MD040** - Fenced code language required
- **MD045** - Images must have alt text
- **MD047** - File must end with newline

### Flexible Rules

Some rules are relaxed for practical use:

- **MD013** - Line length (disabled - no maximum)
- **MD029** - Ordered list numbering (allow any style)
- **MD033** - Limited inline HTML allowed
- **MD041** - First line H1 (disabled for front matter)
- **MD044** - Proper name capitalization (key terms configured)

## Example: Compliant Markdown

```markdown
# Document Title

## Introduction

This is a paragraph with proper spacing.

- List item one
- List item two
  - Nested item
- List item three

## Code Example

Here's a TypeScript example:

\`\`\`typescript
const greeting: string = "Hello, world!";
console.log(greeting);
\`\`\`

## Links and Images

Visit [GitHub](https://github.com) for more information.

![Project logo with alt text](path/to/image.png)

## Conclusion

Final thoughts go here.
```

## AI Agent Responsibilities

As an AI agent working in this repository, you **MUST**:

1. ✅ Run `pnpm markdown:validate` after any markdown changes
2. ✅ Fix all reported violations before committing
3. ✅ Report validation results in progress updates
4. ✅ Never commit markdown files with linting errors
5. ✅ Use auto-fix (`pnpm markdown:fix`) for simple issues
6. ✅ Manually review and fix issues that can't be auto-fixed

## Troubleshooting

### Common Issues and Fixes

**Issue**: Fenced code block without language

```markdown
<!-- ❌ Bad -->

\`\`\`
code here
\`\`\`

<!-- ✅ Good -->

\`\`\`typescript
code here
\`\`\`
```

**Issue**: Missing blank lines around headings

```markdown
<!-- ❌ Bad -->

Some text

## Heading

More text

<!-- ✅ Good -->

Some text

## Heading

More text
```

**Issue**: Trailing spaces

```markdown
<!-- ❌ Bad -->

Line with spaces at end

<!-- ✅ Good -->

Line with no trailing spaces
```

**Issue**: Bare URL

```markdown
<!-- ❌ Bad -->

Visit https://example.com

<!-- ✅ Good -->

Visit [example.com](https://example.com)
or <https://example.com>
```

## References

- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [CommonMark Specification](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [markdownlint-cli2 Documentation](https://github.com/DavidAnson/markdownlint-cli2)

## Last Updated

2025-11-06 - Initial protocol implementation with markdownlint-cli2 v0.18.1
