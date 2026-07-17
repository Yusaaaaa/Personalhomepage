#!/usr/bin/env python3
"""Scan content collections and write data/*-index.json (newest date first)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

COLLECTIONS = {
    "ai_views": {"dir": "AI_views", "out": "data/ai-views-index.json"},
    "writing": {"dir": "writing", "out": "data/writing-index.json"},
    "notes": {"dir": "notes", "out": "data/notes-index.json"},
    "updates": {"dir": "updates", "out": "data/updates-index.json"},
}

SKIP_NAMES = {"readme.md"}
FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?(.*)\Z", re.DOTALL)


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text.strip()

    meta: dict[str, str] = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip().lower()
        value = value.strip().strip('"').strip("'")
        if key:
            meta[key] = value
    return meta, match.group(2).strip()


def make_summary(meta: dict[str, str], body: str, limit: int = 120) -> str:
    if meta.get("summary"):
        return meta["summary"]
    plain = re.sub(r"[#>*_`\[\]()!-]", " ", body)
    plain = re.sub(r"\s+", " ", plain).strip()
    if len(plain) <= limit:
        return plain
    return plain[: limit - 1].rstrip() + "…"


def collect_posts(content_dir: Path, dir_name: str) -> list[dict]:
    if not content_dir.is_dir():
        print(f"warning: {content_dir} does not exist", file=sys.stderr)
        return []

    posts: list[dict] = []
    for path in sorted(content_dir.glob("*.md")):
        name = path.name
        if name.lower() in SKIP_NAMES or name.startswith("_"):
            continue

        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        slug = path.stem
        title = meta.get("title") or slug.replace("-", " ").replace("_", " ")
        date = meta.get("date", "").strip()
        if not date:
            print(f"warning: {dir_name}/{name} has no date; will sort last", file=sys.stderr)

        posts.append(
            {
                "slug": slug,
                "file": f"{dir_name}/{name}",
                "title": title,
                "date": date,
                "summary": make_summary(meta, body),
            }
        )

    # Newest first; undated last; stable by slug
    dated = [p for p in posts if p["date"]]
    undated = [p for p in posts if not p["date"]]
    dated.sort(key=lambda p: (p["date"], p["slug"]), reverse=True)
    undated.sort(key=lambda p: p["slug"])
    return dated + undated


def build_one(collection_id: str) -> int:
    cfg = COLLECTIONS[collection_id]
    dir_name = cfg["dir"]
    content_dir = ROOT / dir_name
    out_path = ROOT / cfg["out"]
    posts = collect_posts(content_dir, dir_name)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(posts)} post(s) → {out_path.relative_to(ROOT)}")
    return len(posts)


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if args and args[0] in ("-h", "--help"):
        names = ", ".join(COLLECTIONS)
        print(f"Usage: build_content.py [{names}|all]")
        return 0

    if not args or args[0] == "all":
        targets = list(COLLECTIONS.keys())
    else:
        targets = []
        for name in args:
            if name not in COLLECTIONS:
                print(f"error: unknown collection '{name}'", file=sys.stderr)
                print(f"valid: {', '.join(COLLECTIONS)}", file=sys.stderr)
                return 1
            targets.append(name)

    for cid in targets:
        build_one(cid)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
