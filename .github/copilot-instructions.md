---
description: Guardrails for GitHub Copilot interactions in the Genesis 22 workspace.
---

# Copilot Guardrails

- Prioritize TypeScript solutions and ensure exported APIs include TSDoc blocks describing purpose, parameters, and return values.
- Assume Node.js 22 or later for runtime behaviors, syntax, and library availability; avoid features outside that baseline.
- Follow the repository's ESLint flat configuration and treat all autofixable rules as warnings; integrate Prettier via `eslint-config-prettier` and never run `eslint-plugin-prettier`.
- Consider files in `memory-bank/` as the authoritative context. Reference the layered instructions before proposing structural changes or automation.
- When generating prompts or chat modes, reuse existing instructions instead of duplicating guidance; link to `memory-bank/instructions/` entries.
- Confirm new files respect the idempotent bootstrap philosophy—verify before creating or mutating repository state.

## Collaboration Expectations

- Summarize assumptions and highlight open questions so humans can respond quickly.
- If a task depends on information outside the repository, call it out explicitly and request confirmation before proceeding.
