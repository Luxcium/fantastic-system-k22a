# Genesis 22 Project Template

## Overview
This repository provides the baseline artifacts required to bootstrap a new Genesis 22 project. It establishes shared conventions, automation entry points, and persistent memory so collaborators and AI agents can iterate consistently.

## Features
- Canonical repository scaffolding that is safe to re-run.
- Standardized editor, tooling, and documentation expectations.
- Memory-bank structure for durable AI instructions and prompts.
- Scripts for repeatable initialization and verification workflows.

## Quick Start
1. Run `scripts/init.sh` to verify the foundation and initialize missing pieces.
2. Review the contents of `memory-bank/` to understand the layered instructions.
3. Update `AGENTS.md` with session context before beginning any significant changes.

## Documentation
- `memory-bank/instructions/` contains layered bootstrap guides for agents.
- `memory-bank/prompts/` and `memory-bank/chatmodes/` will house reusable prompts and chat modes as they are created.
- `AGENTS.md` tracks agent sessions and context hand-offs.

## Contributing
Pull requests should maintain idempotent scripts and respect the layered instruction model. Document decisions and update `memory-bank/progress.md` as milestones advance.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Support
Open an issue in the repository or document blockers in `memory-bank/progress.md` to surface needs.

## Acknowledgments
This template builds on the Genesis layered bootstrap process and the Vigilant Codex project foundations.
