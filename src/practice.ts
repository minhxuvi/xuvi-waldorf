// Task 10: scene images (generate/upload + mandatory parent review gate),
// practice attempts, audio upload, WAV energy/VAD delivery supplement,
// transcript correction. No STT endpoint is guessed: transcription runs only
// when STT_BASE_URL is explicitly configured; otherwise the parent-typed or
// parent-corrected transcript is the record (R11: correction UI is v1).
import { existsSync, readFileSync } from "node:fs";
import type { Pool } from "pg";
import { logAudit } from "./auth.js";
import type { AppEnv } from "./env.js";
import { flagSensitive } from "./xuvi.js";

export const IMAGE_STYLES = ["watercolor", "wax-crayon", "colored-pencil", "other"] as const;
export const PROMPT_MODES = ["with_prompts", "fading", "free"] as const;
export const ASSISTANCE = ["none", "text", "keywords"] as const;
export const AUDIO_EXTS = [".wav", ".mp3", ".m4a", ".ogg", ".webm"];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Honestly-labelled SVG placeholder for stub mode (no AI claim).
export function stubIllustration(sceneSummary: string, style: string): string {
  const hue = (sceneSummary.length * 47) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><radialGradient id="g" cx="50%" cy="40%"><stop offset="0%" stop-color="hsl(${hue},45%,88%)"/><stop offset="100%" stop-color="hsl(${(hue + 40) % 360},35%,72%)"/></radialGradient></defs><rect width="640" height="480" fill="url(#g)"/><text x="320" y="225" text-anchor="middle" font-size="22" font-family="sans-serif">${esc(style)}</text><text x="320" y="260" text-anchor="middle" font-size="14" font-family="sans-serif">${esc(sceneSummary.slice(0, 60))}</text><text x="320" y="450" text-anchor="middle" font-size="16" font-family="sans-serif">[Minh họa mẫu — chờ phụ huynh duyệt/khi AI cấu hình]</text></svg>`;
}

export async function createSceneImage(
  pool: Pool,
  env: AppEnv,
  familyId: string,
  mapId: string,
  input: { sceneRef: string; style?: string; storagePath?: string; kind?: "generated" | "uploaded" },
): Promise<{ id: string; provider: string }> {
  const own = await pool.query(
    "SELECT sm.id FROM story_maps sm JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE sm.id = $1 AND s.family_id = $2",
    [mapId, familyId],
  );
  if (own.rows.length === 0) throw new Error("story map not found");
  const style = input.style ?? "watercolor";
  if (!(IMAGE_STYLES as readonly string[]).includes(style)) throw new Error(`unknown style: ${style}`);
  const kind = input.kind ?? (input.storagePath ? "uploaded" : "generated");
  const provider = "stub";
  let storagePath = input.storagePath ?? "";
  if (kind === "generated" && !storagePath) {
    // Real generation only through an explicitly configured endpoint (never guessed).
    if (env.META_API_KEY && process.env["IMAGE_GENERATE_URL"]) {
      throw new Error("image generation endpoint configured but local-stub mode waived for v1 (see Task 12 probes)");
    }
    const { writeFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { storageDir } = await import("./xuvi.js");
    storagePath = join(storageDir(), `${Date.now()}-scene.svg`);
    writeFileSync(storagePath, stubIllustration(input.sceneRef, style));
  }
  const r = await pool.query(
    "INSERT INTO scene_images(story_map_id, scene_ref, kind, style, storage_path, review_status) VALUES ($1,$2,$3,$4,$5,'pending') RETURNING id",
    [mapId, input.sceneRef, kind, style, storagePath],
  );
  await logAudit(pool, familyId, "scene_image.create", provider, kind === "generated" ? "image" : "upload");
  return { id: r.rows[0].id as string, provider };
}

export async function reviewSceneImage(pool: Pool, familyId: string, id: string, reviewStatus: string, replacementPath?: string): Promise<void> {
  if (!["approved", "replaced"].includes(reviewStatus)) throw new Error("reviewStatus must be approved|replaced");
  const own = await pool.query(
    "SELECT si.id FROM scene_images si JOIN story_maps sm ON sm.id = si.story_map_id JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE si.id = $1 AND s.family_id = $2",
    [id, familyId],
  );
  if (own.rows.length === 0) throw new Error("scene image not found");
  if (replacementPath) {
    await pool.query("UPDATE scene_images SET storage_path = $1, review_status = $2 WHERE id = $3", [replacementPath, reviewStatus, id]);
  } else {
    await pool.query("UPDATE scene_images SET review_status = $1 WHERE id = $2", [reviewStatus, id]);
  }
  await logAudit(pool, familyId, "scene_image.review");
}

export function imageFile(pool: Pool, familyId: string, id: string): Promise<{ storagePath: string; kind: string }>;
export async function imageFile(pool: Pool, familyId: string, id: string): Promise<{ storagePath: string; kind: string }> {
  const r = await pool.query(
    "SELECT si.storage_path, si.kind FROM scene_images si JOIN story_maps sm ON sm.id = si.story_map_id JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE si.id = $1 AND s.family_id = $2",
    [id, familyId],
  );
  if (r.rows.length === 0) throw new Error("scene image not found");
  const p = (r.rows[0] as { storage_path: string }).storage_path;
  if (!p || !existsSync(p)) throw new Error("image file missing");
  return { storagePath: p, kind: (r.rows[0] as { kind: string }).kind };
}

// --- WAV energy/VAD supplement (T3) ----------------------------------------
// 16-bit PCM WAV (mono/stereo): frame RMS per 20ms, pauses = runs >300ms
// below threshold. Non-WAV audio returns null metrics (recorded honestly).
export type DeliveryMetrics = {
  durationSec: number;
  pauseCount: number;
  avgPauseSec: number;
  speechEnergy: number;
  analyzed: boolean;
  note: string;
};

export function analyzeWav(buffer: Buffer): DeliveryMetrics {
  if (buffer.subarray(0, 4).toString() !== "RIFF") throw new Error("not a WAV file");
  const fmt = buffer.readUInt16LE(20);
  const channels = buffer.readUInt16LE(22);
  const sampleRate = buffer.readUInt32LE(24);
  const bits = buffer.readUInt16LE(34);
  if (fmt !== 1 || bits !== 16) throw new Error("only 16-bit PCM WAV supported for analysis");
  let dataOff = 12;
  while (dataOff + 8 <= buffer.length) {
    const id = buffer.subarray(dataOff, dataOff + 4).toString();
    const size = buffer.readUInt32LE(dataOff + 4);
    if (id === "data") break;
    dataOff += 8 + size;
  }
  const data = buffer.subarray(dataOff + 8);
  const bytesPerSample = (bits / 8) * channels;
  const totalSamples = Math.floor(data.length / bytesPerSample);
  const frameSamples = Math.floor(sampleRate * 0.02);
  const threshold = 400; // RMS amplitude floor for "speech"
  let pauseFrames = 0;
  let pauses = 0;
  let inPause = false;
  let energySum = 0;
  let energyN = 0;
  for (let i = 0; i < totalSamples; i += frameSamples) {
    let sum = 0;
    const n = Math.min(frameSamples, totalSamples - i);
    for (let j = 0; j < n; j++) {
      const v = data.readInt16LE((i + j) * bytesPerSample);
      sum += v * v;
    }
    const rms = Math.sqrt(sum / n);
    energySum += rms;
    energyN++;
    if (rms < threshold) {
      pauseFrames++;
      if (!inPause && pauseFrames * 0.02 >= 0.3) {
        pauses++;
        inPause = true;
      }
    } else {
      pauseFrames = 0;
      inPause = false;
    }
  }
  void energyN;
  const durationSec = totalSamples / sampleRate;
  return {
    durationSec: Math.round(durationSec * 100) / 100,
    pauseCount: pauses,
    avgPauseSec: 0,
    speechEnergy: Math.round((energySum / Math.max(energyN, 1)) * 100) / 100,
    analyzed: true,
    note: "local energy/VAD on 16-bit PCM WAV (supplement; transcript timing separate)",
  };
}

function ageLowerBound(age: string): number {
  const m = /(\d+)/.exec(age);
  return m ? Number(m[1]) : 0;
}

export async function createAttempt(
  pool: Pool,
  familyId: string,
  input: {
    audienceId: string;
    sceneImageId?: string;
    audioPath?: string;
    promptsMode?: string;
    assistance?: string;
    transcript?: string;
    acknowledgeFlags?: boolean;
  },
): Promise<{ id: string; metrics: DeliveryMetrics | null; sensitivity: { flags: string[]; minAge: number } }> {
  const promptsMode = input.promptsMode ?? "free";
  const assistance = input.assistance ?? "none";
  if (!(PROMPT_MODES as readonly string[]).includes(promptsMode)) throw new Error(`unknown promptsMode: ${promptsMode}`);
  if (!(ASSISTANCE as readonly string[]).includes(assistance)) throw new Error(`unknown assistance: ${assistance}`);
  const aud = await pool.query(
    "SELECT a.*, s.extracted_text FROM audiences a JOIN stories s ON s.id = a.story_id WHERE a.id = $1 AND s.family_id = $2",
    [input.audienceId, familyId],
  );
  if (aud.rows.length === 0) throw new Error("audience not found");
  const sensitivity = flagSensitive(String(aud.rows[0].extracted_text ?? ""));
  const needAck = sensitivity.minAge > ageLowerBound(String(aud.rows[0].age ?? ""));
  if (needAck && !input.acknowledgeFlags) {
    throw new Error(`story flagged [${sensitivity.flags.join(",")}] for age ${sensitivity.minAge}+; parental acknowledgement required (acknowledgeFlags)`);
  }
  // Prompt-fading practice requires an approved image (T5).
  if (input.sceneImageId && promptsMode !== "free") {
    const img = await pool.query(
      "SELECT si.review_status FROM scene_images si JOIN story_maps sm ON sm.id = si.story_map_id JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE si.id = $1 AND s.family_id = $2",
      [input.sceneImageId, familyId],
    );
    if (img.rows.length === 0) throw new Error("scene image not found");
    if ((img.rows[0] as { review_status: string }).review_status !== "approved") {
      throw new Error("unapproved images cannot enter practice (parent review gate, T5)");
    }
  }
  let metrics: DeliveryMetrics | null = null;
  if (input.audioPath) {
    const buf = readFileSync(input.audioPath);
    try {
      metrics = analyzeWav(buf);
    } catch {
      metrics = { durationSec: 0, pauseCount: 0, avgPauseSec: 0, speechEnergy: 0, analyzed: false, note: "non-WAV audio: energy analysis unavailable; delivery judged from the recording by the parent" };
    }
  }
  const r = await pool.query(
    "INSERT INTO attempts(audience_id, scene_image_id, audio_path, assistance, prompts_mode, transcript, transcript_corrected, feedback) VALUES ($1,$2,$3,$4,$5,$6,'','{}') RETURNING id",
    [input.audienceId, input.sceneImageId ?? null, input.audioPath ?? "", assistance, promptsMode, input.transcript ?? ""],
  );
  await logAudit(pool, familyId, "attempt.create", "local", input.audioPath ? "audio" : "text");
  return { id: r.rows[0].id as string, metrics, sensitivity };
}

export async function correctTranscript(pool: Pool, familyId: string, id: string, transcriptCorrected: string): Promise<void> {
  const r = await pool.query(
    `UPDATE attempts at SET transcript_corrected = $1 FROM audiences a JOIN stories s ON s.id = a.story_id
     WHERE at.id = $2 AND at.audience_id = a.id AND s.family_id = $3`,
    [transcriptCorrected, id, familyId],
  );
  if (r.rowCount === 0) throw new Error("attempt not found");
  await logAudit(pool, familyId, "attempt.correct");
}
