// Task 11: comparative feedback in fixed form (strengths +
// missing/altered + ONE next step + excerpts/timestamps), no score (T9).
// Two paths: LLM feedback when a key is present, deterministic stub
// heuristic otherwise (honestly labelled). Both write the same schema.
import type { Pool } from "pg";
import { draftProse } from "./ai.js";
import { logAudit } from "./auth.js";
import type { AppEnv } from "./env.js";
import { assertNoScore } from "./model/validation.js";

export type Feedback = {
  strengths: string[];
  missing_or_altered: string[];
  one_next_step: string;
  excerpts: { text: string; at_char: number }[];
  provider: string;
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9à-ỹ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stubFeedback(transcript: string, details: string[], sceneSummaries: string[]): Feedback {
  const t = norm(transcript);
  const strengths: string[] = [];
  const missing: string[] = [];
  const excerpts: Feedback["excerpts"] = [];
  const pool = [...details, ...sceneSummaries].filter((d) => norm(d).length >= 4).slice(0, 12);
  for (const d of pool) {
    const words = norm(d).split(" ").filter((w) => w.length > 3);
    if (words.length === 0) continue;
    const key = words.slice(0, 4).join(" ");
    const idx = t.indexOf(key);
    if (idx >= 0) {
      if (strengths.length < 3) strengths.push(`Giữ được chi tiết: “${d.slice(0, 80)}”`);
      if (excerpts.length < 3) {
        const at = transcript.toLowerCase().indexOf(words[0]);
        excerpts.push({ text: transcript.slice(Math.max(0, at - 20), at + 80), at_char: Math.max(0, at) });
      }
    } else if (missing.length < 5) {
      missing.push(d.slice(0, 100));
    }
  }
  if (strengths.length === 0) strengths.push("Đã hoàn thành một lượt kể lại — dũng cảm kể hết câu chuyện.");
  const one_next_step =
    missing.length > 0
      ? `Lần kể tới, thêm một chi tiết còn thiếu: “${missing[0].slice(0, 80)}”.`
      : "Lần kể tới, thử chậm lại ở đoạn cao trào và ngừng một nhịp trước khi kết thúc.";
  return { strengths, missing_or_altered: missing, one_next_step, excerpts, provider: "stub" };
}

export async function buildFeedback(pool: Pool, env: AppEnv, familyId: string, attemptId: string): Promise<Feedback> {
  const r = await pool.query(
    `SELECT at.*, a.age AS audience_age, a.language, s.extracted_text, sm.chapters, sm.characters, sm.essential_details
     FROM attempts at JOIN audiences a ON a.id = at.audience_id
     JOIN stories s ON s.id = a.story_id
     LEFT JOIN story_maps sm ON sm.audience_id = a.id AND sm.status = 'confirmed'
     WHERE at.id = $1 AND s.family_id = $2
     ORDER BY sm.id DESC LIMIT 1`,
    [attemptId, familyId],
  );
  // Fallback when no confirmed map exists yet.
  let row = r.rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    const r2 = await pool.query(
      `SELECT at.*, a.age AS audience_age, a.language, s.extracted_text, '[]'::jsonb AS chapters, '[]'::jsonb AS characters, '[]'::jsonb AS essential_details
       FROM attempts at JOIN audiences a ON a.id = at.audience_id JOIN stories s ON s.id = a.story_id
       WHERE at.id = $1 AND s.family_id = $2`,
      [attemptId, familyId],
    );
    if (r2.rows.length === 0) throw new Error("attempt not found");
    row = r2.rows[0] as Record<string, unknown>;
  }
  const transcript = String(row["transcript_corrected"] || row["transcript"] || "");
  const details = ((row["essential_details"] as unknown[]) ?? []).map(String);
  const chapters = ((row["chapters"] as { scenes?: { summary?: string }[] }[]) ?? []).flatMap((c) => (c.scenes ?? []).map((s) => String(s.summary ?? "")));
  let fb: Feedback;
  if ((env.META_API_KEY || env.LLM_FALLBACK_API_KEY) && transcript.trim().length >= 20) {
    const { text, provider } = await draftProse(pool, env, familyId, {
      kind: "feedback",
      language: String(row["language"] ?? "vi"),
      context: `Nhận xét lượt kể lại (không chấm điểm, không xếp hạng). Trả về JSON {"strengths":[],"missing_or_altered":[],"one_next_step":"","excerpts":[]}: điểm mạnh; chi tiết thiếu/bị đổi so với bản truyện; đúng MỘT bước tiếp theo; trích dẫn kèm vị trí.\nBản truyện: ${(String(row["extracted_text"] ?? "")).slice(0, 4000)}\nChi tiết thiết yếu: ${details.slice(0, 10).join(" | ")}\nLượt kể: ${transcript.slice(0, 4000)}`,
    });
    try {
      const start = text.indexOf("{");
      const p = JSON.parse(text.slice(start, text.lastIndexOf("}") + 1)) as Partial<Feedback>;
      fb = {
        strengths: (p.strengths ?? []).map(String).slice(0, 5),
        missing_or_altered: (p.missing_or_altered ?? []).map(String).slice(0, 8),
        one_next_step: String(p.one_next_step ?? "").slice(0, 300),
        excerpts: [],
        provider,
      };
    } catch {
      fb = { ...stubFeedback(transcript, details, chapters), provider: "stub-fallback" };
    }
  } else {
    fb = stubFeedback(transcript, details, chapters);
  }
  assertNoScore(fb);
  await pool.query("UPDATE attempts SET feedback = $1::jsonb WHERE id = $2", [JSON.stringify(fb), attemptId]);
  await logAudit(pool, familyId, "attempt.feedback", fb.provider, "text");
  return fb;
}
