import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
// @ts-ignore pdf-parse v2 API
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
export function sanitizeHtml(html:string){return html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/ on\w+="[^"]*"/gi,'').replace(/ on\w+='[^']*'/gi,'').replace(/javascript:/gi,'').replace(/<iframe[\s\S]*?<\/iframe>/gi,'');}
export function stripTags(html:string){return sanitizeHtml(html).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
export interface SceneDraft{title:string,summary:string,keywords:string,chapter:string,essentialDetails:string,connection:string}
export function splitScenes(text:string):SceneDraft[]{
  const clean=String(text||'').replace(/\r\n/g,'\n');
  // Preserve chapters: headings markdown / "Chương" / "Phần"
  const chapterParts:{chapter:string,body:string}[]=[]; let cur={chapter:'',body:''};
  for(const line of clean.split('\n')){ if(/^(#{1,3}\s+.+|Chương\s+\S+.*|Phần\s+\S+.*)$/i.test(line.trim()) && cur.body.trim()){chapterParts.push(cur); cur={chapter:line.replace(/^#+\s*/,'').trim(),body:''};} else if(/^(#{1,3}\s+.+|Chương\s+\S+.*)$/i.test(line.trim())&&!cur.chapter){cur.chapter=line.replace(/^#+\s*/,'').trim();} else cur.body+=line+'\n'; }
  chapterParts.push(cur);
  const scenes:SceneDraft[]=[];
  for(const part of chapterParts){
    const paras=part.body.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
    const units = paras.length?paras: (part.body.trim()?[part.body.trim()]:[]);
    // group up to ~900 chars per scene, covering ALL units, no cap
    let buf:string[]=[]; let len=0;
    const flush=()=>{ if(!buf.length)return; const joined=buf.join('\n\n'); const first=buf[0].replace(/\s+/g,' ').slice(0,70); scenes.push({title:`Cảnh ${scenes.length+1}: ${first}${first.length>=70?'…':''}`,summary:joined,keywords:[...new Set(joined.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>5))].slice(0,8).join(', '),chapter:part.chapter,essentialDetails:'',connection:part.chapter?`Thuộc ${part.chapter}`:''}); buf=[];len=0; };
    for(const p of units){ if(len+p.length>900&&buf.length)flush(); buf.push(p); len+=p.length; }
    flush();
  }
  return scenes.length?scenes:[{title:'Cảnh 1',summary:clean.trim(),keywords:'',chapter:'',essentialDetails:'',connection:''}];
}
export function validateScenes(input:any):SceneDraft[]{ if(!Array.isArray(input)) throw new Error('Kết quả AI không phải danh sách cảnh hợp lệ.'); return input.map((s:any,i:number)=>{ if(!s||typeof s.title!=='string'||typeof s.summary!=='string'||!s.title.trim()||!s.summary.trim()) throw new Error(`Cảnh ${i+1} thiếu tiêu đề/tóm tắt.`); return {title:s.title.trim(),summary:s.summary.trim(),keywords:String(s.keywords||''),chapter:String(s.chapter||''),essentialDetails:String(s.essentialDetails||s.essential_details||''),connection:String(s.connection||'')}; }); }
export function validateAiFeedback(input:any,scenes:{title:string,summary:string}[]=[],adaptationNotes=''){
  if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error('Kết quả góp ý AI không đúng định dạng đối tượng JSON.');
  const arr=(v:any)=>Array.isArray(v)?v:[];
  const covered=arr(input.covered).map((x:any)=>typeof x==='string'?x:String(x?.scene||x?.title||'')).filter(Boolean);
  const strengths=arr(input.strengths).map((x:any)=>typeof x==='string'?x:String(x?.point||x?.text||x?.evidence||'')).filter(Boolean);
  const omissions=arr(input.omissions).map((o:any)=>typeof o==='string'?{scene:'Chi tiết trong truyện',evidence:o,type:'cần rà soát so với bản đóng băng'}:{scene:String(o?.scene||o?.title||'Cảnh trong bản đóng băng'),evidence:String(o?.evidence||o?.quote||o?.detail||''),type:String(o?.type||'thiếu chi tiết so với snapshot đóng băng')}).filter((o:any)=>o.scene||o.evidence);
  const adaptations=arr(input.adaptations).map((a:any)=>typeof a==='string'?{note:a,evidence:'',type:'chuyển thể có chủ ý'}:{note:String(a?.note||a?.adaptation||a?.description||''),evidence:String(a?.evidence||a?.quote||''),type:String(a?.type||'chuyển thể có chủ ý — không tính là thiếu sót')}).filter((a:any)=>a.note);
  if(adaptationNotes&&!adaptations.length) adaptations.push({note:adaptationNotes,evidence:'Ghi chú của người kể trong lượt luyện',type:'chuyển thể có chủ ý — không tính là thiếu sót'});
  const nextStep=typeof input.nextStep==='string'&&input.nextStep.trim()?input.nextStep.trim():(omissions[0]?`Luyện kể lại phần “${omissions[0].scene}” với chi tiết cốt yếu trong bản đóng băng.`:'Kể lại toàn truyện một lượt tự do và nghe lại bản ghi âm.');
  const ageFit=typeof input.ageFit==='string'?input.ageFit.trim():'';
  if(!covered.length&&!strengths.length&&!omissions.length&&scenes.length) throw new Error('Kết quả góp ý AI thiếu nội dung đối chiếu.');
  return {
    method:'AI (Meta) — đối chiếu theo snapshot đã đóng băng',
    label:'Góp ý nội dung bằng AI (Meta): đối chiếu bản kể (transcript) với văn bản nguồn, bản đồ cảnh, độ tuổi và ghi chú chuyển thể đã đóng băng của lượt luyện này.',
    covered,
    strengths,
    omissions,
    adaptations,
    ageFit,
    nextStep,
    overallScore:null,
    deliveryNote:'Chưa phân tích biểu cảm/nhịp giọng từ âm thanh — góp ý AI này chỉ dựa trên văn bản transcript và snapshot đã đóng băng; hãy nghe lại bản ghi âm bên cạnh.'
  };
}
export function localFeedback(sourceText:string,transcript:string,scenes:{title:string,summary:string}[],adaptationNotes=''){
  const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const t=norm(transcript||''); const covered=scenes.filter(sc=>{const words=[...new Set(norm(sc.summary).split(/\s+/).filter(w=>w.length>4))]; const hit=words.filter(w=>t.includes(w)).length; return words.length&&hit/words.length>0.2;});
  const missing=scenes.filter(sc=>!covered.includes(sc));
  return {method:'phân tích cục bộ — không phải AI',label:'Phân tích cục bộ (không phải AI): đối chiếu transcript với bản đồ cảnh đã đóng băng trong lượt luyện.',covered:covered.map(s=>s.title),omissions:missing.map(s=>({scene:s.title,evidence:`Chưa thấy đủ dấu vết từ khóa của cảnh trong transcript. Trích cảnh đã đóng băng: “${s.summary.slice(0,180)}”`,type:'có thể thiếu — đối chiếu với ghi chú chuyển thể có chủ ý trước khi kết luận'})),adaptations:adaptationNotes?[{note:adaptationNotes,type:'chuyển thể có chủ ý do người kể ghi — không tính là thiếu sót'}]:[],strengths:covered.length?[`Đã chạm tới ${covered.length}/${scenes.length} cảnh trong bản đồ đã đóng băng.`]:[],nextStep:missing.length?`Luyện lại cảnh: ${missing[0].title} — kể thành tiếng một lần với từ khóa, một lần không.`:'Kể lại toàn truyện không nhìn gợi ý và ghi âm đối chứng.',overallScore:null,deliveryNote:'Chưa phân tích audio (nhịp, khoảng lặng, biểu cảm) — transcript không đủ để kết luận về cách kể; hãy nghe lại bản ghi.'};
}
function docViaTextutil(buf:Buffer):Promise<string>{ return new Promise((resolve,reject)=>{ const tmp=path.join(fs.mkdtempSync(path.join(process.env.TMPDIR||'/tmp','xuvi-doc-')),'in.doc'); fs.writeFileSync(tmp,buf); const p=spawn('textutil',['-convert','txt','-stdout',tmp]); let out='',err=''; p.stdout.on('data',d=>out+=d); p.stderr.on('data',d=>err+=d); p.on('error',()=>reject(new Error('Định dạng DOC cũ cần macOS textutil hoặc chuyển sang DOCX.'))); p.on('close',code=>{ try{fs.rmSync(path.dirname(tmp),{recursive:true,force:true});}catch{} code===0&&out.trim()?resolve(out):reject(new Error('Không trích được DOC bằng textutil: '+(err.slice(0,200)||'file rỗng/hỏng'))); }); }); }
export async function extractFile(buf:Buffer,filename:string):Promise<{text:string,pages?:number}>{
  const ext=path.extname(filename).toLowerCase();
  if(['.txt','.md'].includes(ext)) return {text:buf.toString('utf8')};
  if(ext==='.html'||ext==='.htm') return {text:stripTags(buf.toString('utf8'))};
  if(ext==='.docx'){const r=await mammoth.extractRawText({buffer:buf}); return {text:r.value};}
  if(ext==='.doc'){ return {text:await docViaTextutil(buf)}; }
  if(ext==='.pdf'){const parser=new PDFParse({data:new Uint8Array(buf)}); const r:any=await parser.getText(); return {text:r.text,pages:r.total||r.pages?.length};}
  throw new Error('Định dạng chưa hỗ trợ. Hỗ trợ: DOC, DOCX, PDF, HTML, MD, TXT.');
}
export function shaFile(p:string){try{return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}catch{return '';}}
export const REF_DIR=path.resolve(process.cwd(),'references');
export function isWav(buf:Buffer){return buf.length>12&&buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WAVE';}
export function escapeMd(s:any){return String(s??'').replace(/\|/g,'\\|').replace(/\n/g,'<br>');}
