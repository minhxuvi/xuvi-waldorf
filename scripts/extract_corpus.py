#!/usr/bin/env python3
"""Extract structured grade defaults from the three local Waldorf corpora.

Reads the ```yaml blocks of each grade/band section and writes
data/corpus_defaults.json with per-value provenance. Seed/reference only:
every value carries its corpus caveat (T8), and D1-D4 choices (rhythm,
banding, language timing, exam precedence) are left to the family — the
extractor never picks a winner.

Usage:
  uv run --with pyyaml --no-project python3 scripts/extract_corpus.py --out data/corpus_defaults.json
"""
import argparse
import hashlib
import json
import os
import re
import sys

CORPORA = [
    ("classical", "tmp/01-Waldorf-co-dien-lop-1-12.md",
     "NOT an official Waldorf/national standard — reference only"),
    ("cambridge", "tmp/02-Waldorf-Cambridge-lop-1-12.md",
     "examStatus is internal-only, not certification; waldorf-only rows are not exam coverage"),
    ("ntn", "tmp/03-Nha-Thuan-Nhien-mam-non-lop-12.md",
     "single-workbook source; pending_confirmation rows are research-only until owner approves"),
]

HEADER_RE = re.compile(r"^##\s+(.+?)\s*$")
YAML_RE = re.compile(r"```yaml\n(.*?)\n```", re.DOTALL)
SHA_RE = re.compile(r"SHA-256:\s*`([0-9a-f]{64})`")
SRC_RE = re.compile(r"Nguồn:\s*`([^`]+)`")


def parse_sections(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    sections = []
    current = {"title": "_head", "lines": []}
    for line in text.splitlines():
        m = HEADER_RE.match(line)
        if m and not line.startswith("###"):
            sections.append(current)
            current = {"title": m.group(1).strip(), "lines": []}
        else:
            current["lines"].append(line)
    sections.append(current)
    return sections


def cmd_extract(out):
    import yaml
    corpora = []
    for cid, path, caveat in CORPORA:
        if not os.path.exists(path):
            print(f"WARN missing {path}, skipped", file=sys.stderr)
            continue
        with open(path, "rb") as f:
            digest = hashlib.sha256(f.read()).hexdigest()
        grades = []
        for sec in parse_sections(path):
            body = "\n".join(sec["lines"])
            blocks = YAML_RE.findall(body)
            if not blocks:
                continue
            sha = (SHA_RE.search(body) or [None, None])[1] if SHA_RE.search(body) else None
            src = SRC_RE.search(body)
            for b in blocks:
                try:
                    doc = yaml.safe_load(b)
                except Exception as e:
                    print(f"WARN {cid}/{sec['title']}: yaml parse failed: {e}", file=sys.stderr)
                    continue
                if not isinstance(doc, dict):
                    continue
                grades.append({
                    "grade_label": sec["title"],
                    "source_path": src.group(1) if src else "",
                    "source_sha": sha,
                    "data": doc,
                    "provenance": {"corpus": cid, "file": os.path.basename(path), "file_sha256": digest},
                })
        corpora.append({"corpus_id": cid, "file": os.path.basename(path),
                        "file_sha256": digest, "caveat": caveat, "grades": grades})
        print(f"{cid}: {len(grades)} grade blocks")
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"meta": {"conflicts_unresolved": ["C1", "C2", "C3", "C4", "C5"],
                                  "rule": "family chooses rhythm/banding/language/exam precedence (D1-D4); extractor picks no defaults"},
                   "corpora": corpora}, f, ensure_ascii=False, indent=1)
    print(f"wrote {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/corpus_defaults.json")
    args = ap.parse_args()
    cmd_extract(args.out)


if __name__ == "__main__":
    sys.exit(main())
