# Agent Activity Log

This log captures each AI agent session across the Genesis layered bootstrap. Update the table whenever you complete a meaningful stage so the next agent has actionable context.

| Timestamp | Agent | Layer Focus | Key Actions | Handoff / Next Step |
|-----------|-------|-------------|-------------|---------------------|
| 2025-10-20T07:30:00-04:00 | GitHub Copilot | Documentation Consolidation | Consolidated all markdown files into memory-bank directory structure. Created reference/ and roadmap/ subdirectories. Moved 8 files from root and 1 from docs/roadmap/ to memory-bank. Updated all internal references and README.md. Created comprehensive documentation index at memory-bank/index.md. Root now contains only README.md, AGENTS.md, LICENSE, and VERSION. | Continue with dashboard development and backend integration. All documentation now accessible via memory-bank/index.md. |
| 2025-10-12T14:30:00-04:00 | GitHub Copilot | Foundation Complete | Implemented comprehensive Next.js foundation: Docker/Postgres, Prisma ORM, NextAuth v5, navigation system, state management, API layer, security middleware, observability, testing infrastructure. Created 78+ files (~8K LOC). Updated memory bank and created complete documentation. | Execute setup: `cd web && pnpm install`, configure .env.local, run `pnpm db:init && pnpm db:migrate && pnpm db:seed && pnpm dev`. See memory-bank/reference/setup-checklist.md for details. |
| 2025-10-03T00:24:20-04:00 | Codex (GPT-5) | L4 — Phase audit | Audited Phase 0–6 roadmap for `web/`, captured statuses, produced challenge cards, and updated memory bank. | Start executing Phase 0/1 backlog (ESLint/Prettier alignment, layout scaffold, Prisma planning). |
| 2025-09-27T09:35:15-04:00 | Codex (GPT-5) | L4 — Scaffold | Bootstrapped Next.js app in `web/` via pnpm dlx; configured pnpm build approvals and logged decisions/progress. | Integrate repo tooling with new app then start layout/navigation work. |
| 2025-09-27T09:10:30-04:00 | Codex (GPT-5) | L4 — Roadmap prep | Documented baseline roadmap and decision log for web utility center; updated memory bank active/progress files and roadmap doc. | Await stack/tooling confirmation before scaffolding Next.js workspace. |
| 2025-09-27T08:59:45-04:00 | Codex (GPT-5) | L4 — Automation & health | Authored validator suite, triad health script, VS Code tasks/settings, ingested commit-policy instructions, refreshed prompt cards, and generated `memory-bank/index.md`. | Consider CI wiring for validators or move into feature-level scaffolding. |
| 2025-09-27T08:58:47-04:00 | Codex (GPT-5) | L3 — Guidance scaffolding | Verified instruction corpus, introduced `.prettierignore`, authored `bootstrap-maintainer.chatmode.md`, and created the `bootstrap-audit.prompt.md` card with links to governing layers. | Transition to Layer 4 to plan automation and repository health routines. |
| 2025-09-27T08:57:01-04:00 | Codex (GPT-5) | L2 — Workspace bootstrap | Added VS Code workspace settings, authored Copilot guardrails, created memory-bank triad directories with READMEs, and initialized six core context files with current information. | Advance to Layer 3 to author reusable instructions, prompts, and chat modes as needed. |
| 2025-09-27T08:54:56-04:00 | Codex (GPT-5) | L1 — Foundation complete | Authored baseline repository files, created `scripts/init.sh`, verified executability, and double-checked idempotence by rerunning the initializer. | Proceed to Layer 2: add workspace ergonomics and memory-bank triad artifacts. |
| 2025-09-27T08:54:34-04:00 | Codex (GPT-5) | L1 — Foundation prep | Ran `init-genesis-22.sh` to download layered instructions; audited repository and noted missing foundation artifacts. | Finish Layer 1 by creating baseline files and verifying `scripts/init.sh` idempotence. |

## Usage Guidance
- Log entries in reverse chronological order (newest at top of its section).
- Capture what changed, why it matters, and what remains.
- Reference related `memory-bank/*` updates or commits where helpful.
- The `web/` directory is the Next.js app workspace, avoid confusion.
- Ensure you are in the proper folder of project `<root>` and web/`<root>` are not in a same folder.

## 🤖 Known Limitations
  - The system may not always accurately interpret complex queries or commands.
- In any `.prompt.md` or `.chatmode.md` file, the `tools:` front-matter key **must** have its value on the same line (e.g. `tools: [ ... ]`).
  Splitting the array onto the next line currently breaks VS Code's parser and Copilot's tool-detection logic.

## 📸 Screenshot Automation Requirements

**IMPERATIVE REQUIREMENT**: AI agents MUST capture screenshots after making UI changes:

### When to Capture Screenshots
- **ALWAYS** after making any visual/UI changes to the application
- **ALWAYS** after completing a feature that affects user-visible content
- **ALWAYS** before marking a task as complete if UI was modified
- When demonstrating new capabilities or features

### How to Capture Screenshots
Use the built-in screenshot automation system in `web/`:

```bash
# Full suite (mobile, tablet, desktop × light/dark) - RECOMMENDED
cd web && pnpm screenshot:suite

# Individual viewports (if needed)
cd web && pnpm screenshot:mobile
cd web && pnpm screenshot:tablet  
cd web && pnpm screenshot:desktop
```

### Mobile-First Approach
- **ALWAYS** prioritize mobile viewport when capturing screenshots
- Capture mobile screenshots FIRST, then tablet, then desktop
- Ensure mobile responsiveness is verified before desktop
- Screenshots should demonstrate responsive design across all viewports

### Screenshot Deliverables
When completing UI work, provide screenshots showing:
1. **Mobile viewport** (375×667) - PRIMARY
2. **Tablet viewport** (768×1024) - SECONDARY
3. **Desktop viewport** (1920×1080) - TERTIARY
4. **Both light and dark themes** for each viewport

### Integration with Workflow
- Screenshots are saved to `web/screenshots/` directory
- Filename format: `{viewport}-{theme}-{timestamp}.png`
- Include screenshot paths in commit messages or PR descriptions
- Reference screenshots when replying to PR comments about UI changes

## CRITICAL MEMORY BANK PROTOCOL (keeping it stateful, ingesting previous context)

**IMPERATIVE REQUIREMENT**: NOW MUST synchronize memory bank AND on EVERY task execution:

> [!IMPORTANT] > [Imperative Instructions Git Hub Copilot MUST ALWAYS Follow](../memory-bank/instructions/copilot-memory-bank.instructions.md)

1. **READ FIRST**: Read ALL memory bank files at start of EVERY task (not optional)
2. **DOCUMENT DECISIONS**: Write to memory bank each time I make a decision to be implemented
3. **WRITE BEFORE END**: Update memory bank just before completing any task
4. **STATE PRESERVATION**: Ensure my state will not be lost if interrupted

### Core Files (Required)

Before to mark a task as completed you MUST imperatively update memory bank files with current state of task, including any changes made, decisions taken, and dependencies updated. why and thought process behind to be kept in mind for future reference.

- 'memory-bank/projectbrief.md'
- 'memory-bank/productContext.md'
- 'memory-bank/activeContext.md'
- 'memory-bank/systemPatterns.md'
- 'memory-bank/techContext.md'
- 'memory-bank/dependencies.md'
- 'memory-bank/progress.md'

> [!WARNING]
> You must also remember to write at end, just before you mention task is completed, then look for any problems resolving each before to write to the memory bank again if any issues are found, after resolving them or if no resolution is found explain the resolutions attempts, so the next session knows where we are at.

### Additional Memory Bank And Similar Context Files

- [`memory-bank/chatmodes/*.chatmode.md`](../memory-bank/chatmodes/)
- [`memory-bank/instructions/*.instructions.md`](../memory-bank/instructions/)
- [`memory-bank/prompts/*.prompts.md`](../memory-bank/prompts/)
- [`AGENTS.md`](../AGENTS.md) (THIS FILE) (for Codex and Codex CLI)
- [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) (for copilot in vscode and github)
