---
description: Guide for using Biome as the modern all-in-one linter and formatter in the Genesis 22 project.
---

# Biome Linting and Formatting

## Overview

Biome is a fast, modern toolchain that combines linting, formatting, and import organization in a single tool. It replaces the traditional ESLint + Prettier combination with better performance and simpler configuration.

**Version:** 2.2.0 (October 2025)
**Configuration:** `web/biome.json`

## Why Biome?

- **Single tool** replaces ESLint, Prettier, and import organizers
- **10-100x faster** than ESLint (in typical benchmarks; actual performance may vary) due to Rust implementation
- **Zero configuration** required for most projects (though we customize for Next.js/React)
- **Better error messages** with contextual suggestions
- **Built-in import sorting** and organization
- **Native TypeScript support** without plugins

## Common Commands

### Check (Lint + Format Check)

```bash
cd web
pnpm biome check
```

This command:
- Lints all files for errors and warnings
- Checks formatting without modifying files
- Reports issues with file paths and line numbers

### Format Files

```bash
cd web
pnpm biome format --write .
```

Formats all files in place according to the Biome configuration.

### Check with Auto-fix

```bash
cd web
pnpm biome check --write
```

Runs linting and formatting, automatically fixing all safe issues.

### Lint Only

```bash
cd web
pnpm biome lint
```

### Format Only (Check)

```bash
cd web
pnpm biome format
```

## Configuration Structure

The `web/biome.json` file configures Biome behavior:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**", "!node_modules", "!.next", "!dist", "!build"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

### Key Configuration Sections

- **vcs**: Git integration for respecting `.gitignore`
- **files**: Path patterns to include/exclude
- **formatter**: Code formatting rules (indent, line width, etc.)
- **linter**: Linting rules and domain-specific recommendations
- **assist**: Code actions like import organization

## VS Code Integration

The `.vscode/settings.json` configures Biome as the default formatter:

- **Default formatter:** `biomejs.biome`
- **Format on save:** Enabled
- **Code actions on save:** 
  - `quickfix.biome`: Apply Biome quick fixes
  - `source.organizeImports.biome`: Organize imports with Biome

### Required VS Code Extension

Install the official Biome extension:
- **Extension ID:** `biomejs.biome`
- **Name:** Biome

## Package.json Scripts

Convenient npm/pnpm scripts in `web/package.json`:

```json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write"
  }
}
```

Usage:
```bash
cd web
pnpm lint        # Check for issues
pnpm format      # Format all files
```

## CI/CD Integration

For automated checks in CI pipelines:

```bash
# In CI environment
cd web
pnpm biome check --diagnostic-level=error
```

The `--diagnostic-level=error` flag ensures only errors (not warnings) cause CI failures.

## Migration from ESLint/Prettier

### What Changed

1. **Removed tools:**
   - ESLint and all plugins removed
   - Prettier removed
   - eslint-config-prettier removed

2. **Added tool:**
   - @biomejs/biome package

3. **Configuration simplified:**
   - Single `biome.json` replaces `.eslintrc.*` and `.prettierrc.*`

4. **VS Code settings:**
   - Default formatter changed to `biomejs.biome`
   - Code actions updated to use Biome-specific actions

### Compatibility Notes

- **Formatting:** Biome's formatter is similar to Prettier but not identical
- **Linting rules:** Biome has its own rule set, generally compatible with ESLint recommended rules
- **Custom rules:** If you had custom ESLint rules, check if Biome has equivalents

## Troubleshooting

### Biome Not Found

If you get "biome: command not found":
```bash
cd web
pnpm install
```

### VS Code Not Using Biome

1. Install the Biome VS Code extension (`biomejs.biome`)
2. Reload VS Code window
3. Check `.vscode/settings.json` has Biome as default formatter

### Formatting Issues

If files aren't formatting as expected:
```bash
cd web
pnpm biome format --write --diagnostic-level=info .
```

The `--diagnostic-level=info` flag shows detailed information about what Biome is doing.

## Best Practices

1. **Run checks before committing:**
   ```bash
   cd web && pnpm biome check --write
   ```

2. **Use VS Code integration:**
   - Enable format on save for automatic formatting
   - Let Biome organize imports automatically

3. **Keep configuration minimal:**
   - Start with recommended rules
   - Only customize when necessary
   - Document why custom rules are needed

4. **CI/CD:**
   - Run `biome check` in CI to catch issues
   - Use `--diagnostic-level=error` to avoid failing on warnings

## References

- [Biome Official Documentation](https://biomejs.dev/)
- [Biome Configuration Schema](https://biomejs.dev/schemas/2.2.0/schema.json)
- [Biome VS Code Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [Migration Guide from ESLint/Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/)

## Related Instructions

- [Layer 2 — Development Environment Verification](./layer-2-verify-and-bootstrap.instructions.md)
- [Conventional Commits](./conventional-commits-must-be-used.instructions.md)

## Updates Log

- **2025-01-27:** Initial documentation for Biome 2.2.0 integration
