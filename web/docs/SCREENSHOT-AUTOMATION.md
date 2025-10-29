# Screenshot Automation Documentation

Comprehensive guide for capturing automated screenshots of the web application for use in agentic workflows, documentation, testing, and CI/CD pipelines.

## Overview

The screenshot automation system provides:

- **Multiple viewport support** (mobile, tablet, desktop, HD)
- **Theme switching** (light, dark, or both)
- **Full-page captures** for long pages
- **Programmatic API** for integration with workflows
- **CLI interface** for quick captures
- **Cloud and local support** using system browsers
- **Resilient error handling** with retries and fallbacks

## Quick Start

### Basic Usage

```bash
# Capture desktop screenshot in both themes
pnpm screenshot

# Capture complete suite (all viewports + themes)
pnpm screenshot:suite

# Capture specific viewport
pnpm screenshot:mobile
pnpm screenshot:tablet
pnpm screenshot:desktop
```

### Advanced CLI Usage

```bash
# Custom URL
pnpm screenshot --url http://localhost:3000

# Specific theme
pnpm screenshot --theme dark

# Full page screenshot
pnpm screenshot --full-page

# Custom output directory
pnpm screenshot --output screenshots/docs

# Custom filename
pnpm screenshot --filename homepage

# Show browser (headed mode)
pnpm screenshot --headed

# Combine options
pnpm screenshot --viewport mobile --theme dark --filename mobile-dark
```

## Programmatic API

### Basic Example

```typescript
import { captureScreenshot, VIEWPORTS } from '@/utils/screenshot';

// Capture desktop screenshot in both themes
const results = await captureScreenshot({
  url: 'http://localhost:3022',
  theme: 'both'
});

console.log('Screenshots captured:', results.length);
```

### Mobile Screenshot

```typescript
import { captureScreenshot, VIEWPORTS } from '@/utils/screenshot';

const results = await captureScreenshot({
  viewport: VIEWPORTS.mobile,
  filename: 'home-mobile',
  theme: 'dark',
  outputDir: 'screenshots/mobile'
});
```

### Full Page Screenshot

```typescript
const results = await captureScreenshot({
  fullPage: true,
  filename: 'full-page',
  theme: 'light'
});
```

### Complete Suite

```typescript
import { captureSuite } from '@/utils/screenshot';

// Captures mobile, tablet, desktop × light & dark = 6 screenshots
const results = await captureSuite({
  url: 'http://localhost:3022',
  outputDir: 'screenshots/suite'
});
```

## Predefined Viewports

| Name | Width | Height | DPR | Use Case |
|------|-------|--------|-----|----------|
| `mobile` | 375 | 667 | 2x | iPhone-like devices |
| `tablet` | 768 | 1024 | 2x | iPad-like devices |
| `desktop` | 1920 | 1080 | 1x | Standard desktop |
| `desktop-hd` | 2560 | 1440 | 1x | High-res desktop |

## Examples

See `scripts/screenshot-examples.ts` for comprehensive examples.

Run examples:

```bash
pnpm tsx scripts/screenshot-examples.ts
```

## API Reference

### Functions

#### `captureScreenshot(options?: ScreenshotOptions): Promise<ScreenshotResult[]>`

Captures one or more screenshots based on the provided options.

#### `captureMultipleViewports(viewports: ViewportConfig[], options?: ScreenshotOptions): Promise<ScreenshotResult[]>`

Captures screenshots across multiple viewports.

#### `captureSuite(options?: ScreenshotOptions): Promise<ScreenshotResult[]>`

Captures a complete suite (mobile, tablet, desktop × light & dark).

### Constants

#### `VIEWPORTS: Record<string, ViewportConfig>`

Predefined viewport configurations for common devices.
