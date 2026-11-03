import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';

test('real local workflows preserve source, attempts, evidence and restore integrity', {timeout: 90000}, async (t) => {
  const root = path.resolve(import.meta.dirname, '..');
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'xuvi-workflow-test-'));
  const port = await new Promise<number>((resolve) => {
    const s = net.createServer().listen(0, '127.0.0.1', () => {
      const p = (s.address() as net.AddressInfo).port;
      s.close(() => resolve(p));
    });
  });
  const proc = spawn(process.execPath, ['--import', 'tsx', 'server/src/index.ts'], {
    cwd: root,
    env: {...process.env, XUVI_DATA_DIR: data, PORT: String(port), META_API_KEY: '', MODEL_API_KEY: '', MUSE_API_KEY: '', XUVI_NO_LISTEN: '0'},
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let errors = '';
  proc.stderr.on('data', chunk => errors += chunk);
  t.after(async () => {
    proc.kill('SIGTERM');
    await new Promise<void>(resolve => { if (proc.exitCode !== null) resolve(); else proc.once('exit', () => resolve()); });
    fs.rmSync(data, {recursive: true, force: true});
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base + '/api/dashboard')).ok) { ready = true; break; } } catch {}
    if (proc.exitCode !== null) throw Error('Server failed: ' + errors);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Local test server must start: ' + errors);
  const get = async (url: string) => {const r = await fetch(base + url); assert.equal(r.status, 200, url); return r.json();};
  const send = async (url: string, body: unknown, method = 'POST') => {
    const r = await fetch(base + url, {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    const text = await r.text();
    assert.ok(r.ok, `${method} ${url}: ${r.status} ${text.slice(0,200)}`);
    return JSON.parse(text);
  };
  const timetable = await get('/api/timetable');
  assert.equal(timetable.totals.total, 2100);
  for (let day = 0; day < 5; day++) {
    const entries = timetable.entries.filter((x: any) => x.day === day);
    assert.equal(entries[0].start, '08:00');
    assert.equal(entries.at(-1).end, '15:00');
    for (let i = 1; i < entries.length; i++) assert.equal(entries[i-1].end, entries[i].start);
  }
  const page = await get('/api/sources/moet/page/210');
  const quote = page.text.split('\n').map((x: string) => x.trim()).find((x: string) => x.length > 50)!;
  const requirement = await send('/api/requirements', {sourceId: 1, code:'QA-real-quote', gradeLevel:'Lớp 3', subject:'Toán', text:quote, quote, page:210});
  assert.equal(requirement.quote, quote);
  const bulk = await send('/api/requirements/bulk-from-pages', {pages:[211], gradeLevel:'Lớp 3',subject:'Toán'});
  assert.ok(bulk.created > 0, 'Bulk extraction should create reviewable candidates');
  const matrix = await send('/api/matrix/generate', {pages:[212], gradeLevel:'Lớp 3',subject:'Toán'});
  assert.ok(matrix.created > 0);
  await send(`/api/mappings/${requirement.id}`, {content:'Đo vườn rau', hours:'45 phút', evidence:'Bản đo có ngày',degree:'mot-phan'}, 'PUT');

  const story = await send('/api/stories', {title:'QA truyện hạt mầm',sourceText:'Hạt mầm ngủ trong lòng đất.\n\nMưa đến, mầm thức dậy và vươn lên.\n\nChiếc lá đầu tiên đón nắng mai.',ageRange:'6–8',language:'Tiếng Việt',context:'Kiểm thử',goal:'Giữ mạch truyện',sourceInfo:'Truyện kiểm thử',rights:'Tự viết'});
  await send(`/api/stories/${story.id}/auto-scenes`, {});
  const attempt = await send('/api/attempts', {storyId:story.id,mode:'free',assistance:'none',transcript:'Hạt mầm đón mưa rồi mọc chiếc lá đầu tiên.'});
  const snapshot = JSON.parse(attempt.snapshotJson);
  assert.equal(snapshot.storyText, story.sourceText);
  await send(`/api/stories/${story.id}`, {...story,sourceText:'Một nội dung hoàn toàn khác.'}, 'PUT');
  const corrected = await send(`/api/attempts/${attempt.id}`, {transcript:'Hạt mầm ngủ, đón mưa, mọc lá.'}, 'PUT');
  assert.equal(JSON.parse(corrected.snapshotJson).storyText, snapshot.storyText);

  const student = await send('/api/students', {name:'Học sinh kiểm thử',birthYear:2018,className:'Lớp 3',note:'Dữ liệu kiểm thử',illustrative:1});
  await send('/api/attendance', {studentId:student.id,date:'2026-11-03',status:'co-mat',note:'Điểm danh QA'});
  await send('/api/journal', {date:'2026-11-03',content:'Quan sát hạt mầm QA',assessment:'Kể lại đúng thứ tự',assignment:'Vẽ lá',note:'Ghi chú tiến bộ QA'});
  await send('/api/artifacts', {studentId:student.id,title:'Bức vẽ kiểm thử',kind:'ve',date:'2026-11-03',note:'Minh chứng QA',filePath:''});
  await send('/api/reports', {studentId:student.id,period:'Tháng 11',summary:'Báo cáo tiến bộ QA',strengths:'Quan sát',nextSteps:'Luyện kể',createdAt:new Date().toISOString()});
  const evidenceDoc = JSON.stringify(await get(`/api/documents/6?format=json&studentId=${student.id}`));
  for (const marker of ['Quan sát hạt mầm QA','Điểm danh QA','Bức vẽ kiểm thử','Báo cáo tiến bộ QA','Có mặt','Kể tự do']) assert.ok(evidenceDoc.includes(marker), 'Document 6 missing '+marker);
  const doc4 = await get('/api/documents/4?format=preview');
  assert.ok(!doc4.md.includes('"distribution"'), 'Document 4 must not contain raw JSON keys');
  const print5 = await (await fetch(base + '/api/documents/5?format=print&day=2')).text();
  assert.ok(print5.includes('@page{size:A4 landscape'), 'Document 5 print view should use landscape page rule');
  assert.ok(print5.includes('Thẻ dạy gọn — Thứ 4'), 'Document 5 print view should include selected day teaching card');
  for (let type = 1; type <= 6; type++) {
    const r = await fetch(base + `/api/documents/${type}?format=docx`);
    assert.equal(r.status, 200);
    const b = Buffer.from(await r.arrayBuffer());
    assert.equal(b.subarray(0,2).toString(), 'PK');
    assert.ok(b.length > 1000);
  }
  const before = await get('/api/backup');
  const badRestore = await fetch(base+'/api/restore', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...before,students:[{id:'bad-column',invalidField:'invalid'}]})});
  assert.equal(badRestore.status,400);
  const after = await get('/api/backup');
  assert.deepEqual(after.stories, before.stories);
  assert.deepEqual(after.students, before.students);
  assert.ok(!JSON.stringify(after).includes('META_API_KEY='));
});
