# Tech Context

## Stack Baseline
- Node.js ≥ 20.9 runtime (22+ preferred).
- TypeScript-first development with TSDoc annotations for documented APIs.
- Biome (v2.2.0+) for linting, formatting, and import organization; configured in `web/biome.json`.
- Next.js 16.0.1 with Turbopack as default bundler.
  - Explicit caching model with tag-based revalidation
  - Layout deduplication and incremental prefetching
  - Turbopack file system cache for faster cold starts
- React 19.2.0 with automatic JSX runtime.
  - View Transitions API support
  - Enhanced server components

## Tooling
- `scripts/init.sh` validates foundation files and handles git bootstrapping if needed.
- VS Code workspace settings tie Copilot to the memory-bank triad for contextual responses.
- **Screenshot Automation**: Playwright-based screenshot capture system in `web/src/utils/screenshot.ts` for agentic workflows
  - CLI tool: `pnpm screenshot` with support for multiple viewports and themes
  - Programmatic API for integration with automated workflows
  - System browser detection (Chromium/Chrome) for cloud and local environments
- **Next.js 16+ Reference**: Complete handbook at `memory-bank/reference/nextjs-16-handbook.md`
  - Modern patterns and conventions for 2025
  - Explicit caching model documentation
  - Migration guidance from older versions
  - Cache helper utilities in `src/lib/cache.ts`

## Constraints
- Avoid destructive operations; scripts must check for pre-existing files before creating new ones.
- Network access may require explicit authorization; prefer offline resources when possible.
- **Firewall-Restricted Environments**: Configuration in place to disable external service connections:
  - Prisma checkpoint and telemetry disabled via CHECKPOINT_DISABLE and PRISMA_TELEMETRY_DISABLE
  - Chromium/Playwright external connections blocked via browser launch args
  - Next.js telemetry disabled via NEXT_TELEMETRY_DISABLED
  - See `docs/FIREWALL-CONFIGURATION.md` for complete details and CI/CD usage
