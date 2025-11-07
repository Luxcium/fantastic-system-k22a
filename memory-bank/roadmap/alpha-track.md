# Alpha Track — Web Utility Center Baseline

## Purpose

- Codify the evergreen checklist for the local-first Next.js utility platform.
- Provide a staging area for incremental development, ensuring each module lands with shared infrastructure, navigation, and reliability hooks already in place.
- Serve as the canonical reference when new utilities or routes are proposed.

## Core Baseline Capabilities

- **Platform Foundation**: Next.js (App Router), TypeScript strict mode, edge/SSR readiness, absolute import aliases, environment variable contract, deployment scripts for local + GitHub.
- **Experience Shell**: Global layout, header/footer, themes, metadata icons, error/404 boundaries, toast/notification surface, responsive grid, skeleton/loading states.
- **Navigation System**: Primary+secondary nav, route registry, breadcrumb support, keyboard shortcuts, history-aware state (URL params, persisted preferences), accessibility conformance.
- **Content & SEO**: Markdown/MDX support, OpenGraph/Twitter metadata helpers, sitemap & robots, localization scaffolding (even if single locale), canonical URLs.
- **Data & State Layer**: Fetch utilities, server actions, caching/ISR strategy, optimistic updates, background sync hooks, global store (Context/Zustand), API client ergonomics.
- **Security & Auth Readiness**: Session abstraction, protected routes, RBAC shape, CSRF headers, secrets handling policy, audit logging stubs.
- **Reliability Hooks**: Health-check endpoint, feature flag harness, telemetry adapters (analytics/error tracking), structured logging, chaos toggle for testing failures.
- **Developer Tooling**: ESLint/Prettier config, lint/test/build scripts, Vitest/Playwright baseline, Storybook or component catalog, Git hooks, CI template wiring.
- **Documentation & Traceability**: Architecture overview, contribution guide, decision journal (`memory-bank/decisions`), release checklist, regeneration scripts and VS Code tasks.

## Incremental Delivery Plan

1. **Phase 0 — Alignment**
   - Confirm stack/tooling preferences (CSS framework, state store, test runners).
   - Finalize repo conventions (naming, module boundaries, env file strategy).
   - Populate decision journal entry capturing baseline assumptions.
2. **Phase 1 — Platform Scaffold**
   - Generate Next.js workspace with lint/test/tool scripts.
   - Implement base layout, metadata, and navigation shell.
   - Establish command runner scripts and VS Code tasks.
3. **Phase 2 — Reliability Backbone**
   - Add state/data utilities, feature-flag provider, telemetry stubs.
   - Wire health checks and automated validators.
   - Author regression/unit test harness and sample specs.
4. **Phase 3 — Utility Modules**
   - Introduce new tool routes one at a time, each wiring into nav registry.
   - Maintain documentation and decision entries per module.
   - Validate through automated scripts before merge/deploy.

## Implementation Checklist

- [ ] Stack confirmed and documented in `memory-bank/techContext.md`.
- [x] Decision log entry created for baseline architecture.
- [ ] Navigation registry pattern agreed.
- [x] Next.js scaffold generated in `web/`.
- [ ] Template module blueprint drafted (folder structure, tests, docs).
- [ ] CI/lint/test commands runnable locally.
- [ ] Health + telemetry scripts stubbed.
- [ ] Documentation linked from repo root README.

## Bootstrap Procedure

1. Set local pnpm paths when generating scaffolds to stay inside the repo sandbox, e.g. `PNPM_HOME=$(pwd)/.pnpm-home` and `PNPM_STORE_PATH=$(pwd)/.pnpm-store`.
2. Run `pnpm dlx create-next-app@latest web --use-pnpm --ts --tailwind --app --src-dir --yes`.
3. Configure build approvals by setting `pnpm.onlyBuiltDependencies` to include `@tailwindcss/oxide` and `sharp`, then execute `pnpm rebuild`.

## Traceability Practices

- Update `memory-bank/activeContext.md` with each significant milestone.
- Log detailed rationales in `memory-bank/decisions/YYYY-MM-DD-*.md`.
- Reflect progress checkpoints in `memory-bank/progress.md` and `AGENTS.md`.
- Capture open questions at the bottom of this roadmap until addressed.

## Open Questions

- CSS baseline preference (Tailwind, CSS Modules, Chakra, etc.).
- Primary component library policy (build vs. adopt).
- Observability stack (self-hosted vs. external services).
- Deployment target for GitHub-hosted builds (Vercel, Docker, static export?).
- Auth provider requirements (local-only, OAuth, passkeys?).

## Recent Milestones

- 2025-09-27: Generated Next.js workspace under `web/` with `pnpm dlx create-next-app@latest web --use-pnpm --ts --tailwind --app --src-dir --yes`.
  - Recorded build approvals via `pnpm.onlyBuiltDependencies` (`@tailwindcss/oxide`, `sharp`) and executed `pnpm rebuild`.
