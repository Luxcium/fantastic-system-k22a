---
description: Guided workflow for authoring prompt cards that comply with Layer 3C.
---

<!-- memory-bank/prompts/prompt-files.prompt.md -->

# Prompt Files Authoring
Use this card to craft or update `.prompt.md` files that follow [Layer 3C](../instructions/layer-3c-prompt-files-factory.instructions.md) conventions.

## Slash Command: /prompt-files - Create or refine prompt cards
This command prepares a compliant prompt draft and cross-references existing instructions and chat modes.

> [!IMPORTANT]
> `/prompt-files` has been called by the user to create or refine prompt cards. The state above applies for this run.

### Context & Activation
- **Scope:** Files under `memory-bank/prompts/` and related resources such as `memory-bank/chatmodes/` and `memory-bank/instructions/`.
- **State:** Reuse existing chat modes (e.g., [Genesis Bootstrap Maintainer](../chatmodes/bootstrap-maintainer.chatmode.md)) and instructions instead of duplicating text.
- **Inputs:** `${input:stem}` — required prompt stem; `${input:intent}` — brief purpose (defaults to `general`).
- **Safety:** Do not modify prompt cards outside the declared stem; halt if requested file already complies.

### Goal
Produce a ready-to-commit prompt card template that passes `scripts/validate-prompts.sh` and aligns with project guardrails.

### Output format
Return Markdown with sections `## Filename`, `## Suggested Content`, and `## Validation Notes`. Include fenced code block containing the proposed prompt body.

### Inputs
- `${workspaceFolder}` — root for locating existing prompts.
- `${input:stem}` — slug for the prompt filename.
- `${input:intent}` — optional description of the workflow.

### Steps / Rules
- Inspect existing prompts to avoid duplicates; if a match exists, summarize differences and suggest updates.
- Outline the prompt structure using the Layer 3C template; populate placeholders tied to `${input:stem}` and `${input:intent}`.
- Identify required instructions and chat modes, linking to them via relative paths (e.g., `../instructions/...`).
- Recommend running `./scripts/validate-prompts.sh` after applying the generated draft.
- Highlight any ambiguity that requires human clarification before committing.

### Examples
**Input:** `${input:stem} = feature-plan`, `${input:intent} = plan a new feature`.
**Expected Output:** Filename recommendation `memory-bank/prompts/feature-plan.prompt.md` plus a Markdown draft referencing relevant instructions.

### Edge cases / Stop criteria
- Stop if `${input:stem}` is empty; request a valid stem from the user.
- If the target file already conforms, return "No changes required" with supporting evidence.
- Escalate if required chat modes or instructions are missing so they can be created first.
