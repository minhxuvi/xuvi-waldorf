import { spawn } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
import { redact } from './db.js';
import { isWav, validateAiFeedback } from './lib.js';
const BASE=()=> (process.env.META_API_BASE||process.env.MODEL_API_BASE||'https://api.meta.ai/v1').replace(/\/$/,'');
const KEY=()=> process.env.META_API_KEY||process.env.MODEL_API_KEY||process.env.MUSE_API_KEY||'';
const KEYNAME=()=> process.env.META_API_KEY?'META_API_KEY':process.env.MODEL_API_KEY?'MODEL_API_KEY':process.env.MUSE_API_KEY?'MUSE_API_KEY':'';
export function aiStatus(){const k=KEY(); return {configured:!!k,keyEnv:KEYNAME(), base:BASE(), textModel:process.env.META_TEXT_MODEL||'muse-spark-1.3', wonderModel:process.env.META_WONDER_MODEL||'muse-wonder-1.0', imageModel:process.env.META_IMAGE_MODEL||'muse-image-1.0', transcribeModel:process.env.META_TRANSCRIBE_MODEL||'muse-voice-transcribe-1.0', transcribePath:process.env.META_TRANSCRIBE_PATH||'/asr/transcribe', cliBridge:process.env.XUVI_CLI_BRIDGE==='1'};}
async function call(p:string,init:RequestInit,ms=60000){
  let lastErr:any;
  for(let attempt=0;attempt<3;attempt++){
    const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);
    try{
      const r=await fetch(BASE()+p,{...init,signal:c.signal,headers:{'Authorization':`Bearer ${KEY()}`,'Content-Type':'application/json',...(init.headers||{})}});
      const txt=await r.text();
      if(!r.ok){
        lastErr=new Error(redact(`Meta API ${r.status}: ${txt.slice(0,400)}`));
        if([429,502,503,504].includes(r.status)&&attempt<2){ await new Promise(res=>setTimeout(res,700*(attempt+1))); continue; }
        throw lastErr;
      }
      return JSON.parse(txt);
    }finally{clearTimeout(t);}
  }
  throw lastErr;
}
export async function aiModels():Promise<string[]>{ if(!KEY())throw new Error('Chưa cấu hình khóa API phía server.'); const j:any=await call('/models',{method:'GET'}); const arr=j.data||j.models||[]; return arr.map((m:any)=>typeof m==='string'?m:m.id).filter(Boolean); }
export async function aiText(prompt:string,model?:string){
  if(!KEY())throw new Error('Chưa cấu hình META_API_KEY/MODEL_API_KEY phía server. Luồng thủ công vẫn hoạt động.');
  const target=model||aiStatus().textModel;
  try{
    const j:any=await call('/chat/completions',{method:'POST',body:JSON.stringify({model:target,messages:[{role:'user',content:prompt}]})});
    return j.choices?.[0]?.message?.content||'';
  }catch(e:any){
    const fbModel=aiStatus().textModel;
    if(target!==fbModel && /503|502|504|overloaded/i.test(String(e?.message||''))){
      const j:any=await call('/chat/completions',{method:'POST',body:JSON.stringify({model:fbModel,messages:[{role:'user',content:prompt}]})});
      return j.choices?.[0]?.message?.content||'';
    }
    throw e;
  }
}
export async function aiRetellingFeedback(snap:any,transcript:string,adaptationNotes=''):Promise<any>{
  const scenes=Array.isArray(snap?.scenes)?snap.scenes:[];
  const chars=Array.isArray(snap?.characters)?snap.characters:[];
  const sceneLines=scenes.map((s:any,i:number)=>`${i+1}. [${s.title||`Cảnh ${i+1}`}]${s.chapter?` (${s.chapter})`:''}: ${String(s.summary||'').slice(0,450)}${s.essentialDetails?` | Chi tiết cốt yếu: ${s.essentialDetails}`:''}`).join('\n');
  const charLines=chars.map((c:any)=>`- ${c.name}: ${c.details}`).join('\n');
  const prompt=[
    'Bạn là cố vấn luyện kể chuyện dân gian theo hướng giáo dục lấy cảm hứng Waldorf tại Việt Nam.',
    'Hãy đối chiếu BẢN KỂ LẠI (transcript) với SNAPSHOT ĐÃ ĐÓNG BĂNG của lượt luyện này.',
    'Quy tắc bắt buộc:',
    '1. KHÔNG cho điểm tổng hay xếp hạng.',
    '2. KHÔNG suy diễn giọng kể, tốc độ, khoảng lặng hay biểu cảm âm thanh từ văn bản; không bịa timestamp.',
    '3. Phân biệt rõ: thiếu sót vô tình (omissions) với chuyển thể có chủ ý theo độ tuổi/bối cảnh (adaptations).',
    '4. Trích dẫn bằng chứng ngắn gọn từ văn bản đóng băng/cảnh đóng băng và từ bản kể.',
    '5. Trả về DUY NHẤT một JSON object hợp lệ theo cấu trúc:',
    '{"covered":["Tiêu đề cảnh đã chạm tới"],"strengths":["Điểm mạnh kèm trích dẫn ngắn từ bản kể"],"omissions":[{"scene":"Tiêu đề cảnh","evidence":"Trích chi tiết trong bản đóng băng chưa xuất hiện trong bản kể","type":"thiếu chi tiết cốt yếu | lược bỏ tình tiết"}],"adaptations":[{"note":"Nhận xét chuyển thể có chủ ý phù hợp lứa tuổi","evidence":"Trích dẫn từ ghi chú/bản kể","type":"chuyển thể có chủ ý — không tính là thiếu sót"}],"ageFit":"Nhận xét mức độ phù hợp độ tuổi và mục tiêu dựa trên từ ngữ bản kể","nextStep":"Một bước luyện tập tiếp theo cụ thể"}',
    '',
    `Thông tin đóng băng: Truyện "${snap?.title||''}" (phiên bản ${snap?.storyVersion||1}) | Độ tuổi/người nghe: ${snap?.audience||snap?.ageRange||'—'} | Bối cảnh: ${snap?.context||'—'} | Mục tiêu: ${snap?.goal||'—'} | Chế độ luyện: ${snap?.mode||'prompt'} / hỗ trợ: ${snap?.assistance||'none'}`,
    `Bản đồ cảnh đóng băng (${scenes.length} cảnh):\n${sceneLines||'(chưa tách cảnh)'}`,
    charLines?`Nhân vật & chi tiết cốt yếu:\n${charLines}`:'',
    `Văn bản nguồn đóng băng (trích):\n${String(snap?.storyText||'').slice(0,8000)}`,
    `Ghi chú chuyển thể có chủ ý của người kể: ${adaptationNotes||'(không có)'}`,
    `Bản kể lại (transcript đã rà soát):\n${transcript}`
  ].filter(Boolean).join('\n\n');
  const raw=await aiText(prompt,aiStatus().wonderModel);
  const m=raw.match(/\{[\s\S]*\}/);
  if(!m) throw new Error('AI không trả về JSON góp ý hợp lệ.');
  return validateAiFeedback(JSON.parse(m[0]),scenes.map((s:any)=>({title:s.title,summary:s.summary})),adaptationNotes);
}
export async function aiImage(prompt:string,style:string){if(!KEY())throw new Error('Chưa cấu hình khóa API phía server — hãy tải ảnh lên thủ công.');const full=`${prompt}. Phong cách: ${style==='watercolor'?'màu nước ướt-trên-ướt Waldorf, mềm, ấm':style==='crayon'?'sáp màu, nét tay ấm':'bút chì màu, nhẹ nhàng'}. Minh họa chuẩn bị cho giáo viên, phù hợp văn hóa Việt Nam, không chữ trong tranh.`;const j:any=await call('/images/generations',{method:'POST',body:JSON.stringify({model:aiStatus().imageModel,prompt:full})});const d=j.data?.[0]; if(d?.b64_json) return `data:image/png;base64,${d.b64_json}`; if(d?.url) return d.url as string; throw new Error('API ảnh không trả dữ liệu ảnh.');}
export function buildTranscribeForm(buf:Buffer,model:string){ const form=new FormData(); const req={mode:'DIARIZATION',model,audioEncoding:'WAV',languageBias:['Vietnamese']}; form.append('request',JSON.stringify(req)); form.append('audio',new Blob([new Uint8Array(buf)],{type:'audio/wav'}),'audio.wav'); return form; }
export function parseTranscribeResponse(j:any){ return {text:j.transcript||j.text||'',transcript:j.transcript||j.text||'',audioDurationMs:j.audioDurationMs??null,turns:Array.isArray(j.turns)?j.turns:[]}; }
export async function aiTranscribe(filePath:string,_mime?:string){if(!KEY())throw new Error('Chưa cấu hình khóa API phía server — hãy nhập transcript thủ công.');const buf=fs.readFileSync(filePath); if(!isWav(buf)) throw new Error('Voice Transcribe yêu cầu WAV mono PCM 16-bit 16kHz/24kHz. Hãy ghi bằng nút ghi trong app (tự chuyển WAV) hoặc tải file .wav.'); const form=buildTranscribeForm(buf,aiStatus().transcribeModel); const c=new AbortController();const t=setTimeout(()=>c.abort(),90000);try{const r=await fetch(BASE()+aiStatus().transcribePath,{method:'POST',body:form,signal:c.signal,headers:{'Authorization':`Bearer ${KEY()}`}});const txt=await r.text();if(!r.ok)throw new Error(redact(`Transcribe ${r.status}: ${txt.slice(0,400)}`));return parseTranscribeResponse(JSON.parse(txt));}finally{clearTimeout(t);}}
export function cliBrief(prompt:string):Promise<string>{return new Promise((resolve,reject)=>{if(process.env.XUVI_CLI_BRIDGE!=='1')return reject(new Error('CLI bridge chưa bật (XUVI_CLI_BRIDGE=1).')); const dir=fs.mkdtempSync(path.join(os.tmpdir(),'xuvi-cli-')); const pf=path.join(dir,'prompt.txt'); fs.writeFileSync(pf,prompt.slice(0,8000)); const args=['exec','--preset','empty','--disable-shell','--disable-write','--disable-web-tools','--disable-reminders','--disable-request-user-input','--no-foreign-personal-context','--no-session-log','--prompt-file',pf]; const localMuse=path.join(os.homedir(),'.local','bin','muse'); const bin=process.env.MUSE_BIN||(fs.existsSync(localMuse)?localMuse:'muse'); const env={...process.env,PATH:`${path.join(os.homedir(),'.local','bin')}:/opt/homebrew/bin:/usr/local/bin:${process.env.PATH||''}`}; const p=spawn(bin,args,{cwd:dir,env,timeout:60000});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('error',()=>{try{fs.rmSync(dir,{recursive:true,force:true})}catch{};reject(new Error('Không tìm thấy Muse CLI trên server.'));});p.on('close',code=>{try{fs.rmSync(dir,{recursive:true,force:true})}catch{}; code===0?resolve(out.trim()):reject(new Error(redact('CLI lỗi: '+(err||out).slice(0,300))));});});}
