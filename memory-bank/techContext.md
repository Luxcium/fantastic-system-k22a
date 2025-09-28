# Tech Context

## Stack Baseline
- Node.js 22+ runtime.
- TypeScript-first development with TSDoc annotations for documented APIs.
- ESLint flat configuration paired with `eslint-config-prettier` for formatting harmony.

## Tooling
- `scripts/init.sh` validates foundation files and handles git bootstrapping if needed.
- VS Code workspace settings tie Copilot to the memory-bank triad for contextual responses.

## Constraints
- Avoid destructive operations; scripts must check for pre-existing files before creating new ones.
- Network access may require explicit authorization; prefer offline resources when possible.
