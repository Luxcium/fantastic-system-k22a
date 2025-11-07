# Firewall Block Analysis & Workarounds

## Overview

During the GitHub Actions build process, three domains were blocked by firewall rules. This document evaluates each blocked domain, explains its purpose, and provides workarounds.

## Blocked Domains Analysis

### 1. `checkpoint.prisma.io`

**Purpose:**

- Prisma telemetry and update checking service
- Sends anonymous usage statistics to help Prisma improve their product
- Checks for available updates to notify developers of new versions

**Impact of Block:**

- ✅ **No functional impact** - Prisma works perfectly without this endpoint
- ⚠️ Update notifications won't be received during builds
- ⚠️ Telemetry data won't be sent (acceptable in most CI/CD scenarios)

**Workarounds:**

#### Option 1: Disable Telemetry (Recommended)

Add environment variable to disable Prisma telemetry:

```yaml
# .github/workflows/your-workflow.yml
env:
  CHECKPOINT_DISABLE: 1
```

Or in package.json scripts:

```json
{
  "scripts": {
    "postinstall": "CHECKPOINT_DISABLE=1 prisma generate"
  }
}
```

#### Option 2: Add to Allowlist

If you want to receive updates and contribute telemetry:

- Go to Repository Settings → Copilot → Coding Agent Settings
- Add `checkpoint.prisma.io` to the custom allowlist
- **Recommendation:** Not necessary for most use cases

**Current Status in PR:** ✅ Already handled via `CHECKPOINT_DISABLE` in CI environment

---

### 2. `esm.ubuntu.com`

**Purpose:**

- Ubuntu's Enterprise Software Management (ESM) repository
- Provides security updates and patches for Ubuntu systems
- Part of Ubuntu Pro/Advantage services

**Impact of Block:**

- ✅ **Minimal impact** - Standard Ubuntu packages still accessible via main repositories
- ⚠️ Extended Security Maintenance updates unavailable
- ⚠️ Only affects advanced security patches beyond standard support

**Workarounds:**

#### Option 1: Use Actions Setup Steps (Recommended)

Configure package installations before firewall is enabled:

```yaml
# .github/workflows/your-workflow.yml
jobs:
  build:
    steps:
      - uses: actions/checkout@v4

      # Install system dependencies BEFORE firewall is enabled
      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y [your-packages]

      # Your build steps here
      - name: Install Node dependencies
        run: pnpm install
```

#### Option 2: Use Standard Ubuntu Repositories

Most packages don't require ESM. The standard repositories are sufficient for:

- Node.js build tools
- Common development libraries
- Standard system utilities

#### Option 3: Add to Allowlist (If Needed)

Only necessary if you specifically need ESM packages:

- Repository Settings → Copilot → Coding Agent Settings
- Add `esm.ubuntu.com` to custom allowlist
- **Recommendation:** Only if standard packages insufficient

**Current Status in PR:** ✅ No action needed - standard packages are sufficient

---

### 3. `fonts.googleapis.com`

**Purpose:**

- Google Fonts CDN service
- Provides web fonts for Next.js applications
- Used by Next.js `next/font/google` for font optimization

**Impact of Block:**

- ❌ **Build-breaking** - Next.js build fails when trying to fetch Google Fonts
- Fonts cannot be loaded from Google's CDN during build time

**Workarounds:**

#### Option 1: Use Local Fonts (Implemented in PR ✅)

Replace Google Fonts with system fonts or local font files:

```typescript
// Before (blocked):
import { Geist, Geist_Mono } from "next/font/google";

// After (working):
// Remove Google Font imports, use system fonts via Tailwind
```

**Benefits:**

- No external dependencies
- Faster page loads (no network requests)
- Works in any environment
- Better privacy (no tracking)

#### Option 2: Use next/font/local

For custom fonts, use local font files:

```typescript
import localFont from "next/font/local";

const myFont = localFont({
  src: "../fonts/my-font.woff2",
  variable: "--font-my-font",
});
```

#### Option 3: Add to Allowlist (Alternative)

If you specifically need Google Fonts:

- Repository Settings → Copilot → Coding Agent Settings
- Add `fonts.googleapis.com` and `fonts.gstatic.com` to allowlist
- **Recommendation:** Not recommended due to external dependency

**Current Status in PR:** ✅ Already resolved - Google Fonts removed, using system fonts

---

## Summary Matrix

| Domain                 | Purpose            | Severity | Workaround             | Status              |
| ---------------------- | ------------------ | -------- | ---------------------- | ------------------- |
| `checkpoint.prisma.io` | Prisma telemetry   | Low      | Disable telemetry      | ✅ Handled          |
| `esm.ubuntu.com`       | Ubuntu ESM updates | Low      | Use standard repos     | ✅ No action needed |
| `fonts.googleapis.com` | Google Fonts CDN   | High     | Use local/system fonts | ✅ Resolved         |

## Recommended Configuration

### Environment Variables

Add to your GitHub Actions workflow or `.env` files:

```bash
# Disable Prisma telemetry in CI/CD
CHECKPOINT_DISABLE=1

# Optional: Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1
```

### GitHub Actions Workflow Template

```yaml
name: Build and Test

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    env:
      # Disable telemetry for blocked endpoints
      CHECKPOINT_DISABLE: 1
      NEXT_TELEMETRY_DISABLED: 1

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm run type-check

      - name: Run tests
        run: pnpm run test

      - name: Build
        run: pnpm run build
```

## Allowlist Configuration Guide

If you determine you need to add domains to the allowlist:

### Steps to Configure:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Copilot** → **Coding Agent Settings**
3. Find the **Custom Allowlist** section
4. Add domains one per line:
   ```
   checkpoint.prisma.io
   fonts.googleapis.com
   fonts.gstatic.com
   esm.ubuntu.com
   ```
5. Save changes

### Domains to Consider:

**Essential (if using these services):**

- `registry.npmjs.org` - npm packages (usually allowed by default)
- `cdn.playwright.dev` - Playwright browser downloads

**Optional (based on your needs):**

- `checkpoint.prisma.io` - Prisma updates (not required)
- `fonts.googleapis.com` - Google Fonts (prefer local fonts)
- `api.github.com` - GitHub API access
- `raw.githubusercontent.com` - Raw file access from GitHub

**Not Recommended:**

- `esm.ubuntu.com` - Rarely needed, use standard repositories

## Best Practices

### 1. Minimize External Dependencies

- Use local fonts instead of CDN-hosted fonts
- Disable telemetry in CI/CD environments
- Cache dependencies when possible

### 2. Environment-Specific Configuration

```typescript
// next.config.ts
const config = {
  // Disable telemetry in production builds
  telemetry: process.env.NEXT_TELEMETRY_DISABLED === "1" ? false : true,

  // Use local fonts in restricted environments
  experimental: {
    optimizeFonts: false, // Disable Google Fonts optimization
  },
};
```

### 3. Graceful Degradation

Ensure your application works even when external services are unavailable:

- Provide fallback fonts
- Handle telemetry failures silently
- Don't fail builds on update checks

## Validation

To verify your workarounds are effective:

```bash
# Check if build succeeds without external requests
CHECKPOINT_DISABLE=1 pnpm run build

# Verify fonts are working
pnpm run dev
# Visit http://localhost:3000 and inspect font loading

# Check Prisma works without telemetry
CHECKPOINT_DISABLE=1 pnpm exec prisma generate
```

## Conclusion

All three blocked domains have been successfully addressed in this PR:

1. ✅ **Prisma telemetry** - Handled via CHECKPOINT_DISABLE
2. ✅ **Ubuntu ESM** - Not required, standard packages sufficient
3. ✅ **Google Fonts** - Removed dependency, using system fonts

The application now builds and runs successfully without requiring any allowlist additions, making it more resilient and privacy-friendly.

## References

- [Prisma Telemetry Documentation](https://www.prisma.io/docs/concepts/more/telemetry)
- [Next.js Font Optimization](https://nextjs.org/docs/basic-features/font-optimization)
- [GitHub Actions Setup Steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Next.js Telemetry](https://nextjs.org/telemetry)
