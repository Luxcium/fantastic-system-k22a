---
description: Idempotent bootstrap and repair workflow for Genesis Layers 1–3.
---

<!-- memory-bank/prompts/bootstrap-genesis.prompt.md -->

# Genesis Bootstrap Orchestrator
Use this card with the [Genesis Bootstrap Maintainer](../chatmodes/bootstrap-maintainer.chatmode.md) mode to initialize or repair the layered foundation using repository scripts.

## Slash Command: /bootstrap-genesis - Initialize or repair Layers 1–3
This command ensures the workspace complies with [Layer 1](../instructions/layer-1-verify-and-bootstrap.instructions.md), [Layer 2](../instructions/layer-2-verify-and-bootstrap.instructions.md), and [Layer 3A](../instructions/layer-3a-custom-instructions-factory.instructions.md).

> [!IMPORTANT]
> `/bootstrap-genesis` has been called by the user to initialize or repair Layers 1–3. The state above applies for this run.

### Context & Activation
- **Scope:** Root foundation files, `.vscode/`, `.github/`, `scripts/`, and the `memory-bank/` triad.
- **State:** Follow layered instructions before creating files; rely on validators under `scripts/`.
- **Inputs:** `${input:mode}` defaults to `verify`; accepts `bootstrap` or `repair`.
- **Safety:** Never delete or overwrite existing files; escalate when conflicts arise.

### Goal
Deliver a reproducible plan (and optional actions) that leaves Layers 1–3 compliant without duplicating artifacts.

### Output format
Return Markdown with sections `## Plan`, `## Actions Taken`, and `## Follow-ups`. Link each action to the governing instruction.

### Inputs
- `${workspaceFolder}` — working directory for script execution.
- `${input:mode}` — operational intent: `bootstrap`, `repair`, or `verify`.

### Steps / Rules
- Inspect current state using `scripts/init.sh` and relevant validators; summarize findings first.
- If `${input:mode}` is `bootstrap`, create missing artifacts per layer instructions in order.
- If `${input:mode}` is `repair`, focus on gaps reported by validators and suggest targeted fixes.
- For `verify`, run validators and report status; no file creation unless required for compliance.
- Reference documentation in `memory-bank/index.md` instead of restating policies.

### Examples
**Input:** `${input:mode} = bootstrap`
**Expected Output:** Report noting missing `.editorconfig` and `.vscode/settings.json`, plus ordered remediation steps referencing Layer 1 and Layer 2 guides.

### Edge cases / Stop criteria
- Stop immediately if repository permissions prevent writes; report the blocker.
- If conflicts appear between instructions, flag them and request human guidance.
- Do nothing when all layers already comply; return "All layers compliant" in `## Plan`.
