# System Patterns

- Use layered instructions to gate repository evolution; each layer verifies prerequisites before adding new artifacts.
- Keep shell scripts idempotent and well-logged so they can be run repeatedly without side effects.
- Store reusable prompt, chat mode, and instruction metadata in the memory-bank triad to centralize AI guidance.
- Prefer additive changes and avoid overwriting existing files unless layers explicitly authorize modifications.
