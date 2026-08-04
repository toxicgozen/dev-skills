#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "${BASH_SOURCE[0]%/*}/.." && pwd)"

for skill_md in "$REPO"/skills/*/SKILL.md; do
  printf '%s\n' "${skill_md#"$REPO"/}"
done
