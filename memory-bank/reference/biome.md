# Biome Quick Reference

> **Modern, fast, and unified linting and formatting for Genesis 22**

## 🚀 Quick Start

```bash
cd web

# Check everything (lint + format)
pnpm lint

# Format all files
pnpm format

# Fix all auto-fixable issues
pnpm biome check --write
```

## 📦 Installation

Biome is already installed! Just install dependencies:

```bash
cd web
pnpm install
```

## 🔧 VS Code Setup

1. Install extension: **Biome** (`biomejs.biome`)
2. Reload VS Code
3. Format on save is already enabled!

## 🎯 Common Tasks

### Lint files

```bash
pnpm biome check
```

### Format files

```bash
pnpm biome format --write .
```

### Organize imports

```bash
pnpm biome check --write --organize-imports-enabled=true
```

### CI/CD mode (errors only)

```bash
pnpm biome check --diagnostic-level=error
```

## 📚 Learn More

- Full guide: `../instructions/biome-linting-formatting.instructions.md`
- Configuration: `web/biome.json`
- Official docs: https://biomejs.dev/

## ⚡ Why Biome?

- **10-100x faster** than ESLint
- **Single tool** for lint + format + imports
- **Better errors** with clear suggestions
- **Zero config** for most use cases

## 🎨 Configuration

Location: `web/biome.json`

Currently enabled:

- ✅ Recommended linting rules
- ✅ React & Next.js specific rules
- ✅ Automatic import organization
- ✅ 2-space indentation
- ✅ Git integration

## 🐛 Troubleshooting

### Command not found?

```bash
cd web && pnpm install
```

### VS Code not formatting?

1. Check extension is installed
2. Reload VS Code window
3. Verify settings: `Cmd/Ctrl + ,` → search "default formatter"

### Need help?

See the full documentation in `../instructions/biome-linting-formatting.instructions.md`
