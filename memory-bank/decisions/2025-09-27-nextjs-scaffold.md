# Decision Log — Next.js Scaffold Creation

## Context
- Baseline roadmap defined for a modular Next.js utility center.
- Need a reproducible scaffold using pnpm v10+ while respecting build-script approvals.

## Decision
- Initialize the workspace via `pnpm dlx create-next-app@latest web --use-pnpm --ts --tailwind --app --src-dir --yes` with local pnpm home/store directories to avoid sandbox permission issues.
- Capture build approvals non-interactively by writing `pnpm.onlyBuiltDependencies` (`@tailwindcss/oxide`, `sharp`) into `web/package.json` and running `pnpm rebuild`.

## Rationale
- The official CLI ensures latest Next.js, Tailwind CSS v4, and Biome integration per template defaults.
- Directly configuring `pnpm.onlyBuiltDependencies` preserves reproducibility for headless agents where `pnpm approve-builds` prompts are inaccessible.

## Next Steps
- Layer in repository-specific lint/test scripts and VS Code tasks targeting the new `web` workspace.
- Establish navigation registry and shared layout components before adding utility modules.
- Document environment shortcuts (env vars for PNPM_HOME/PNPM_STORE_PATH) in contributor guides.
