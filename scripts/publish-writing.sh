#!/usr/bin/env bash
# Backward-compatible wrapper — prefer publish-content.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Old habit: optional custom message as $1
if [[ "${1:-}" == "" ]]; then
  exec "$ROOT/scripts/publish-content.sh" all
else
  exec "$ROOT/scripts/publish-content.sh" all "$1"
fi
