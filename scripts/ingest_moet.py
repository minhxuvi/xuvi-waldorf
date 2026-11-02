#!/usr/bin/env python3
"""MOET GDPT 2018 (TT32) outcome-bullet extraction.

Reads tmp/01-GDPT2018-TT32-day-du-1555-trang-khong-watermark.pdf and writes
one row per verbatim 'Yeu cau can dat' bullet to data/moet_outcomes.json.

Granularity follows the approved synthesis (R5 resolved): one verbatim
bullet; NO MOET outcome codes exist, so internal_id values are
product-generated and labelled as such (T1).

Usage:
  uv run --with pypdf python3 scripts/ingest_moet.py --out data/moet_outcomes.json
  uv run --with pypdf python3 scripts/ingest_moet.py --check
  uv run --with pypdf --with psycopg-binary python3 scripts/ingest_moet.py --seed
"""
import argparse
import json
import os
import re
import sys

PDF_PATH = os.path.join("tmp", "01-GDPT2018-TT32-day-du-1555-trang-khong-watermark.pdf")
DEFAULT_OUT = os.path.join("data", "moet_outcomes.json")

SUBJECTS = [
    "NGỮ VĂN", "TOÁN", "TIẾNG ANH", "NGOẠI NGỮ", "GIÁO DỤC CÔNG DÂN",
    "LỊCH SỬ", "ĐỊA LÍ", "KHOA HỌC", "KHOA HỌC TỰ NHIÊN", "VẬT LÍ",
    "HOÁ HỌC", "SINH HỌC", "CÔNG NGHỆ", "TIN HỌC", "GIÁO DỤC THỂ CHẤT",
    "GIÁO DỤC QUỐC PHÒNG", "ÂM NHẠC", "MĨ THUẬT", "HOẠT ĐỘNG TRẢI NGHIỆM",
    "LỊCH SỬ VÀ ĐỊA LÍ", "ĐẠO ĐỨC", "TỰ NHIÊN VÀ XÃ HỘI",
]

BULLET_RE = re.compile(r"^\s*(?:[-•–▪\uf02d\uf0b7]|\d+[.)])\s*(\S.*)$")
GRADE_RE = re.compile(r"^\s*(?:LỚP|KHỐI)\s*(\d{1,2})\b", re.IGNORECASE)
LEVEL_RE = re.compile(r"cấp\s*(tiểu học|trung học cơ sở|trung học phổ thông)", re.IGNORECASE)
SECTION_RE = re.compile(r"^\s*(IV|V)\.\s*(YÊU CẦU CẦN ĐẠT|NỘI DUNG GIÁO DỤC)", re.IGNORECASE)
YCCD_RE = re.compile(r"yêu cầu cần đạt", re.IGNORECASE)
FORBIDDEN_CODE_RE = re.compile(r"\b[A-ZĐ]{2,}\d(?:[-.][A-ZĐ0-9]+)+\b")


def load_pages():
    from pypdf import PdfReader
    reader = PdfReader(PDF_PATH)
    pages = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        pages.append(text)
    return pages


MAJOR_RE = re.compile(r"^(X|IX|IV|VIII|VII|VI|V|III|II|I)\.\s", re.IGNORECASE)
NUMBERED_YCCD_RE = re.compile(r"^(?:\d+(?:\.\d+)*\.|[a-z]\))\s*.{0,100}yêu cầu cần đạt", re.IGNORECASE)

def detect_subject(line):
    # Only real section headers count: a bare subject name, or an
    # ALL-CAPS "MÔN <NAME>" line. Prose lines that merely mention or end
    # with a subject name ("...học tập môn Vật lí.") must not match —
    # title-case prose is excluded via isupper(), endswith() is dropped.
    stripped = line.strip()
    up = stripped.upper()
    for s in SUBJECTS:
        # Bare names must be ALL-CAPS headers; lowercase prose/table cells
        # ("khoa học", "hoá học") must not match.
        if up == s and stripped.isupper():
            return s
    if stripped.isupper():
        m = re.search(r"MÔN\s+([A-ZÀ-ỸĐ][A-ZÀ-ỸĐ\s]+?)\s*$", up)
        if m:
            name = m.group(1).strip()
            for s in SUBJECTS:
                if name == s:
                    return s
    return None


def extract(pages):
    rows = []
    subject = "CHUNG"
    grade = ""
    level = ""
    section = ""
    heading = ""
    in_yccd = False
    subj_count = {}
    last_row = None
    for pno, text in enumerate(pages, start=1):
        last_row = None  # never join across page boundaries
        for raw in text.splitlines():
            line = raw.strip()
            if not line:
                continue
            subj = detect_subject(line)
            if subj and len(line) < 80:
                # A repeated header for the same subject must not reset the gate.
                if subj != subject:
                    subject = subj
                    grade, level, heading = "", "", line
                    in_yccd = False
                continue
            m = SECTION_RE.match(line)
            if m:
                section = m.group(1).upper() + "/" + m.group(2)
                in_yccd = "YÊU CẦU" in m.group(2).upper()
                heading = line
                continue
            # State changes only on headings, never on body text: a body
            # sentence may mention "yêu cầu cần đạt"/"đánh giá" in passing.
            if MAJOR_RE.match(line) and len(line) < 100:
                in_yccd = False
                heading = line
                continue
            low = line.lower()
            # Table headers come in both orders: "Yêu cầu cần đạt | Nội dung"
            # (Ngữ văn) and "Nội dung | Yêu cầu cần đạt" (KHTN and others).
            if (("yêu cầu cần đạt" in low and "nội dung" in low and len(line) < 60)) or (
                NUMBERED_YCCD_RE.match(line) and len(line) < 120
            ):
                in_yccd = True
                heading = line
                continue
            gm = GRADE_RE.match(line)
            if gm and len(line) < 60:
                grade = "Lớp " + gm.group(1)
                continue
            lm = LEVEL_RE.search(line)
            if lm:
                level = lm.group(1)
                continue
            # ALL-CAPS short lines are strand/topic headings, not bullets.
            if line.isupper() and len(line) < 100 and not BULLET_RE.match(line):
                heading = line
                continue
            bm = BULLET_RE.match(raw)
            if bm and in_yccd:
                verbatim = " ".join(bm.group(1).split())
                if len(verbatim) < 8:
                    continue
                subj_count[subject] = subj_count.get(subject, 0) + 1
                code = re.sub(r"\s+", "", subject.split()[0])[:4].upper()
                rows.append({
                    "internal_id": f"MOET-{code}-{subj_count[subject]:05d}",
                    "product_generated_id": True,
                    "subject": subject,
                    "grade": grade,
                    "level": level,
                    "strand": "",
                    "topic": heading,
                    "yeu_cau_can_dat_verbatim": verbatim,
                    "paired_noi_dung": "",
                    "source_locator": {"pdf_page": pno, "section": section, "heading": heading},
                    "competency_refs": [],
                })
                last_row = rows[-1]
                continue
            # Continuation of a line-wrapped bullet: join only when the
            # previous bullet ends mid-sentence on the same page. Lines that
            # look like new cells/headings never join (they matched above).
            if in_yccd and last_row is not None and len(line) > 3 and not line.isupper():
                prev = last_row["yeu_cau_can_dat_verbatim"]
                if prev and prev[-1] not in ".:;":
                    last_row["yeu_cau_can_dat_verbatim"] = prev + " " + " ".join(line.split())
                    continue
            last_row = None
    return rows


def cmd_extract(out):
    from pypdf import PdfReader  # noqa: ensure dep present
    pages = load_pages()
    print(f"pages read: {len(pages)}")
    rows = extract(pages)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"meta": {"source_pdf": os.path.basename(PDF_PATH), "pages": len(pages),
                             "product_generated_ids": True,
                             "currency_caveat": "TT32 Dieu 2/3 absent locally; currency not verified (U1)",
                             "method": "heading-gated line extraction; line-wrapped bullets joined when prev line ends mid-sentence",
                             "residual_risks": "some Nội dung-column cells start with dashes and are captured as rows; some merged-column fragments may be mis-paired; KHOA HỌC (tieu hoc) section is small by source"},
                   "rows": rows}, f, ensure_ascii=False, indent=1)
    print(f"rows written: {len(rows)} -> {out}")
    by_subj = {}
    for r in rows:
        by_subj[r["subject"]] = by_subj.get(r["subject"], 0) + 1
    for s in sorted(by_subj):
        print(f"  {s}: {by_subj[s]}")


def load_json(path=DEFAULT_OUT):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def cmd_check():
    data = load_json()
    rows = data["rows"]
    print(f"rows: {len(rows)}")
    assert len(rows) >= 300, f"too few bullets extracted: {len(rows)}"
    assert data["meta"].get("product_generated_ids") is True
    for r in rows:
        assert r["yeu_cau_can_dat_verbatim"].strip(), "empty verbatim"
        assert r["source_locator"].get("pdf_page"), "missing page"
        assert FORBIDDEN_CODE_RE.search(r["yeu_cau_can_dat_verbatim"]) is None, \
            f"invented-code pattern in verbatim: {r['yeu_cau_can_dat_verbatim'][:80]}"
        assert r["internal_id"].startswith("MOET-") and r["product_generated_id"] is True
    # Spot samples from the approved synthesis (verbatim bullets, R5).
    texts = [r["yeu_cau_can_dat_verbatim"] for r in rows]
    assert any("40" in t and "60" in t and "tiếng" in t for t in texts), "Ngu van L1 reading-speed bullet missing"
    # Verbatim diff on sampled PDF pages: re-read and confirm bullets appear.
    pages = load_pages()
    checked = 0
    for r in rows[:400]:
        p = r["source_locator"]["pdf_page"]
        needle = r["yeu_cau_can_dat_verbatim"][:40]
        if needle in pages[p - 1].replace("\n", " ") or needle[:25] in pages[p - 1]:
            checked += 1
    print(f"verbatim page cross-check: {checked}/400 sampled rows found on cited page")
    assert checked >= 300, "verbatim cross-check failed"
    print("CHECK OK")


def cmd_seed():
    import psycopg
    import urllib.parse
    env = {}
    if os.path.exists(".env"):
        with open(".env", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    dsn = os.environ.get("DATABASE_URL") or env.get("DATABASE_URL")
    if not dsn:
        raise SystemExit("Missing DATABASE_URL")
    # Quote a raw password (it may contain URL-significant chars); never
    # print the DSN — errors below expose host only.
    u = urllib.parse.urlsplit(dsn)
    host = u.hostname or "?"
    try:
        pw = urllib.parse.unquote(u.password or "")
        net = u.username + (":" + urllib.parse.quote(pw, safe="") if pw else "") + "@" + u.hostname
        if u.port:
            net += ":" + str(u.port)
        dsn = urllib.parse.urlunsplit((u.scheme, net, u.path, u.query, u.fragment))
        conn = psycopg.connect(dsn, connect_timeout=30)
    except Exception as e:
        raise SystemExit(f"DB connect failed (host {host}): {type(e).__name__}")
    data = load_json()
    rows = data["rows"]
    with conn.cursor() as cur:
        batch = []
        done = 0
        for r in rows:
            batch.append((r["internal_id"], r["subject"], r["grade"], r["level"], r["strand"], r["topic"],
                          r["yeu_cau_can_dat_verbatim"], r["paired_noi_dung"],
                          json.dumps(r["source_locator"], ensure_ascii=False),
                          json.dumps(r["competency_refs"], ensure_ascii=False)))
            if len(batch) >= 500:
                cur.executemany(
                    """INSERT INTO moet_outcomes
                       (internal_id, subject, grade, level, strand, topic,
                        yeu_cau_can_dat_verbatim, paired_noi_dung, source_locator, competency_refs)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb)
                       ON CONFLICT (internal_id) DO UPDATE SET
                         yeu_cau_can_dat_verbatim = EXCLUDED.yeu_cau_can_dat_verbatim,
                         source_locator = EXCLUDED.source_locator""", batch)
                conn.commit()
                done += len(batch)
                print(f"  ...{done}/{len(rows)}", flush=True)
                batch = []
        if batch:
            cur.executemany(
                """INSERT INTO moet_outcomes
                   (internal_id, subject, grade, level, strand, topic,
                    yeu_cau_can_dat_verbatim, paired_noi_dung, source_locator, competency_refs)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb)
                   ON CONFLICT (internal_id) DO UPDATE SET
                     yeu_cau_can_dat_verbatim = EXCLUDED.yeu_cau_can_dat_verbatim,
                     source_locator = EXCLUDED.source_locator""", batch)
            conn.commit()
            done += len(batch)
    print(f"seed OK: {done} rows upserted")
    conn.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=DEFAULT_OUT)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--seed", action="store_true")
    args = ap.parse_args()
    if args.check:
        cmd_check()
    elif args.seed:
        cmd_seed()
    else:
        cmd_extract(args.out)


if __name__ == "__main__":
    sys.exit(main())
