#!/usr/bin/env bash
# Rebuild writing index, commit writing-related files only, push to origin.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MSG="${1:-writing: update notes}"

echo "→ Building writing index…"
python3 scripts/build_writing.py

echo "→ Staging writing/ and data/writing-index.json…"
git add writing/ data/writing-index.json

if git diff --cached --quiet; then
  echo "Nothing to commit (no changes in writing/ or index)."
  exit 0
fi

echo "→ Commit: $MSG"
git commit -m "$MSG"

echo "→ Push origin main…"
git push origin main

echo "Done. Wait 1–2 minutes, then refresh the live site (Cmd+Shift+R)."
