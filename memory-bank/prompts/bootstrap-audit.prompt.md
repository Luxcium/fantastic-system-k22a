---
description: Audit and repair Genesis layered bootstrap state before further work.
---

<!-- memory-bank/prompts/bootstrap-audit.prompt.md -->

# Genesis Bootstrap Audit
Use this card with the [Genesis Bootstrap Maintainer](../chatmodes/bootstrap-maintainer.chatmode.md) mode to inspect the repository against layered instructions.

## Slash Command: /bootstrap-audit - Verify layered foundation
Activate this command when you need a concise assessment of foundation health across Layers 1–3.

> [!IMPORTANT]
> `/bootstrap-audit` has been called by the user to verify layered foundation health. The state above applies for this run.

### Context & Activation
- **Scope:** Root files, `scripts/`, `.vscode/`, `.github/`, and `memory-bank/` directories.
- **State:** Follow rules from [Layer 1](../instructions/layer-1-verify-and-bootstrap.instructions.md), [Layer 2](../instructions/layer-2-verify-and-bootstrap.instructions.md), and [Layer 3A](../instructions/layer-3a-custom-instructions-factory.instructions.md).
- **Inputs:** `${input:focus}` — optional layer or file focus hint; defaults to `all`.
- **Safety:** Stop if destructive changes are required; surface blockers instead of guessing.

### Goal
Deliver a verification summary that confirms compliance or lists precise remediation steps per layer.

### Output format
Return Markdown with sections `## Summary`, `## Findings by Layer`, and `## Next Steps`. Each finding must cite the governing instruction file.

### Inputs
- `${workspaceFolder}` — Workspace root context for path resolution.
- `${input:focus}` — Optional focus as noted above.

### Steps / Rules
- If `${input:focus}` is `all`, evaluate Layers 1–3 sequentially; otherwise inspect the named layer only.
- List existing compliance first, then actionable gaps with file paths.
- Reference `scripts/init.sh` for Layer 1 verification and confirm idempotence expectations.
- Highlight any conflicting guidance and request human direction rather than resolving silently.
- When no issues are found, state "No changes required" for the inspected scope.

### Examples
**Input:** `${input:focus} = all`
**Expected Output:** Markdown report noting "Layer 1: compliant", "Layer 2: missing .prettierignore" with corrective steps.

### Edge cases / Stop criteria
- Do nothing if all inspected layers already comply.
- Stop and escalate if repository is not accessible or permissions are insufficient.
- Flag missing instructions files instead of fabricating replacements.
