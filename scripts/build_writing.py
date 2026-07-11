#!/usr/bin/env python3
"""Backward-compatible wrapper — use build_content.py."""

from build_content import main

if __name__ == "__main__":
    raise SystemExit(main())
