# Decision Log — Web Utility Center Baseline

## Context

- User wants a modular Next.js-based web utility center deployed locally first with future GitHub integration.
- Development will be incremental; foundational plumbing must precede per-utility feature work.
- Repository already carries Genesis layer automation and memory-bank structure.

## Decision

- Capture baseline capabilities and incremental roadmap in `docs/roadmap/alpha-track.md` to guide future scaffolding.
- Adopt App Router + TypeScript strict mode with modular navigation registry and reliability harness as the default architecture assumptions.
- Maintain traceability via memory-bank updates (active context, progress, decisions) and AGENTS log per milestone.

## Rationale

- Documenting the backlog now keeps future feature additions focused and reduces architectural drift.
- Establishing App Router + strict typing aligns with modern Next.js best practices and supports server actions + edge use cases.
- Traceability expectations ensure agentic workflows remain auditable as utilities accumulate.

## Next Steps

- Confirm user preferences for styling, component library, testing stack, and deployment target.
- Scaffold Next.js workspace with foundational tooling once stack choices are locked.
- Wire health/telemetry scripts and baseline tests before adding first utility module.
