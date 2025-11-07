# Firewall Configuration Guide

This document explains how to resolve firewall blocking issues when working in restricted network environments.

## Problem

When running development tools (Chromium/Playwright, Prisma) in firewall-restricted environments, you may encounter DNS blocking warnings for external services:

**Blocked Services:**

- Google domains (accounts.google.com, android.clients.google.com, etc.) - Used by Chromium for sync, autofill, updates
- checkpoint.prisma.io - Used by Prisma for update checks and telemetry

## Solution

The project has been configured to disable these non-essential external connections while maintaining full functionality.

### Automatic Configuration

The following files have been updated to disable external connections:

1. **`web/.env.local`** - Local environment variables
2. **`web/playwright.config.ts`** - Playwright browser launch options
3. **`web/src/utils/screenshot.ts`** - Screenshot utility browser args
4. **`.github/.env.ci`** - CI/CD environment template

### Environment Variables

Add these to your environment to suppress external service calls:

```bash
# Prisma - Disable checkpoint and telemetry
CHECKPOINT_DISABLE=1
PRISMA_TELEMETRY_DISABLE=1

# Next.js - Disable telemetry
NEXT_TELEMETRY_DISABLED=1

# Playwright - Skip browser download checks
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

### Browser Arguments

The following Chromium arguments are now automatically included:

```javascript
[
  "--disable-sync",
  "--disable-features=TranslateUI,OptimizationHints",
  "--disable-component-update",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-extensions",
];
```

### Usage

#### Local Development

Environment variables are already set in `web/.env.local`. No additional action required.

#### CI/CD Pipelines

Source the CI environment file:

```bash
source .github/.env.ci
```

Or export variables in your workflow:

```yaml
- name: Configure environment
  run: |
    export CHECKPOINT_DISABLE=1
    export PRISMA_TELEMETRY_DISABLE=1
    export NEXT_TELEMETRY_DISABLED=1
```

#### Manual Override

To manually run commands with these settings:

```bash
# Prisma commands
CHECKPOINT_DISABLE=1 pnpm prisma generate
CHECKPOINT_DISABLE=1 pnpm prisma migrate dev

# Screenshot capture
pnpm screenshot:suite

# Development server
pnpm dev
```

## Verification

After applying these configurations, you should no longer see firewall warnings. All functionality remains intact:

- ✅ Prisma database operations work normally
- ✅ Playwright/Chromium screenshot capture works
- ✅ Next.js development server runs without issues
- ✅ Build and test processes complete successfully

## Impact

**No functionality is lost** by disabling these services:

- Prisma checkpoint only checks for updates - not required for operation
- Chromium sync/autofill are user-convenience features - not needed for automated testing
- Telemetry is optional and privacy-focused users often disable it anyway

## Additional Notes

If you still see warnings, verify that:

1. Environment variables are properly loaded
2. You're using the latest version of configuration files
3. Browser cache is cleared if using headed mode

For GitHub Actions specifically, you may also need to add domains to the custom allowlist in repository settings (admin only).

## Related Files

- `web/.env.local` - Local environment configuration
- `web/.env.example` - Environment template
- `.github/.env.ci` - CI/CD environment template
- `.github/README.md` - GitHub configuration documentation
- `web/playwright.config.ts` - Playwright configuration
- `web/src/utils/screenshot.ts` - Screenshot utility implementation

## References

- [Prisma Telemetry](https://www.prisma.io/docs/concepts/more/telemetry)
- [Next.js Telemetry](https://nextjs.org/telemetry)
- [Chromium Command Line Switches](https://peter.sh/experiments/chromium-command-line-switches/)
