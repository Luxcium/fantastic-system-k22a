#!/usr/bin/env sh
if [ -z "$CI" ]; then
  cd web && pnpm exec husky install ../.husky
fi
