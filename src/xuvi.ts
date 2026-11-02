// XuVi Story core: upload/extract, audience + age gating (D5/U9),
// AI-proposed then parent-edited story map (A11).
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Pool } from "pg";
import { promisify } from "node:util";
import { draftProse } from "./ai.js";
import { logAudit } from "./auth.js";
import type { AppEnv } from "./env.js";

const execFileAsync = promisify(execFile);

export const ALLOWED_EXTS = [".txt", ".md", ".markdown", ".html", ".htm", ".pdf", ".docx"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function storageDir(): string {
  const dir = join(process.cwd(), "uploads");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

// --- Age gating (D5/U9 criteria, shown to reviewer before lock-in) ---------
// A chapter is flagged when it contains violence/death/dark-societal motifs.
// Flagged chapters require an explicit parental acknowledgement naming the
// audience age before they may enter practice. Word lists are deliberately
// narrow (Vietnamese folktale register); misses are the parent's call, which
// is why acknowledgement — not silent filtering — is the mechanism.
const FLAG_RULES: { flag: string; minAge: number; patterns: RegExp[] }[] = [
  { flag: "war", minAge: 9, patterns: [/chiến tranh/i, /giặc/i, /đánh trận/i, /xâm lược/i, /quân thù/i] },
  { flag: "death", minAge: 7, patterns: [/chết/i, /giết/i, /xác chết/i, /đám tang/i, /tử trận/i] },
  { flag: "dark", minAge: 9, patterns: [/bóng tối/i, /ma quỷ/i, /quỷ/i, /máu me/i, /kinh dị/i] },
  { flag: "grief", minAge: 6, patterns: [/khóc than/i, /tang thương/i, /mất mát/i] },
];

export type Sensitivity = { flags: string[]; minAge: number };

export function flagSensitive(text: string): Sensitivity {
  const flags = new Set<string>();
  let minAge = 0;
  for (const rule of FLAG_RULES) {
    if (rule.patterns.some((re) => re.test(text))) {
      flags.add(rule.flag);
      minAge = Math.max(minAge, rule.minAge);
    }
  }
  return { flags: [...flags], minAge };
}

// --- Upload extraction -----------------------------------------------------
export async function extractText(filePath: string): Promise<string> {
  const ext = "." + (filePath.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) throw new Error(`unsupported upload type: ${ext} (hỗ trợ .txt .md .html .pdf .docx)`);
  try {
    const { stdout } = await execFileAsync("uv", ["run", "--no-project", "--with", "pypdf", "--with", "python-docx", "python3", "scripts/extract_upload.py", filePath], {
      maxBuffer: MAX_UPLOAD_BYTES,
      timeout: 120000,
    });
    const text = stdout.trim();
    if (!text) throw new Error("no extractable text in file");
    return text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/UNSUPPORTED/.test(msg)) throw new Error(msg.split("\n").find((l) => l.includes("UNSUPPORTED")) ?? msg);
    throw new Error(`text extraction failed: ${msg.slice(0, 200)}`);
  }
}

// Minimal single-file multipart parser (one file field + text fields).
export type ParsedUpload = { filename: string; data: Buffer; fields: Record<string, string> };

export function parseMultipart(contentType: string, body: Buffer): ParsedUpload {
  const m = /boundary=(.+)$/.exec(contentType);
  if (!m) throw new Error("missing multipart boundary");
  const boundary = "--" + m[1];
  const raw = body.toString("binary");
  const parts = raw.split(boundary).slice(1, -1);
  const fields: Record<string, string> = {};
  let file: { filename: string; data: Buffer } | null = null;
  for (const part of parts) {
    const headEnd = part.indexOf("\r\n\r\n");
    if (headEnd < 0) continue;
    const head = part.slice(0, headEnd);
    let content = part.slice(headEnd + 4);
    if (content.endsWith("\r\n")) content = content.slice(0, -2);
    const nameM = /name="([^"]+)"/.exec(head);
    const fileM = /filename="([^"]*)"/.exec(head);
    if (fileM && fileM[1]) {
      file = { filename: fileM[1], data: Buffer.from(content, "binary") };
    } else if (nameM) {
      fields[nameM[1]] = Buffer.from(content, "binary").toString("utf8");
    }
  }
  if (!file) throw new Error("no file part in upload");
  return { ...file, fields };
}

// --- Stories / audiences / story maps --------------------------------------
export function saveUpload(filename: string, data: Buffer): string {
  const safe = filename.replace(/[^a-zA-Z0-9À-ỹ_.-]/g, "_").slice(0, 120) || "upload";
  const stamped = `${Date.now()}-${safe}`;
  const full = join(storageDir(), stamped);
  writeFileSync(full, data);
  return full;
}
export async function createStory(
  pool: Pool,
  familyId: string,
  input: { title: string; text: string; language?: string; sourceFilename?: string; sourceRights?: string; usageRights?: string },
): Promise<{ id: string; sensitivity: Sensitivity }> {
  if (!input.title.trim()) throw new Error("title is required");
  if (input.text.trim().length < 50) throw new Error("story text too short (min 50 chars after extraction)");
  if (input.text.length > 500000) throw new Error("story text too long (max 500k chars; split long works into chapters)");
  const sensitivity = flagSensitive(input.text);
  const r = await pool.query(
    `INSERT INTO stories(family_id, title, source_filename, extracted_text, language, source_rights, usage_rights)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [familyId, input.title, input.sourceFilename ?? "", input.text, input.language ?? "vi", input.sourceRights ?? "", input.usageRights ?? ""],
  );
  await logAudit(pool, familyId, "story.create", "local", "text");
  return { id: r.rows[0].id as string, sensitivity };
}

export async function createAudience(
  pool: Pool,
  familyId: string,
  storyId: string,
  input: { age: string; language?: string; context?: string; practiceGoal?: string },
): Promise<{ id: string }> {
  const own = await pool.query("SELECT id FROM stories WHERE id = $1 AND family_id = $2", [storyId, familyId]);
  if (own.rows.length === 0) throw new Error("story not found");
  if (!input.age.trim()) throw new Error("audience age is required");
  const r = await pool.query("INSERT INTO audiences(story_id, age, language, context, practice_goal) VALUES ($1,$2,$3,$4,$5) RETURNING id", [
    storyId,
    input.age,
    input.language ?? "vi",
    input.context ?? "",
    input.practiceGoal ?? "",
  ]);
  await logAudit(pool, familyId, "audience.create");
  return { id: r.rows[0].id as string };
}

export type StoryMapContent = { chapters: unknown[]; characters: unknown[]; essential_details: unknown[] };

function stubStoryMap(text: string): StoryMapContent {
  // Deterministic paragraph chunker for stub mode (honestly labelled, no AI
  // claim): split on blank lines, first 12 chunks become scenes.
  const chunks = text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean).slice(0, 12);
  return {
    chapters: [{ index: 0, title: "Toàn truyện", scenes: chunks.map((c, i) => ({ index: i, summary: c.slice(0, 160) })) }],
    characters: [],
    essential_details: chunks.slice(0, 5).map((c) => c.slice(0, 120)),
  };
}

export async function proposeStoryMap(pool: Pool, env: AppEnv, familyId: string, audienceId: string): Promise<{ id: string; provider: string }> {
  const found = await pool.query(
    "SELECT a.*, s.extracted_text FROM audiences a JOIN stories s ON s.id = a.story_id WHERE a.id = $1 AND s.family_id = $2",
    [audienceId, familyId],
  );
  if (found.rows.length === 0) throw new Error("audience not found");
  const storyText = found.rows[0].extracted_text as string;
  let content: StoryMapContent;
  let provider = "stub";
  if (env.META_API_KEY || env.LLM_FALLBACK_API_KEY) {
    const { text, provider: p } = await draftProse(pool, env, familyId, {
      kind: "feedback",
      language: found.rows[0].language as string,
      context: `Chia câu chuyện sau thành các cảnh dễ nhớ (giữ sự kiện, quan hệ, chi tiết thiết yếu; không yêu cầu thuộc từng chữ). Trả về JSON {"chapters":[],"characters":[],"essential_details":[]} và không gì khác.\n\n${storyText.slice(0, 6000)}`,
    });
    provider = p;
    try {
      const start = text.indexOf("{");
      const parsed = JSON.parse(text.slice(start, text.lastIndexOf("}") + 1)) as StoryMapContent;
      content = { chapters: parsed.chapters ?? [], characters: parsed.characters ?? [], essential_details: parsed.essential_details ?? [] };
    } catch {
      content = stubStoryMap(storyText);
      provider = "stub-fallback";
    }
  } else {
    content = stubStoryMap(storyText);
  }
  const r = await pool.query(
    "INSERT INTO story_maps(audience_id, chapters, characters, essential_details, status) VALUES ($1,$2::jsonb,$3::jsonb,$4::jsonb,'draft') RETURNING id",
    [audienceId, JSON.stringify(content.chapters), JSON.stringify(content.characters), JSON.stringify(content.essential_details)],
  );
  await logAudit(pool, familyId, "storymap.propose", provider, "text");
  return { id: r.rows[0].id as string, provider };
}

export async function editStoryMap(pool: Pool, familyId: string, mapId: string, content: StoryMapContent): Promise<void> {
  const own = await pool.query(
    "SELECT sm.id FROM story_maps sm JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE sm.id = $1 AND s.family_id = $2 AND sm.status = 'draft'",
    [mapId, familyId],
  );
  if (own.rows.length === 0) throw new Error("story map not found or already confirmed");
  if (!Array.isArray(content.chapters)) throw new Error("chapters must be an array");
  await pool.query("UPDATE story_maps SET chapters = $1::jsonb, characters = $2::jsonb, essential_details = $3::jsonb WHERE id = $4", [
    JSON.stringify(content.chapters ?? []),
    JSON.stringify(content.characters ?? []),
    JSON.stringify(content.essential_details ?? []),
    mapId,
  ]);
  await logAudit(pool, familyId, "storymap.edit");
}

export async function confirmStoryMap(pool: Pool, familyId: string, mapId: string): Promise<void> {
  const r = await pool.query(
    `UPDATE story_maps sm SET status = 'confirmed', confirmed_at = now() FROM audiences a JOIN stories s ON s.id = a.story_id
     WHERE sm.id = $1 AND sm.audience_id = a.id AND s.family_id = $2 AND sm.status = 'draft'`,
    [mapId, familyId],
  );
  if (r.rowCount === 0) throw new Error("story map not found or already confirmed");
  await logAudit(pool, familyId, "storymap.confirm");
}
