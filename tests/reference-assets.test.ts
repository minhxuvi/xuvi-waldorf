import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const hash = (file: string) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

test('curriculum import retains all 41 source records and exact source provenance', () => {
  const rows = JSON.parse(fs.readFileSync(path.join(root, 'server/assets/curriculum-source.json'), 'utf8'));
  assert.equal(rows.length, 41);
  const counts: Record<string, number> = {};
  const knownHashes: Record<string, string> = {};
  for (const row of rows) {
    const file = path.join(root, 'references', row.sourceFile);
    knownHashes[file] ??= hash(file);
    assert.equal(row.sourceSha256, knownHashes[file], 'Source changed; rebuild the index');
    assert.equal(fs.readFileSync(file, 'utf8').split('\n')[row.sourceLine - 1].trim(), '```yaml');
    assert.ok(row.data.id && row.data.title);
    counts[row.sourceFile] = (counts[row.sourceFile] || 0) + 1;
  }
  assert.deepEqual(Object.values(counts).sort((a, b) => a - b), [12, 12, 17]);
  const classic = rows.filter((r: any) => r.sourceFile.startsWith('01-'));
  assert.deepEqual(classic.map((r: any) => r.data.grade).sort((a: number, b: number) => a - b), Array.from({length: 12}, (_, i) => i + 1));
  for (const row of classic) assert.ok(row.data.blocks.length > 0 && row.data.milestones.length > 0);
});

test('MOET full page index matches supplied PDF and uses exact 1-based PDF page numbers', () => {
  const index = JSON.parse(fs.readFileSync(path.join(root, 'server/assets/moet-pages.json'), 'utf8'));
  assert.equal(index.sourceSha256, hash(path.join(root, 'references', index.sourceFile)));
  assert.equal(index.pages.length, 1555);
  assert.equal(index.pages.filter((p: any) => p.text.trim()).length, 1552);
  index.pages.forEach((p: any, i: number) => assert.equal(p.page, i + 1));
  assert.match(index.pages[166].text, /MÔN TOÁN/);
  assert.match(index.pages[348].text, /MÔN TỰ NHIÊN VÀ XÃ HỘI/);
  assert.equal(index.pages[0].text.trim(), '');
});
