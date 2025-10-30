# Screenshot Automation Quick Reference

Quick reference for using the screenshot automation system in agentic workflows.

## CLI Commands

```bash
# Basic screenshots
pnpm screenshot                    # Desktop, both themes
pnpm screenshot:suite              # All viewports × all themes (6 screenshots)
pnpm screenshot:mobile             # Mobile viewport
pnpm screenshot:tablet             # Tablet viewport  
pnpm screenshot:desktop            # Desktop viewport

# Advanced options
pnpm screenshot --url <url>        # Custom URL
pnpm screenshot --theme dark       # Specific theme (light|dark|both)
pnpm screenshot --viewport mobile  # Specific viewport
pnpm screenshot --full-page        # Capture entire scrollable page
pnpm screenshot --filename <name>  # Custom filename
pnpm screenshot --output <dir>     # Custom output directory
pnpm screenshot --headed           # Show browser (debugging)
pnpm screenshot --help             # Show all options
```

## Programmatic API

```typescript
import { captureScreenshot, captureSuite, VIEWPORTS } from '@/utils/screenshot';

// Simple screenshot
await captureScreenshot({ theme: 'both' });

// Mobile screenshot
await captureScreenshot({
  viewport: VIEWPORTS.mobile,
  theme: 'dark',
  filename: 'mobile-view'
});

// Complete suite (6 screenshots)
await captureSuite({ outputDir: 'screenshots/docs' });

// Custom configuration
await captureScreenshot({
  url: 'http://localhost:3022/dashboard',
  viewport: VIEWPORTS.desktop,
  theme: 'light',
  fullPage: true,
  waitForSelector: '[data-loaded="true"]',
  delay: 2000,
  outputDir: 'screenshots/custom'
});
```

## Viewports

| Name | Size | DPR | Use Case |
|------|------|-----|----------|
| `VIEWPORTS.mobile` | 375×667 | 2x | iPhone-like |
| `VIEWPORTS.tablet` | 768×1024 | 2x | iPad-like |
| `VIEWPORTS.desktop` | 1920×1080 | 1x | Standard desktop |
| `VIEWPORTS['desktop-hd']` | 2560×1440 | 1x | High-res desktop |

## Common Patterns

### For Documentation
```typescript
await captureSuite({
  url: 'http://localhost:3022',
  outputDir: 'docs/screenshots',
  delay: 1500  // Allow animations to complete
});
```

### For Agentic Workflows
```typescript
const results = await captureScreenshot({
  url: process.env.APP_URL || 'http://localhost:3022',
  theme: 'both',
  timeout: 30000,
  waitForSelector: 'main'
});

console.log('Screenshots:', results.map(r => r.path));
```

### For Visual Testing
```typescript
await captureScreenshot({
  viewport: VIEWPORTS.mobile,
  theme: 'light',
  filename: 'baseline',
  outputDir: 'tests/baselines'
});
```

## Files

- **Utility**: `web/src/utils/screenshot.ts`
- **CLI Tool**: `web/scripts/screenshot.ts`
- **Examples**: `web/scripts/screenshot-examples.ts`
- **Documentation**: `web/docs/SCREENSHOT-AUTOMATION.md`
- **Output**: `web/screenshots/` (gitignored)

## Tips

1. **Wait for content**: Use `waitForSelector` for dynamic pages
2. **Delays**: Add `delay: 1000` for animations
3. **Full page**: Use `fullPage: true` for scrollable content
4. **Debugging**: Use `headless: false` to see the browser
5. **Custom browser**: Set `executablePath` if needed

## Browser Detection

Automatically detects browsers in this order:
1. `/usr/bin/chromium-browser`
2. `/usr/bin/chromium`
3. `/usr/bin/google-chrome`
4. `/usr/bin/chrome`
5. macOS/Windows Chrome paths

## Output Format

Default naming: `screenshot-{viewport}-{theme}-{timestamp}.png`

Custom naming adds theme suffix: `{filename}-{theme}.png`

## See Also

- Full documentation: `web/docs/SCREENSHOT-AUTOMATION.md`
- Run examples: `pnpm tsx scripts/screenshot-examples.ts`
- CLI help: `pnpm screenshot --help`
