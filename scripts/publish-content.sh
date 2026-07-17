#!/usr/bin/env bash
# Rebuild content index(es), commit collection files only, push to origin.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/publish-content.sh [collection] [commit message]

Collections: ai_views | writing | notes | updates | all  (default: all)

Examples:
  ./scripts/publish-content.sh
  ./scripts/publish-content.sh ai_views
  ./scripts/publish-content.sh writing "writing: add essay"
  ./scripts/publish-content.sh notes "notes: study log"
  ./scripts/publish-content.sh updates "updates: add note"
EOF
}

COLLECTION="${1:-all}"
MSG="${2:-}"

if [[ "$COLLECTION" == "-h" || "$COLLECTION" == "--help" ]]; then
  usage
  exit 0
fi

case "$COLLECTION" in
  ai_views)
    DIRS=(AI_views)
    INDEXES=(data/ai-views-index.json)
    DEFAULT_MSG="ai_views: update"
    ;;
  writing)
    DIRS=(writing)
    INDEXES=(data/writing-index.json)
    DEFAULT_MSG="writing: update essays"
    ;;
  notes)
    DIRS=(notes)
    INDEXES=(data/notes-index.json)
    DEFAULT_MSG="notes: update"
    ;;
  updates)
    DIRS=(updates)
    INDEXES=(data/updates-index.json)
    DEFAULT_MSG="updates: update"
    ;;
  all)
    DIRS=(AI_views writing notes updates)
    INDEXES=(data/ai-views-index.json data/writing-index.json data/notes-index.json data/updates-index.json)
    DEFAULT_MSG="content: update collections"
    ;;
  *)
    echo "error: unknown collection '$COLLECTION'"
    usage
    exit 1
    ;;
esac

if [[ -z "$MSG" ]]; then
  MSG="$DEFAULT_MSG"
fi

echo "→ Building content index ($COLLECTION)…"
if [[ "$COLLECTION" == "all" ]]; then
  python3 scripts/build_content.py
else
  python3 scripts/build_content.py "$COLLECTION"
fi

echo "→ Staging ${DIRS[*]} and index files…"
git add "${DIRS[@]}" "${INDEXES[@]}"

if git diff --cached --quiet; then
  echo "Nothing to commit (no changes in selected collection(s))."
  exit 0
fi

echo "→ Commit: $MSG"
git commit -m "$MSG"

echo "→ Push origin main…"
git push origin main

echo "Done. Wait 1–2 minutes, then refresh the live site (Cmd+Shift+R)."
