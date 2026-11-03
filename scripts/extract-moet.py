"""Rebuild exact page text index from the supplied MOET PDF (requires pypdf)."""
from pathlib import Path
import hashlib
import json
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
source = next((root / 'references').glob('01-GDPT*.pdf'))
reader = PdfReader(source)
pages = [{'page': i + 1, 'text': p.extract_text()} for i, p in enumerate(reader.pages)]
output = root / 'server' / 'assets' / 'moet-pages.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({
    'sourceFile': source.name,
    'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'pageNumbering': '1-based PDF page, not printed page number',
    'pages': pages,
}, ensure_ascii=False), encoding='utf-8')
print(f'Indexed {len(pages)} pages ({sum(bool(p["text"].strip()) for p in pages)} with text)')
