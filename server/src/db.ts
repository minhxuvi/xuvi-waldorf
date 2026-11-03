import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs'; import path from 'node:path';
try{ const ef=path.resolve(process.cwd(),'.env'); if(fs.existsSync(ef) && typeof (process as any).loadEnvFile==='function') (process as any).loadEnvFile(ef); }catch{}
export const DATA_DIR = process.env.XUVI_DATA_DIR || path.resolve(process.cwd(),'data');
export const FILES_DIR = path.join(DATA_DIR,'files');
fs.mkdirSync(FILES_DIR,{recursive:true});
export const db = new DatabaseSync(path.join(DATA_DIR,'xuvi.db'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
CREATE TABLE IF NOT EXISTS programs(id INTEGER PRIMARY KEY AUTOINCREMENT,level TEXT,title TEXT,philosophy TEXT,goals TEXT,qualities TEXT,areas TEXT,methods TEXT,hours TEXT,assessment TEXT,updatedAt TEXT);
CREATE TABLE IF NOT EXISTS grade_programs(id INTEGER PRIMARY KEY AUTOINCREMENT,gradeLevel TEXT,ageRange TEXT,title TEXT,overview TEXT,subjectsJson TEXT,milestonesJson TEXT,sourceRef TEXT);
CREATE TABLE IF NOT EXISTS sources(id INTEGER PRIMARY KEY AUTOINCREMENT,kind TEXT,title TEXT,path TEXT,pages INTEGER,sha TEXT,note TEXT,createdAt TEXT);
CREATE TABLE IF NOT EXISTS requirements(id INTEGER PRIMARY KEY AUTOINCREMENT,sourceId INTEGER,code TEXT,gradeLevel TEXT,subject TEXT,text TEXT,page INTEGER,createdAt TEXT,quote TEXT,reviewStatus TEXT DEFAULT 'can-duyet',interpretation TEXT);
CREATE TABLE IF NOT EXISTS mappings(id INTEGER PRIMARY KEY AUTOINCREMENT,requirementId INTEGER UNIQUE,content TEXT,hours TEXT,evidence TEXT,degree TEXT,note TEXT,updatedAt TEXT);
CREATE TABLE IF NOT EXISTS year_plans(id INTEGER PRIMARY KEY AUTOINCREMENT,year TEXT,startDate TEXT,endDate TEXT,weeks INTEGER,subjectsJson TEXT,themesJson TEXT,activitiesJson TEXT,assessmentJson TEXT,contingency TEXT);
CREATE TABLE IF NOT EXISTS timetable_entries(id INTEGER PRIMARY KEY AUTOINCREMENT,day INTEGER,start TEXT,end TEXT,title TEXT,teacher TEXT,objective TEXT,kind TEXT,actualMinutes INTEGER,gradeLevel TEXT,subject TEXT,requirementId INTEGER);
CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,birthYear INTEGER,className TEXT,note TEXT,illustrative INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS attendance(id INTEGER PRIMARY KEY AUTOINCREMENT,studentId INTEGER,date TEXT,status TEXT,note TEXT, UNIQUE(studentId,date));
CREATE TABLE IF NOT EXISTS journal_entries(id INTEGER PRIMARY KEY AUTOINCREMENT,date TEXT,content TEXT,assessment TEXT,assignment TEXT,note TEXT);
CREATE TABLE IF NOT EXISTS artifacts(id INTEGER PRIMARY KEY AUTOINCREMENT,studentId INTEGER,title TEXT,kind TEXT,date TEXT,note TEXT,filePath TEXT);
CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT,studentId INTEGER,period TEXT,summary TEXT,strengths TEXT,nextSteps TEXT,createdAt TEXT);
CREATE TABLE IF NOT EXISTS stories(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,sourceText TEXT,sourceInfo TEXT,rights TEXT,ageRange TEXT,language TEXT,context TEXT,goal TEXT,version INTEGER DEFAULT 1,createdAt TEXT,updatedAt TEXT);
CREATE TABLE IF NOT EXISTS scenes(id INTEGER PRIMARY KEY AUTOINCREMENT,storyId INTEGER,ord INTEGER,title TEXT,summary TEXT,keywords TEXT,imagePath TEXT,imageStyle TEXT,prompt TEXT,chapter TEXT,essentialDetails TEXT,connection TEXT);
CREATE TABLE IF NOT EXISTS characters(id INTEGER PRIMARY KEY AUTOINCREMENT,storyId INTEGER,name TEXT,details TEXT);
CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY AUTOINCREMENT,storyId INTEGER,mode TEXT,assistance TEXT,audioPath TEXT,transcript TEXT,storyVersion INTEGER,feedbackJson TEXT,createdAt TEXT,snapshotJson TEXT,adaptationNotes TEXT,style TEXT,audience TEXT);
CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,title TEXT,format TEXT,createdAt TEXT);
CREATE TABLE IF NOT EXISTS practice_days(id INTEGER PRIMARY KEY AUTOINCREMENT,storyId INTEGER,date TEXT,note TEXT, UNIQUE(storyId,date));
`);
function addCol(table:string,col:string,def:string){ const cols:any[]=db.prepare(`PRAGMA table_info(${table})`).all() as any[]; if(!cols.some(c=>c.name===col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`); }
addCol('requirements','quote','TEXT'); addCol('requirements','reviewStatus',"TEXT DEFAULT 'can-duyet'"); addCol('requirements','interpretation','TEXT');
addCol('timetable_entries','gradeLevel','TEXT'); addCol('timetable_entries','subject','TEXT'); addCol('timetable_entries','requirementId','INTEGER');
addCol('scenes','chapter','TEXT'); addCol('scenes','essentialDetails','TEXT'); addCol('scenes','connection','TEXT');
addCol('attempts','snapshotJson','TEXT'); addCol('attempts','adaptationNotes','TEXT'); addCol('attempts','style','TEXT'); addCol('attempts','audience','TEXT');
export const now=()=>new Date().toISOString();
export function redact(s:string){return String(s||'').replace(/(sk-[A-Za-z0-9_-]{8,})/g,'[REDACTED]').replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi,'$1[REDACTED]').replace(/(META_API_KEY=)[^\s]+/g,'$1[REDACTED]');}
export function overlaps(aS:string,aE:string,bS:string,bE:string){return aS<bE && bS<aE;}
export function minutesBetween(start:string,end:string){ if(!start||!end||!/^\d{2}:\d{2}$/.test(start)||!/^\d{2}:\d{2}$/.test(end)) return NaN; const [h1,m1]=start.split(':').map(Number);const [h2,m2]=end.split(':').map(Number);return (h2*60+m2)-(h1*60+m1);}
export function validTimeRange(start:string,end:string){ const m=minutesBetween(start,end); return Number.isFinite(m)&&m>0&&start>='08:00'&&end<='15:00'; }
export function isValidId(v:any){ const n=Number(v); return Number.isInteger(n)&&n>0; }
