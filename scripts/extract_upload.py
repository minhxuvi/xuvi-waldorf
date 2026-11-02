#!/usr/bin/env python3
"""Extract story text from an uploaded file. Prints UTF-8 text to stdout.
Supports .txt/.md (raw), .html (tag-stripped), .pdf (pypdf), .docx (python-docx).
Legacy .doc is rejected: resave as .docx first.

Usage: python3 scripts/extract_upload.py <file> [--with pypdf|docx auto]
"""
import html as ihtml
import os
import re
import sys


def main():
    path = sys.argv[1]
    ext = os.path.splitext(path)[1].lower()
    if ext in (".txt", ".md", ".markdown"):
        with open(path, encoding="utf-8", errors="replace") as f:
            sys.stdout.write(f.read())
    elif ext in (".html", ".htm", ".xhtml"):
        with open(path, encoding="utf-8", errors="replace") as f:
            raw = f.read()
        raw = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", raw)
        raw = re.sub(r"(?s)<[^>]*>", " ", raw)
        sys.stdout.write(ihtml.unescape(re.sub(r"[ \t\xa0]+", " ", raw)).strip())
    elif ext == ".pdf":
        from pypdf import PdfReader
        out = []
        for page in PdfReader(path).pages:
            try:
                out.append(page.extract_text() or "")
            except Exception:
                out.append("")
        sys.stdout.write("\n".join(out).strip())
    elif ext == ".docx":
        from docx import Document
        doc = Document(path)
        sys.stdout.write("\n".join(p.text for p in doc.paragraphs).strip())
    elif ext == ".doc":
        raise SystemExit("UNSUPPORTED: định dạng .doc cũ không hỗ trợ — hãy lưu thành .docx rồi tải lại.")
    else:
        raise SystemExit(f"UNSUPPORTED: {ext or '(không đuôi)'} — hỗ trợ .txt .md .html .pdf .docx")


if __name__ == "__main__":
    try:
        main()
    except SystemExit as e:
        print(str(e), file=sys.stderr)
        sys.exit(1 if str(e).startswith("UNSUPPORTED") else 2)
