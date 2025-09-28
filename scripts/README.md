# Scripts Overview

The scripts in this directory are safe to run repeatedly. Each script validates its preconditions before making changes and logs its actions so agents can trace what happened.

## Usage Guidelines
- Run `./init.sh` after cloning to verify the foundation files and permissions.
- Re-run scripts when instructed by layered memory-bank guides to confirm idempotence.
- Keep new scripts POSIX-compliant and document their purpose in this file.

## Conventions
- All shell scripts must be executable and should use `#!/usr/bin/env bash`.
- Scripts must perform dry checks before mutating repository state.
- Log outcomes using concise, structured messages (e.g., `[INFO]`, `[WARN]`).
