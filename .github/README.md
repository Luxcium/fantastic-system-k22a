# GitHub Configuration

This directory contains GitHub-specific configuration files.

## Files

### copilot-instructions.md

Guardrails and instructions for GitHub Copilot interactions in the Genesis 22 workspace.

### .env.ci

Environment variables for CI/CD environments to disable external service connections that may be blocked by firewalls.

This configuration disables:

- Prisma checkpoint and telemetry services
- Next.js telemetry
- Playwright browser download checks

These settings prevent firewall warnings in restricted network environments while maintaining full functionality of the development and testing tools.

## Usage in CI/CD

To use these environment variables in GitHub Actions or other CI/CD pipelines:

```yaml
- name: Load CI environment
  run: |
    if [ -f .github/.env.ci ]; then
      export $(cat .github/.env.ci | grep -v '^#' | xargs)
    fi
```

Or source them directly:

```bash
source .github/.env.ci
```
