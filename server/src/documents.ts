import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, PageOrientation, ShadingType } from 'docx';
import { db } from './db.js';
import { escapeMd } from './lib.js';
const H=(t:string)=>new Paragraph({text:t,heading:HeadingLevel.HEADING_1,spacing:{before:240,after:120}});
const P=(t:string)=>new Paragraph({children:[new TextRun(String(t??''))],spacing:{after:80}});
function colWidthsFor(cols:number):number[]{
  if(cols===8) return [11,11,16,16,16,8,11,11];
  if(cols===6) return [12,16,22,14,20,16];
  if(cols===5) return [20,12,16,32,20];
  if(cols===4) return [16,28,28,28];
  const eq=Math.floor(100/Math.max(1,cols));
  return Array.from({length:cols},(_,i)=>i===cols-1?100-eq*(cols-1):eq);
}
const T=(rows:string[][])=>{
  const cols=rows[0]?.length||1;
  const widths=colWidthsFor(cols);
  return new Table({
    width:{size:100,type:WidthType.PERCENTAGE},
    rows:rows.map((r,i)=>new TableRow({
      tableHeader:i===0,
      cantSplit:true,
      children:r.map((c,ci)=>new TableCell({
        width:{size:widths[ci]||Math.floor(100/cols),type:WidthType.PERCENTAGE},
        shading:i===0?{type:ShadingType.CLEAR,color:'auto',fill:'F7ECD8'}:undefined,
        margins:{top:80,bottom:80,left:100,right:100},
        children:[new Paragraph({children:[new TextRun({text:String(c??''),bold:i===0})]})]
      }))
    }))
  });
};
function parseJson(v:any,fb:any){ try{return v?JSON.parse(v):fb;}catch{return fb;} }
const A=(v:any)=>Array.isArray(v)?v:(v?[String(v)]:[]);
function fmtDate(s?:string){
  if(!s) return '—';
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){ const [y,m,d]=s.split('-'); return `${d}/${m}/${y} (${s})`; }
  const dt=new Date(s);
  if(Number.isNaN(dt.getTime())) return String(s);
  return dt.toLocaleString('vi-VN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
}
const degLabel=(d?:string)=>d==='chat-che'?'Chặt chẽ':d==='tuong-dong'?'Tương đồng':d==='mot-phan'?'Một phần':'Chưa đối chiếu';
const revLabel=(r?:string)=>r==='da-duyet'?'Đã duyệt':r==='can-sua'?'Cần sửa trích dẫn':'Cần duyệt';
const attLabel=(s?:string)=>s==='co-mat'?'Có mặt':s==='vang'?'Vắng':s==='di-muon'?'Đi muộn':(s||'—');
const modeLabel=(m?:string)=>m==='prompt'?'Có tranh gợi ý':m==='fading'?'Mờ dần gợi ý':m==='free'?'Kể tự do':(m||'—');
const assistLabel=(a?:string)=>a==='none'?'Không hỗ trợ chữ':a==='keywords'?'Chỉ từ khóa':a==='text'?'Nhìn văn bản':(a||'—');
function subjLines(subjects:any[]):string{ return subjects.map((s:any)=>`- Môn/khối: ${s.subject||''} | Chủ đề: ${s.topic||''} | Thời lượng: ${s.hours||''}\n  Mục tiêu: ${A(s.objectives).join('; ')}\n  Kết quả mong đợi: ${A(s.outcomes).join('; ')}\n  Nội dung: ${A(s.content).join('; ')}\n  Phương pháp: ${A(s.methods).join('; ')}\n  Học liệu: ${A(s.materials).join('; ')}`).join('\n'); }
export interface DocContent{title:string,version:string,generatedAt:string,context:string,sections:{h:string,body:string}[],tables:{h:string,rows:string[][]}[]}
export function docContent(type:string,filter:{gradeId?:number,gradeLevel?:string,day?:number,studentId?:number}={}):DocContent{
  const prog:any=db.prepare('SELECT * FROM programs ORDER BY id LIMIT 1').get()||{};
  const grades:any[]=db.prepare('SELECT * FROM grade_programs ORDER BY id').all() as any[];
  const reqsAll:any[]=db.prepare('SELECT r.*,m.content,m.hours,m.evidence,m.degree FROM requirements r LEFT JOIN mappings m ON m.requirementId=r.id ORDER BY r.id').all() as any[];
  const year:any=db.prepare('SELECT * FROM year_plans ORDER BY id DESC LIMIT 1').get()||{};
  const tt:any[]=db.prepare('SELECT * FROM timetable_entries ORDER BY day,start').all() as any[];
  const studentsAll:any[]=db.prepare('SELECT * FROM students').all() as any[];
  const journal:any[]=db.prepare('SELECT * FROM journal_entries ORDER BY date').all() as any[];
  const attendanceAll:any[]=db.prepare('SELECT a.*,s.name FROM attendance a LEFT JOIN students s ON s.id=a.studentId ORDER BY a.date').all() as any[];
  const artifactsAll:any[]=db.prepare('SELECT a.*,s.name FROM artifacts a LEFT JOIN students s ON s.id=a.studentId ORDER BY a.date').all() as any[];
  const reportsAll:any[]=db.prepare('SELECT r.*,s.name FROM reports r LEFT JOIN students s ON s.id=r.studentId ORDER BY r.id').all() as any[];
  const attempts:any[]=db.prepare('SELECT a.*,s.title FROM attempts a LEFT JOIN stories s ON s.id=a.storyId ORDER BY a.id').all() as any[];
  const gradesFiltered=(filter.gradeId||filter.gradeLevel)?grades.filter(g=>(!filter.gradeId||g.id===filter.gradeId)&&(!filter.gradeLevel||g.gradeLevel===filter.gradeLevel)):grades;
  const reqs=reqsAll;
  const students=filter.studentId?studentsAll.filter(s=>s.id===filter.studentId):studentsAll;
  const attendance=filter.studentId?attendanceAll.filter(a=>a.studentId===filter.studentId):attendanceAll;
  const artifacts=filter.studentId?artifactsAll.filter(a=>a.studentId===filter.studentId):artifactsAll;
  const reports=filter.studentId?reportsAll.filter(r=>r.studentId===filter.studentId):reportsAll;
  const genTime=new Date().toLocaleString('vi-VN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
  const meta={version:'XuVi 1.0',generatedAt:genTime,context:`Sinh từ dữ liệu hiện hành lúc ${genTime}. Chương trình: ${prog.title||'—'}; Năm học: ${year.year||'—'}; Lớp/tuổi trong hồ sơ: ${gradesFiltered.length}${filter.gradeId||filter.gradeLevel?' (đã lọc theo lớp đã chọn)':''}${filter.studentId?`; Học sinh lọc: ${students[0]?.name||filter.studentId}`:''}; Yêu cầu GDPT đã nhập: ${reqs.length}.`};
  const base={...meta,sections:[] as any[],tables:[] as any[]};
  if(type==='1')return{title:'Chương trình giáo dục tổng thể',...base,sections:[{h:'Triết lý giáo dục',body:prog.philosophy||''},{h:'Mục tiêu giáo dục',body:prog.goals||''},{h:'Phẩm chất & năng lực cần phát triển',body:prog.qualities||''},{h:'Lĩnh vực học tập',body:prog.areas||''},{h:'Phương pháp dạy học',body:prog.methods||''},{h:'Thời lượng / khung giờ học',body:prog.hours||''},{h:'Nguyên tắc đánh giá',body:prog.assessment||''}],tables:[{h:'Chương trình theo lớp/tuổi',rows:[['Lớp/tuổi','Độ tuổi','Chủ đề','Tổng quan','Nguồn'],...gradesFiltered.map(g=>[g.gradeLevel,g.ageRange,g.title,g.overview,g.sourceRef])]}]};
  if(type==='2'){ const sections=gradesFiltered.map(g=>{const subs=parseJson(g.subjectsJson,[]); return {h:`${g.gradeLevel} (${g.ageRange||''}) — ${g.title||''}`,body:`Tổng quan: ${g.overview||''}\n${Array.isArray(subs)?subjLines(subs):String(subs)}\nMốc phát triển: ${A(parseJson(g.milestonesJson,[])).join('; ')}\nNguồn: ${g.sourceRef||''}`};}); const tables=gradesFiltered.flatMap(g=>{const subs=parseJson(g.subjectsJson,[]); if(!Array.isArray(subs)||!subs.length)return[]; return [{h:`Môn học — ${g.gradeLevel}`,rows:[['Môn/khối','Chủ đề','Mục tiêu','Kết quả mong đợi','Nội dung','Thời lượng','Phương pháp','Học liệu'],...subs.map((s:any)=>[s.subject||'',s.topic||'',A(s.objectives).join('; '),A(s.outcomes).join('; '),A(s.content).join('; '),String(s.hours||''),A(s.methods).join('; '),A(s.materials).join('; ')])]}];}); return{title:'Chương trình chi tiết theo lớp/tuổi',...base,sections,tables}; }
  if(type==='3')return{title:'Ma trận đối chiếu GDPT 2018',...base,sections:[{h:'Nguyên tắc & trạng thái',body:`Tổng yêu cầu đã nhập: ${reqs.length}. Đã đối chiếu: ${reqs.filter(r=>r.degree&&r.degree!=='chua-doi-chieu').length}. Chưa đối chiếu: ${reqs.filter(r=>!r.degree||r.degree==='chua-doi-chieu').length}. Trạng thái duyệt: ${reqs.filter((r:any)=>r.reviewStatus==='da-duyet').length} đã duyệt, ${reqs.filter((r:any)=>r.reviewStatus!=='da-duyet').length} cần duyệt. Tài liệu này không phải chứng nhận đạt chuẩn chính thức.`}],tables:[{h:'Ma trận đối chiếu',rows:[['Mã nội bộ','Yêu cầu cần đạt (trích dẫn nguồn)','Trang nguồn','Nội dung tương ứng','Thời lượng','Minh chứng / phương pháp kiểm chứng','Mức độ đối chiếu','Trạng thái duyệt'],...reqs.map(r=>[r.code||'',r.quote||r.text||'',String(r.page||'—'),r.content||'',r.hours||'',r.evidence||'',degLabel(r.degree),revLabel(r.reviewStatus)])]}]};
  if(type==='4'){
    const subs=A(parseJson(year.subjectsJson,[]));
    const themes=A(parseJson(year.themesJson,[]));
    const acts=A(parseJson(year.activitiesJson,[]));
    const assess=A(parseJson(year.assessmentJson,[]));
    const subLines=subs.map((s:any)=>typeof s==='string'?`- ${s}`:`- ${s.subject||'Môn'}: ${s.distribution||'—'} (${s.hours||'—'})`).join('\n')||'Chưa cập nhật.';
    const themeLines=themes.map((t:any)=>typeof t==='string'?`- ${t}`:`- ${t.month||'Tháng'}: ${t.theme||'—'}`).join('\n')||'Chưa cập nhật.';
    const actLines=acts.map((a:any)=>typeof a==='string'?`- ${a}`:`- ${a.activity||'Hoạt động'} (${a.timing||'—'})`).join('\n')||'Chưa cập nhật.';
    const assessLines=assess.map((a:any)=>typeof a==='string'?`- ${a}`:`- ${a.period||'Kỳ'}: ${a.timing||'—'}`).join('\n')||'Chưa cập nhật.';
    return{title:'Kế hoạch giáo dục năm học',...base,
      sections:[
        {h:'Mốc năm học',body:`Năm học: ${year.year||''}\nBắt đầu: ${fmtDate(year.startDate)} → Kết thúc: ${fmtDate(year.endDate)}\nSố tuần học: ${year.weeks||''}`},
        {h:'Phân phối môn học',body:subLines},
        {h:'Chủ đề / block theo tháng',body:themeLines},
        {h:'Hoạt động trải nghiệm',body:actLines},
        {h:'Lịch đánh giá',body:assessLines},
        {h:'Kế hoạch dự phòng',body:year.contingency||''}
      ],
      tables:[
        {h:'Bảng phân phối môn học',rows:[['Môn học','Cách phân phối','Thời lượng'],...subs.map((s:any)=>[s.subject||String(s),s.distribution||'',s.hours||''])]},
        {h:'Chủ đề / block & hoạt động trải nghiệm',rows:[['Mốc thời gian','Chủ đề / Hoạt động','Phân loại'],...themes.map((t:any)=>[t.month||'',t.theme||String(t),'Block / Chủ đề tháng']),...acts.map((a:any)=>[a.timing||'',a.activity||String(a),'Hoạt động trải nghiệm'])]},
        {h:'Liên kết chương trình – năm – tuần',rows:[['Lớp/tuổi','Chủ đề năm','Nguồn chương trình'],...gradesFiltered.map(g=>[g.gradeLevel,g.title||'',g.sourceRef||''])]}
      ]};
  }
  if(type==='5'){const days=['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6']; const selDay=filter.day!==undefined&&filter.day>=0&&filter.day<=4?filter.day:Math.min((new Date().getDay()+6)%7,4); const hoc=tt.filter(e=>e.kind==='hoc').length; const sinh=tt.filter(e=>e.kind!=='hoc').length; return{title:'Thời khóa biểu & kế hoạch tuần',...base,sections:[{h:'Khung giờ & quy ước',body:`Thứ Hai–Sáu, 08:00–15:00 (2100 phút/tuần khi đủ khung). Tổng số tiết học: ${hoc}; sinh hoạt & nhịp ngày: ${sinh}. Phân biệt rõ Giờ học và Sinh hoạt; thời lượng thực tế ghi ở từng tiết.`},{h:`Thẻ dạy gọn — ${days[selDay]} (in được)`,body:tt.filter(e=>e.day===selDay).map(e=>`${e.start}–${e.end}: ${e.title} — Mục tiêu: ${e.objective||''} · Người phụ trách: ${e.teacher||''} · Loại: ${e.kind==='hoc'?'Giờ học':'Sinh hoạt'} · Thực tế: ${e.actualMinutes??'—'} phút`).join('\n')||'Chưa có tiết cho ngày đã chọn.'}],tables:[{h:'Lịch tuần chi tiết (Thứ 2 – Thứ 6, 08:00–15:00)',rows:[['Ngày','Giờ','Nội dung buổi học','Người phụ trách','Mục tiêu','Loại','Thời lượng thực tế (phút)','Lớp/môn liên kết'],...tt.map(e=>[days[e.day]||'',`${e.start}–${e.end}`,e.title,e.teacher||'',e.objective||'',e.kind==='hoc'?'Giờ học':e.kind==='sinh-hoat'?'Sinh hoạt':(e.kind||''),String(e.actualMinutes??''),[e.gradeLevel,e.subject].filter(Boolean).join(' / ')])]}]}; }
  // type 6
  return{title:'Nhật ký giảng dạy & hồ sơ đánh giá học sinh',...base,
    sections:[...journal.map(j=>({h:`Nhật ký ${fmtDate(j.date)}`,body:`Nội dung đã dạy: ${j.content||''}\nĐánh giá buổi học: ${j.assessment||''}\nNhiệm vụ: ${j.assignment||''}\nGhi chú tiến bộ: ${j.note||''}`})),
      {h:'Tiến bộ & luyện kể (minh chứng chuẩn bị của giáo viên)',body:attempts.length?attempts.map(a=>`${fmtDate(a.createdAt)} — ${a.title||'Truyện'}: chế độ ${modeLabel(a.mode)}, hỗ trợ ${assistLabel(a.assistance)}, phiên bản đã đóng băng v${a.storyVersion}`).join('\n'):'Chưa có lượt luyện kể nào được ghi.'}],
    tables:[
      {h:'Danh sách học sinh',rows:[['Họ tên','Năm sinh','Lớp','Ghi chú','Loại dữ liệu'],...students.map(s=>[s.name,String(s.birthYear??''),s.className||'',s.note||'',s.illustrative?'Dữ liệu minh họa':'Dữ liệu thật do giáo viên nhập'])]},
      {h:'Điểm danh',rows:[['Ngày','Học sinh','Trạng thái','Ghi chú'],...attendance.map(a=>[fmtDate(a.date),a.name||String(a.studentId),attLabel(a.status),a.note||''])]},
      {h:'Kết quả đánh giá & nhiệm vụ (từ nhật ký)',rows:[['Ngày','Nội dung','Đánh giá','Nhiệm vụ'],...journal.map(j=>[fmtDate(j.date),j.content||'',j.assessment||'',j.assignment||''])]},
      {h:'Sản phẩm học tập (minh chứng)',rows:[['Ngày','Học sinh','Sản phẩm','Loại','Ghi chú','Tệp minh chứng'],...artifacts.map(a=>[fmtDate(a.date),a.name||String(a.studentId),a.title||'',a.kind||'',a.note||'',a.filePath||''])]},
      {h:'Báo cáo theo kỳ cho từng học sinh',rows:[['Học sinh','Kỳ','Tóm tắt tiến bộ','Điểm mạnh','Bước tiếp theo','Ngày tạo'],...reports.map(r=>[r.name||String(r.studentId),r.period||'',r.summary||'',r.strengths||'',r.nextSteps||'',fmtDate(r.createdAt)])]},
      {h:'Ghi chú tiến bộ theo lượt luyện',rows:[['Thời điểm','Truyện','Chế độ luyện','Hỗ trợ chữ','Phiên bản đóng băng'],...attempts.map(a=>[fmtDate(a.createdAt),a.title||'',modeLabel(a.mode),assistLabel(a.assistance),String(a.storyVersion??'')])]}
    ]};
}
export function toMd(c:DocContent){let m=`# ${escapeMd(c.title)}\n\n> Phiên bản: ${c.version} · Sinh lúc: ${c.generatedAt} · ${c.context}\n\n`;for(const s of c.sections)m+=`## ${escapeMd(s.h)}\n\n${s.body}\n\n`;for(const t of c.tables){m+=`## ${escapeMd(t.h)}\n\n`; if(!t.rows.length){m+='_(Chưa có dữ liệu)_\n\n';continue;} t.rows.forEach((r,i)=>{m+=`| ${r.map(escapeMd).join(' | ')} |\n`; if(i===0)m+=`| ${r.map(()=>'---').join(' | ')} |\n`;}); m+='\n';}return m;}
export async function toDocx(c:DocContent){const children:any[]=[new Paragraph({text:c.title,heading:HeadingLevel.TITLE,spacing:{after:120}}),P(`Phiên bản: ${c.version} · Sinh lúc: ${c.generatedAt}`),P(c.context)];for(const s of c.sections){children.push(H(s.h));for(const line of String(s.body).split('\n'))children.push(P(line));}for(const t of c.tables){children.push(H(t.h));children.push(T(t.rows.length?t.rows:[['(Chưa có dữ liệu)']]));} return Packer.toBuffer(new Document({sections:[{properties:{page:{size:{orientation:(c.tables.some(tb=>tb.rows[0]?.length>=5)?PageOrientation.LANDSCAPE:PageOrientation.PORTRAIT)}}},children}]}));}
export function toPrintHtml(c:DocContent){const esc=(s:string)=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');const wide=c.tables.some(tb=>tb.rows[0]?.length>=5);return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(c.title)}</title><style>@page{size:A4 ${wide?'landscape':'portrait'};margin:12mm}body{font-family:Georgia,"Times New Roman",serif;color:#243324;max-width:${wide?'1120px':'900px'};margin:24px auto;padding:0 18px;line-height:1.5}h1{color:#1e4028;margin-bottom:6px}h2{color:#2f5d3a;margin-top:20px;margin-bottom:8px;page-break-after:avoid}.meta{background:#fdf8ee;border:1px solid #e7dcc4;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:16px}table{border-collapse:collapse;width:100%;page-break-inside:auto;margin-bottom:16px;table-layout:auto}tr{page-break-inside:avoid;break-inside:avoid}thead{display:table-header-group}td,th{border:1px solid #cbb;padding:7px 9px;font-size:12.5px;vertical-align:top;text-align:left}th{background:#f7ecd8;color:#1e4028;font-weight:700}.toolbar{display:flex;gap:10px;margin-bottom:16px}button{font:inherit;cursor:pointer;border:1px solid #2f5d3a;background:#2f5d3a;color:#fff;padding:7px 14px;border-radius:8px}@media print{.toolbar{display:none}body{margin:0;padding:0;max-width:none}}</style></head><body><div class="toolbar"><button onclick="window.print()">In / Lưu PDF</button></div><h1>${esc(c.title)}</h1><div class="meta"><b>Phiên bản:</b> ${esc(c.version)} · <b>Sinh lúc:</b> ${esc(c.generatedAt)}<br>${esc(c.context)}</div>${c.sections.map(s=>`<h2>${esc(s.h)}</h2><p>${esc(s.body).replace(/\n/g,'<br>')}</p>`).join('')}${c.tables.map(t=>`<h2>${esc(t.h)}</h2><table><thead><tr>${(t.rows[0]||[]).map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.slice(1).map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('')}</body></html>`;}
