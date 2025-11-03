#!/usr/bin/env bash
# detect-env.sh - Environment detection for Genesis 22
# Source this file to get GENESIS_ENV variable
# Usage: source scripts/detect-env.sh

detect_environment() {
  if [[ -n "${CODESPACES:-}" ]]; then
    echo "codespaces"
  elif [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    echo "github-actions"
  elif [[ -n "${CI:-}" ]]; then
    echo "ci"
  elif [[ -f /.dockerenv ]]; then
    echo "docker"
  else
    echo "local"
  fi
}

# Export for other scripts
export GENESIS_ENV
GENESIS_ENV=$(detect_environment)
