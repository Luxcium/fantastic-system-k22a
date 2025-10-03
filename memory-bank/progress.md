# Progress Log

## 2025-01-27
- **Biome Migration Complete**: Successfully migrated from ESLint/Prettier to Biome 2.2.0 for linting and formatting.
  - Updated `.github/copilot-instructions.md` to reference Biome instead of ESLint
  - Updated `memory-bank/techContext.md` with Biome tooling information
  - Updated `memory-bank/instructions/layer-2-verify-and-bootstrap.instructions.md` to document Biome expectations
  - Configured `.vscode/settings.json` with Biome as default formatter and code actions
  - Created comprehensive `memory-bank/instructions/biome-linting-formatting.instructions.md` guide
  - Added Biome to VS Code recommended extensions (`.vscode/extensions.json`)
  - Verified Biome successfully catches linting errors, formats code, and organizes imports
  - All documentation and instructions now reflect Biome as the standard toolchain

## 2025-09-27
- Next.js workspace generated in `web/` via pnpm dlx create-next-app; build approvals fixed through `pnpm.onlyBuiltDependencies` and `pnpm rebuild`.
- Documented web utility baseline roadmap and decision log; awaiting stack preference confirmation before scaffolding Next.js workspace.
- Layer 1 foundation files created (`.editorconfig`, `.gitattributes`, `.gitignore`, `LICENSE`, `README.md`, `VERSION`, `scripts/` assets) and `scripts/init.sh` verified for idempotence.
- Layer 2 workspace ergonomics established: VS Code settings, Copilot guardrails, memory-bank triad directories, and six context files initialized.
- Layer 3 bootstrap: Confirmed instruction set, added `.prettierignore`, authored `bootstrap-maintainer.chatmode.md`, and created the `bootstrap-audit.prompt.md` card referencing governing instructions.
- Layer 4 automation: Added validator and health scripts, wired VS Code tasks/settings, ingested commit-policy instructions, refreshed prompt cards, and published `memory-bank/index.md`.
- Next: Integrate repo tooling with the new `web/` app (scripts, VS Code tasks), then proceed with layout/navigation scaffolding and CI wiring.
