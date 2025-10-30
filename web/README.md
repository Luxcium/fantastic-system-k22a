This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
# Opens browser automatically at http://localhost:3022

# Or without browser:
pnpm dev:no-browser
```

Open [http://localhost:3022](http://localhost:3022) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Screenshot Automation

This project includes a comprehensive screenshot automation system for agentic workflows, documentation, and testing.

### Quick Start

```bash
# Capture desktop screenshot (both themes)
pnpm screenshot

# Capture all viewports and themes
pnpm screenshot:suite

# Capture specific viewport
pnpm screenshot:mobile
pnpm screenshot:tablet
pnpm screenshot:desktop
```

### Programmatic Usage

```typescript
import { captureScreenshot, VIEWPORTS } from '@/utils/screenshot';

// Capture screenshot programmatically
const results = await captureScreenshot({
  url: 'http://localhost:3022',
  viewport: VIEWPORTS.mobile,
  theme: 'both'
});
```

See [docs/SCREENSHOT-AUTOMATION.md](docs/SCREENSHOT-AUTOMATION.md) for full documentation.

## Available Scripts

### Development
- `pnpm dev` - Start dev server with browser (auto-opens Chrome at http://localhost:3022)
- `pnpm dev:no-browser` - Start dev server only (no browser auto-launch)
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Screenshots
- `pnpm screenshot` - Capture desktop (1920×1080) screenshot in both themes
- `pnpm screenshot:suite` - Capture all viewports and themes (6 screenshots)
- `pnpm screenshot:mobile` - Mobile viewport (375×667)
- `pnpm screenshot:tablet` - Tablet viewport (768×1024)
- `pnpm screenshot:desktop` - Desktop viewport (1920×1080)

### Code Quality
- `pnpm lint` - Lint and fix code with Biome
- `pnpm format` - Format code with Biome
- `pnpm type-check` - Check TypeScript types

### Database
- `pnpm db:init` - Start PostgreSQL container
- `pnpm db:stop` - Stop database
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:reset` - Reset database

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
