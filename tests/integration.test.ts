import test from 'node:test'; import assert from 'node:assert';
import { spawn, ChildProcess } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import http from 'node:http';
const root=process.cwd();
let fake:http.Server; let app:ChildProcess|undefined; const dir=fs.mkdtempSync(path.join(os.tmpdir(),'xuvi-it-'));
const PORT=5231, FAKE=5232;
const pngB64='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=';
async function waitUp(){ for(let i=0;i<60;i++){ try{ const r=await fetch(`http://127.0.0.1:${PORT}/api/ai/status`); if(r.ok) return; }catch{} await new Promise(r=>setTimeout(r,250)); } throw new Error('server not up'); }
function startApp(){ app=spawn('npx',['tsx','server/src/index.ts'],{cwd:root,env:{...process.env,XUVI_DATA_DIR:dir,PORT:String(PORT),META_API_KEY:'test-key-not-real',META_API_BASE:`http://127.0.0.1:${FAKE}/v1`},stdio:'pipe'}); return waitUp(); }
async function stopApp(){ if(app){ app.kill('SIGTERM'); await new Promise(r=>setTimeout(r,600)); app=undefined; } }
const api=async(p:string,m='GET',b?:any)=>{ const r=await fetch(`http://127.0.0.1:${PORT}`+p,{method:m,headers:b?{'Content-Type':'application/json'}:undefined,body:b?JSON.stringify(b):undefined}); const t=await r.text(); let j:any={}; try{j=JSON.parse(t);}catch{j={raw:t};} return {s:r.status,j,t}; };
test('full API integration on isolated temp data', async (t)=>{
 let lastChatBody='';
 fake=http.createServer((req,res)=>{ let body=''; req.on('data',c=>body+=c); req.on('end',()=>{ res.setHeader('Content-Type','application/json'); if(req.url?.includes('/chat/completions')){ lastChatBody=body; const isScene=body.includes('cảnh nhớ'); const isFb=body.includes('SNAPSHOT ĐÃ ĐÓNG BĂNG'); const content=isScene?JSON.stringify([{title:'Cảnh AI 1',summary:'Tí gặp cá bên suối.',keywords:'suối, cá',chapter:'Chương 1',essentialDetails:'cá mắc cạn',connection:'mở đầu'}]):isFb?JSON.stringify({covered:['Cảnh AI 1'],strengths:['Bản kể nhắc rõ “Tí đưa cá về suối” khớp Cảnh AI 1.'],omissions:[{scene:'Chương hai',evidence:'Trong bản đóng băng có “Đoạn cuối DUY NHẤT 12345 Tí trở về nhà an toàn” nhưng bản kể chưa nhắc.',type:'lược bỏ tình tiết'}],adaptations:[{note:'Rút ngắn có chủ ý cho trẻ 7 tuổi',evidence:'Ghi chú người kể',type:'chuyển thể có chủ ý'}],ageFit:'Phù hợp trẻ 7 tuổi',nextStep:'Kể thêm cảnh Tí trở về nhà an toàn ở cuối truyện.'}):'Phản hồi giả lập OK'; return res.end(JSON.stringify({choices:[{message:{content}}]})); } if(req.url?.includes('/images/generations')) return res.end(JSON.stringify({data:[{b64_json:pngB64}]})); if(req.url?.includes('/asr/transcribe')) return res.end(JSON.stringify({transcript:'Tí đưa cá về suối.',audioDurationMs:1200,turns:[{startMs:0,endMs:1000,transcript:'Tí đưa cá về suối.'}]})); if(req.url?.includes('/models')) return res.end(JSON.stringify({data:[{id:'muse-spark-1.3'},{id:'muse-image-1.0'}]})); res.statusCode=404; res.end('{}'); }); });
 await new Promise<void>(r=>fake.listen(FAKE,'127.0.0.1',r));
 await startApp();
 try{
  // timetable complete + validation
  let tt=await api('/api/timetable'); assert.equal(tt.j.totals.total,2100); assert.equal(tt.j.entries.length,40);
  let bad=await api('/api/timetable','POST',{day:0,start:'07:00',end:'08:00',title:'Ngoài giờ'}); assert.equal(bad.s,400);
  let over=await api('/api/timetable','POST',{day:0,start:'08:15',end:'08:45',title:'Trùng'}); assert.equal(over.s,409);
  // invalid ids
  assert.equal((await api('/api/stories/abc')).s,400); assert.equal((await api('/api/stories/999999')).s,404); assert.equal((await api('/api/grades/999999')).s,404);
  // exact provenance: requirement quote must appear (normalized) in moet page 320
  const reqs=await api('/api/requirements'); assert.ok(reqs.j.length>=4); const r320=reqs.j.find((r:any)=>r.page===320); assert.ok(r320); const page=await api('/api/sources/moet/page/320'); const norm=(s:string)=>s.replace(/\s+/g,' ').toLowerCase(); assert.ok(norm(page.j.text).includes('nêu được một số truyền thống'));
  assert.ok(!reqs.j.some((r:any)=>['NL-TV1','NL-T1'].includes(r.code)), 'fabricated seed codes removed');
  // grades full source
  const grades=await api('/api/grades'); assert.equal(grades.j.length,41); const subs=JSON.parse(grades.j[0].subjectsJson); assert.ok(Array.isArray(subs)&&subs.length>0&&'objectives' in subs[0]);
  // bulk extraction with review state
  const bulk=await api('/api/requirements/bulk-from-pages','POST',{pages:[320],subject:'Giáo dục công dân',gradeLevel:'Lớp 7'}); assert.equal(bulk.s,201); assert.ok(bulk.j.created>=1);
  // populated fixtures -> doc fields
  const stu=await api('/api/students','POST',{name:'Học Sinh Kiểm Thử',birthYear:2018,className:'Lớp 1',illustrative:0});
  await api('/api/journal','POST',{date:'2026-09-05',content:'Đã dạy kể chuyện Tí và cá',assessment:'Trẻ kể lại mạch lạc',assignment:'Vẽ cảnh suối',note:'Tiến bộ rõ'});
  await api('/api/attendance','POST',{studentId:stu.j.id,date:'2026-09-05',status:'co-mat'});
  await api('/api/artifacts','POST',{studentId:stu.j.id,title:'Tranh suối của em',kind:'tranh',date:'2026-09-05',filePath:'/files/test.png'});
  await api('/api/reports','POST',{studentId:stu.j.id,period:'Kỳ 1',summary:'Tiến bộ kể chuyện',strengths:'Nhớ trình tự',nextSteps:'Luyện chi tiết',createdAt:new Date().toISOString()});
  const checks:{[k:string]:string[]}={'1':['Triết lý','Mục tiêu','Phẩm chất','Phương pháp','Thời lượng','Nguyên tắc đánh giá'],'2':['Mục tiêu','Kết quả','Nội dung','Thời lượng','Phương pháp','Học liệu'],'3':['Ma trận','Mức độ','Trang nguồn','không phải chứng nhận'],'4':['Mốc năm học','Phân phối môn','Chủ đề','Hoạt động trải nghiệm','Lịch đánh giá','Kế hoạch dự phòng'],'5':['08:00','15:00','Người phụ trách','Mục tiêu','Thời lượng thực tế'],'6':['Điểm danh','Sản phẩm học tập','Báo cáo theo kỳ','Học Sinh Kiểm Thử','Tranh suối của em','Tiến bộ kể chuyện','Đã dạy kể chuyện']};
  for(const [tp,words] of Object.entries(checks)){ const d=await api(`/api/documents/${tp}?format=preview`); assert.equal(d.s,200,tp); for(const w of words) assert.ok(d.j.md.includes(w),`doc ${tp} missing ${w}`); assert.ok(d.j.md.includes('| ---'),`doc ${tp} markdown table separator`); const dx=await fetch(`http://127.0.0.1:${PORT}/api/documents/${tp}?format=docx`); const buf=Buffer.from(await dx.arrayBuffer()); assert.equal(dx.status,200); assert.equal(buf.subarray(0,2).toString(),'PK',`docx ${tp} zip`); assert.ok(buf.length>3000); }
  // story full preservation + frozen snapshot
  const longText='## Chương một\n\n'+Array.from({length:20},(_,i)=>`Đoạn ${i} Tí đi qua làng quê Việt Nam, gặp suối, cá và bà ngoại với chi tiết quan trọng ${i}.`).join('\n\n')+'\n\n## Chương hai\n\nĐoạn cuối DUY NHẤT 12345 Tí trở về nhà an toàn.';
  const story=await api('/api/stories','POST',{title:'Truyện kiểm thử',sourceText:longText,ageRange:'7 tuổi'}); assert.equal(story.s,201);
  const auto=await api(`/api/stories/${story.j.id}/auto-scenes`,'POST',{}); assert.ok(JSON.stringify(auto.j.scenes).includes('DUY NHẤT 12345'));
  const aiSc=await api(`/api/stories/${story.j.id}/ai-scenes`,'POST',{confirmRemote:true,save:true}); assert.equal(aiSc.s,200); assert.equal(aiSc.j.scenes[0].title,'Cảnh AI 1');
  const att=await api('/api/attempts','POST',{storyId:story.j.id,mode:'fading',assistance:'keywords',transcript:'Tí đưa cá về suối.',adaptationNotes:'Rút ngắn có chủ ý'}); assert.equal(att.s,201); const snap=JSON.parse(att.j.snapshotJson); assert.ok(snap.storyText.includes('DUY NHẤT 12345')); assert.equal(att.j.mode,'fading'); assert.equal(att.j.assistance,'keywords'); const fb=JSON.parse(att.j.feedbackJson); assert.equal(fb.overallScore,null);
  await api(`/api/stories/${story.j.id}`,'PUT',{title:'Truyện kiểm thử v2',sourceText:'Văn bản hoàn toàn mới không còn cá.',sourceInfo:'',rights:'',ageRange:'7 tuổi',language:'Tiếng Việt',context:'',goal:''});
  const after=await api('/api/stories/'+story.j.id); const oldAtt=after.j.attempts.find((a:any)=>a.id===att.j.id); assert.ok(JSON.parse(oldAtt.snapshotJson).storyText.includes('DUY NHẤT 12345'),'snapshot frozen after edit');
  // AI retelling feedback uses frozen snapshot (DUY NHẤT 12345), requires confirmRemote, enforces overallScore:null
  const noConfirmFb=await api(`/api/attempts/${att.j.id}/ai-feedback`,'POST',{}); assert.equal(noConfirmFb.s,400);
  const aiFb=await api(`/api/attempts/${att.j.id}/ai-feedback`,'POST',{confirmRemote:true}); assert.equal(aiFb.s,200); assert.ok(lastChatBody.includes('DUY NHẤT 12345'),'AI feedback prompt must use frozen snapshot, not mutated v2 story'); assert.equal(aiFb.j.feedback.overallScore,null); assert.match(aiFb.j.feedback.method,/AI \(Meta\)/); assert.ok(aiFb.j.feedback.strengths.length>=1); assert.ok(aiFb.j.feedback.omissions.length>=1); assert.ok(aiFb.j.feedback.adaptations.length>=1);
  // doc filters (gradeId, day, studentId) & no raw JSON in type 4
  const d4=await api('/api/documents/4?format=preview'); assert.ok(!d4.j.md.includes('"distribution"'),'type 4 should not render raw JSON keys');
  const d2Single=await api('/api/documents/2?format=json&gradeId=1'); assert.equal(d2Single.j.sections.length,1,'gradeId filter exports 1 grade');
  const d6Filtered=await api(`/api/documents/6?format=json&studentId=${stu.j.id}`); assert.ok(d6Filtered.j.context.includes('Học Sinh Kiểm Thử'));
  // fake provider image + text + transcribe contracts through app
  const txt=await api('/api/ai/text','POST',{prompt:'xin chào',confirmRemote:true}); assert.match(txt.j.text,/giả lập/);
  const noConfirm=await api('/api/ai/text','POST',{prompt:'x'}); assert.equal(noConfirm.s,400);
  const img=await api('/api/ai/image','POST',{prompt:'suối làng',style:'watercolor',confirmRemote:true}); assert.ok(img.j.path?.startsWith('/files/'),'b64 image saved durably');
  const wavPath=path.join(dir,'files','synth.wav'); const wav=Buffer.alloc(44+16000); wav.write('RIFF',0); wav.writeUInt32LE(36+16000,4); wav.write('WAVE',8); wav.write('fmt ',12); wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22); wav.writeUInt32LE(16000,24); wav.writeUInt32LE(32000,28); wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(16000,40); fs.writeFileSync(wavPath,wav);
  const tr=await api('/api/ai/transcribe','POST',{file:'synth.wav',confirmRemote:true}); assert.equal(tr.j.text,'Tí đưa cá về suối.'); assert.equal(tr.j.audioDurationMs,1200);
  // uploads + sanitization path
  const upBad=await fetch(`http://127.0.0.1:${PORT}/api/upload/story`,{method:'POST',headers:{'x-filename':'evil.exe'},body:Buffer.from('MZ')}); assert.equal(upBad.status,400);
  const upHtml=await fetch(`http://127.0.0.1:${PORT}/api/upload/story`,{method:'POST',headers:{'x-filename':'a.html'},body:Buffer.from('<script>alert(1)</script><p>Xin chào làng quê</p>')}); const upHtmlJ:any=await upHtml.json(); assert.ok(!upHtmlJ.text.includes('alert'));
  // media + backup/restore roundtrip and rollback
  const up=await fetch(`http://127.0.0.1:${PORT}/api/upload/file`,{method:'POST',headers:{'x-filename':'minh.png'},body:Buffer.from(pngB64,'base64')}); const upJ:any=await up.json(); assert.ok(upJ.path);
  const backup=await api('/api/backup'); assert.equal(backup.j.version,2); assert.ok(backup.j.files.some((f:any)=>f.name===upJ.file));
  const badRestore=await api('/api/restore','POST',{version:99,stories:[]}); assert.equal(badRestore.s,400); const still=await api('/api/stories'); assert.ok(still.j.length>=1,'rollback keeps data');
  const restore=await api('/api/restore','POST',backup.j); assert.equal(restore.s,200); const mediaRes=await fetch(`http://127.0.0.1:${PORT}${upJ.path}`); assert.equal(mediaRes.status,200,'media survives restore');
  // story bundle
  const bundle=await api(`/api/stories/${story.j.id}/export`); assert.equal(bundle.j.kind,'xuvi-story-bundle'); assert.ok(bundle.j.scenes.length>=1);
  // restart persistence
  await stopApp(); await startApp();
  const persisted=await api('/api/stories/'+story.j.id); assert.equal(persisted.s,200); assert.match(persisted.j.title,/v2/);
 } finally { await stopApp(); fake.close(); fs.rmSync(dir,{recursive:true,force:true}); }
});
