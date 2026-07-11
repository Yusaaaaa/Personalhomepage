#!/usr/bin/env python3
"""Scan writing/*.md and write data/writing-index.json (newest date first)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WRITING_DIR = ROOT / "writing"
OUT_PATH = ROOT / "data" / "writing-index.json"

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


def collect_posts() -> list[dict]:
    if not WRITING_DIR.is_dir():
        print(f"warning: {WRITING_DIR} does not exist", file=sys.stderr)
        return []

    posts: list[dict] = []
    for path in sorted(WRITING_DIR.glob("*.md")):
        name = path.name
        if name.lower() in SKIP_NAMES or name.startswith("_"):
            continue

        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        slug = path.stem
        title = meta.get("title") or slug.replace("-", " ").replace("_", " ")
        date = meta.get("date", "").strip()
        if not date:
            print(f"warning: {name} has no date; will sort last", file=sys.stderr)

        posts.append(
            {
                "slug": slug,
                "file": f"writing/{name}",
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


def main() -> int:
    posts = collect_posts()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(posts)} post(s) → {OUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
