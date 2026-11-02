import { Client } from "pg";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { draftProse } from "./ai.js";
import { confirmAlignmentRow, createAlignmentRow, renderMatrix } from "./alignment.js";
import { authenticate, loginTeacher, logoutTeacher, logAudit, registerTeacher } from "./auth.js";
import { getEnv, getPool } from "./db.js";
import { createGradeProgram, createProgram, createYearPlan, lockProgram, updateProgram } from "./documents.js";
import { renderGradeDoc, renderJournalDoc, renderMatrixDoc, renderProgramDoc, renderTimetableDoc, renderYearPlanDoc } from "./export.js";
import { confirmStoryMap, createAudience, createStory, editStoryMap, extractText, flagSensitive, parseMultipart, proposeStoryMap, saveUpload } from "./xuvi.js";
import { AUDIO_EXTS, correctTranscript, createAttempt, createSceneImage, imageFile, reviewSceneImage } from "./practice.js";
import { buildFeedback } from "./feedback.js";
import { appendJournalEntry, buildReportDraft, createChildProfile, createReport, listJournal, signOffReport } from "./journal.js";
import { htmlToPdf } from "./pdf.js";
import { createSlots, renderWeek } from "./timetable.js";
import { loadEnv, type AppEnv } from "./env.js";
import { t } from "./i18n.js";
import { deleteFamily, exportFamily } from "./privacy.js";

// Single source of truth for the API surface. Tests assert this table
// contains no child-login or child-facing routes (T10).
export const ROUTES = [
  "GET /",
  "GET /api/health",
  "POST /api/teachers/register",
  "POST /api/teachers/login",
  "POST /api/teachers/logout",
  "GET /api/export",
  "DELETE /api/account",
  "GET /api/audit",
  "POST /api/programs",
  "PATCH /api/programs/:id",
  "POST /api/programs/:id/lock",
  "POST /api/programs/:id/grades",
  "POST /api/programs/:id/year-plans",
  "POST /api/draft",
  "POST /api/grades/:id/alignments",
  "PATCH /api/alignments/:id/confirm",
  "GET /api/grades/:id/matrix",
  "POST /api/year-plans/:id/slots",
  "GET /api/year-plans/:id/timetable",
  "GET /api/moet/search",
  "POST /api/children",
  "GET /api/children",
  "POST /api/children/:id/journal",
  "GET /api/children/:id/journal",
  "GET /api/children/:id/report-draft",
  "POST /api/children/:id/reports",
  "POST /api/reports/:id/signoff",
  "GET /api/docs/:kind/:id",
  "POST /api/stories",
  "GET /api/stories",
  "GET /api/stories/:id",
  "POST /api/stories/:id/audiences",
  "POST /api/audiences/:id/story-map/propose",
  "GET /api/audiences/:id/story-map",
  "PUT /api/story-maps/:id",
  "POST /api/story-maps/:id/confirm",
  "POST /api/story-maps/:mapId/images",
  "PATCH /api/images/:id",
  "GET /api/images/:id/file",
  "POST /api/attempts",
  "PATCH /api/attempts/:id",
  "GET /api/audiences/:id/attempts",
  "POST /api/attempts/:id/feedback",
] as const;

function readRaw(req: IncomingMessage, limit = 11 * 1024 * 1024): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 1_000_000) reject(new Error("body too large"));
    });
    req.on("end", () => {
      try {
        resolve(body ? (JSON.parse(body) as Record<string, unknown>) : {});
      } catch {
        reject(new Error("invalid json"));
      }
    });
  });
}

function bearer(req: IncomingMessage): string | null {
  const h = req.headers.authorization;
  return h?.startsWith("Bearer ") ? h.slice(7) : null;
}

export type HealthStatus = {
  ok: boolean;
  db: "up" | "down" | "not-configured";
  storage: "local-stub" | "s3";
  ai: { llm: "meta" | "fallback" | "none"; image: "meta" | "fallback" | "stub"; stt: "meta" | "fallback" | "stub" };
};

export async function checkDb(databaseUrl: string, timeoutMs = 2000): Promise<boolean> {
  const client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: timeoutMs });
  try {
    await client.connect();
    await client.query("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
}

export function buildHealth(env: AppEnv, db: HealthStatus["db"]): HealthStatus {
  return {
    ok: db !== "down",
    db,
    storage: env.S3_BUCKET ? "s3" : "local-stub",
    ai: {
      llm: env.META_API_KEY ? "meta" : env.LLM_FALLBACK_API_KEY ? "fallback" : "none",
      image: env.META_API_KEY ? "meta" : env.IMAGE_FALLBACK_API_KEY ? "fallback" : "stub",
      stt: env.META_API_KEY ? "meta" : env.STT_FALLBACK_API_KEY ? "fallback" : "stub",
    },
  };
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

export function createApp(env: AppEnv, dbCheck: (url: string) => Promise<boolean> = checkDb) {
  const pool = getPool();
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const route = `${req.method} ${req.url?.split("?")[0]}`;
    try {
      if (route === "GET /api/health") {
        // Never leak secrets: report only up/down and capability modes.
        const db: HealthStatus["db"] = (await dbCheck(env.DATABASE_URL)) ? "up" : "down";
        sendJson(res, 200, { ...buildHealth(env, db), message: t("vi", "health.ok") });
        return;
      }
      if (route === "GET /" || route === "GET /index.html") {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${t("vi", "app.name")}</title></head><body><h1>${t("vi", "app.name")}</h1><p>${t("vi", "health.ok")}: <a href="/api/health">/api/health</a></p></body></html>`);
        return;
      }
      if (route === "POST /api/teachers/register") {
        const body = await readJson(req);
        const { teacher, token } = await registerTeacher(pool, String(body["email"] ?? ""), String(body["password"] ?? ""), String(body["teacherName"] ?? ""));
        sendJson(res, 201, { teacher, token });
        return;
      }
      if (route === "POST /api/teachers/login") {
        const body = await readJson(req);
        const { teacher, token } = await loginTeacher(pool, String(body["email"] ?? ""), String(body["password"] ?? ""));
        sendJson(res, 200, { teacher, token });
        return;
      }
      const token = bearer(req);
      const me = token ? await authenticate(pool, token) : null;
      if (!me) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      if (route === "POST /api/teachers/logout") {
        if (token) await logoutTeacher(pool, token);
        sendJson(res, 200, { ok: true });
        return;
      }
      if (route === "GET /api/export") {
        await logAudit(pool, me.family_id, "family.export");
        sendJson(res, 200, await exportFamily(pool, me.family_id));
        return;
      }
      if (route === "GET /api/audit") {
        const rows = await pool.query("SELECT id, action, provider, payload_type, created_at FROM audit_log WHERE family_id = $1 ORDER BY created_at", [me.family_id]);
        sendJson(res, 200, rows.rows);
        return;
      }
      if (route === "DELETE /api/account") {
        await deleteFamily(pool, me.family_id);
        sendJson(res, 200, { ok: true });
        return;
      }
      if (route === "POST /api/programs") {
        const body = await readJson(req);
        sendJson(res, 201, await createProgram(pool, me.family_id, {
          philosophy: body["philosophy"] as string | undefined,
          goals: body["goals"] as string | undefined,
          config: body["config"] as never,
          provenance: body["provenance"] as never,
        }));
        return;
      }
      const progMatch = /^(\w+) \/api\/programs\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (progMatch) {
        const [, method, id, rest] = progMatch;
        if (method === "PATCH" && !rest) {
          const body = await readJson(req);
          await updateProgram(pool, me.family_id, id, body as never);
          sendJson(res, 200, { ok: true });
          return;
        }
        if (method === "POST" && rest === "/lock") {
          await lockProgram(pool, me.family_id, id);
          sendJson(res, 200, { ok: true });
          return;
        }
        if (method === "POST" && rest === "/grades") {
          const body = await readJson(req);
          sendJson(res, 201, await createGradeProgram(pool, me.family_id, id, {
            grade: String(body["grade"] ?? ""),
            subjects: body["subjects"],
            objectives: body["objectives"] as string | undefined,
            content: body["content"] as string | undefined,
            allocatedHours: body["allocatedHours"],
            provenance: body["provenance"] as never,
          }));
          return;
        }
        if (method === "POST" && rest === "/year-plans") {
          const body = await readJson(req);
          sendJson(res, 201, await createYearPlan(pool, me.family_id, id, {
            yearLabel: String(body["yearLabel"] ?? ""),
            weeksTotal: Number(body["weeksTotal"]),
            festivalWeeks: body["festivalWeeks"] as number | undefined,
            monthlyThemes: body["monthlyThemes"],
            activities: body["activities"] as string | undefined,
            contingency: body["contingency"] as string | undefined,
            rhythmProvenance: body["rhythmProvenance"] as string | undefined,
          }));
          return;
        }
      }
      const gradeMatch = /^(GET|POST) \/api\/grades\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (gradeMatch) {
        const [, method, id, rest] = gradeMatch;
        if (method === "POST" && rest === "/alignments") {
          const body = await readJson(req);
          sendJson(res, 201, await createAlignmentRow(pool, me.family_id, id, {
            internalId: String(body["internalId"] ?? ""),
            moetSubject: String(body["moetSubject"] ?? ""),
            moetGrade: String(body["moetGrade"] ?? ""),
            moetLevel: body["moetLevel"] as string | undefined,
            moetStrand: body["moetStrand"] as string | undefined,
            moetTopic: body["moetTopic"] as string | undefined,
            yeuCauCanDatVerbatim: String(body["yeuCauCanDatVerbatim"] ?? ""),
            pairedNoiDung: body["pairedNoiDung"] as string | undefined,
            sourceLocator: body["sourceLocator"] as never,
            homeschoolContent: body["homeschoolContent"] as string | undefined,
            officialHours: body["officialHours"] as never,
            allocatedHours: body["allocatedHours"] as never,
            verification: body["verification"] as string | undefined,
            degree: body["degree"] as string | undefined,
            deferredRoadmap: body["deferredRoadmap"] as string | undefined,
          }));
          return;
        }
        if (method === "GET" && rest === "/matrix") {
          sendJson(res, 200, await renderMatrix(pool, me.family_id, id));
          return;
        }
      }
      const alignMatch = /^PATCH \/api\/alignments\/([^/]+)\/confirm$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (alignMatch) {
        await confirmAlignmentRow(pool, me.family_id, alignMatch[1]);
        sendJson(res, 200, { ok: true });
        return;
      }
      const planMatch = /^(GET|POST) \/api\/year-plans\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (planMatch) {
        const [, method, id, rest] = planMatch;
        if (method === "POST" && rest === "/slots") {
          const body = await readJson(req);
          sendJson(res, 201, await createSlots(pool, me.family_id, id, Number(body["week"]), Number(body["day"]), (body["slots"] ?? []) as never));
          return;
        }
        if (method === "GET" && rest?.startsWith("/timetable")) {
          const u = new URL(req.url ?? "", "http://x");
          sendJson(res, 200, await renderWeek(pool, me.family_id, id, Number(u.searchParams.get("week") ?? 1)));
          return;
        }
      }
      if (route === "GET /api/moet/search") {
        const u = new URL(req.url ?? "", "http://x");
        const subject = u.searchParams.get("subject") ?? "";
        const grade = u.searchParams.get("grade") ?? "";
        const q = u.searchParams.get("q") ?? "";
        const rows = await pool.query(
          `SELECT internal_id, subject, grade, level, yeu_cau_can_dat_verbatim, source_locator
           FROM moet_outcomes
           WHERE ($1 = '' OR subject = $1) AND ($2 = '' OR grade = $2)
             AND ($3 = '' OR yeu_cau_can_dat_verbatim ILIKE '%' || $3 || '%')
           ORDER BY subject, grade, internal_id LIMIT 50`,
          [subject, grade, q],
        );
        sendJson(res, 200, rows.rows);
        return;
      }
      if (route === "POST /api/children") {
        const body = await readJson(req);
        sendJson(res, 201, await createChildProfile(pool, me.family_id, {
          displayName: String(body["displayName"] ?? ""),
          ageBand: String(body["ageBand"] ?? ""),
          grade: String(body["grade"] ?? ""),
          language: body["language"] as string | undefined,
          needs: body["needs"] as string | undefined,
        }));
        return;
      }
      if (route === "GET /api/children") {
        const rows = await pool.query("SELECT id, display_name, age_band, grade, language, needs, created_at FROM child_profiles WHERE family_id = $1 ORDER BY created_at", [me.family_id]);
        sendJson(res, 200, rows.rows);
        return;
      }
      const childMatch = /^(GET|POST) \/api\/children\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (childMatch) {
        const [, method, id, rest] = childMatch;
        if (method === "POST" && rest === "/journal") {
          const body = await readJson(req);
          sendJson(res, 201, await appendJournalEntry(pool, me.family_id, id, {
            entryDate: String(body["entryDate"] ?? ""),
            contentDelivered: body["contentDelivered"] as string | undefined,
            attendance: body["attendance"] as string | undefined,
            assessmentNotes: body["assessmentNotes"] as string | undefined,
            assignments: body["assignments"] as string | undefined,
            artifactRefs: body["artifactRefs"],
            progressNotes: body["progressNotes"] as string | undefined,
          }));
          return;
        }
        if (method === "GET" && rest === "/journal") {
          sendJson(res, 200, await listJournal(pool, me.family_id, id));
          return;
        }
        if (method === "GET" && rest === "/report-draft") {
          const u = new URL(req.url ?? "", "http://x");
          sendJson(res, 200, await buildReportDraft(pool, me.family_id, id, u.searchParams.get("period") ?? ""));
          return;
        }
        if (method === "POST" && rest === "/reports") {
          const body = await readJson(req);
          sendJson(res, 201, await createReport(pool, me.family_id, id, String(body["periodLabel"] ?? ""), String(body["narrative"] ?? "")));
          return;
        }
      }
      if (route === "POST /api/stories") {
        const contentType = req.headers["content-type"] ?? "";
        if (contentType.includes("multipart/form-data")) {
          const parsed = parseMultipart(contentType, await readRaw(req));
          const saved = saveUpload(parsed.filename, parsed.data);
          let text: string;
          try {
            text = await extractText(saved);
          } catch (err) {
            const { rmSync } = await import("node:fs");
            rmSync(saved, { force: true });
            throw err;
          }
          const { id, sensitivity } = await createStory(pool, me.family_id, {
            title: parsed.fields["title"]?.trim() || parsed.filename.replace(/\.[^.]+$/, ""),
            text,
            language: parsed.fields["language"] || "vi",
            sourceFilename: parsed.filename,
            sourceRights: parsed.fields["sourceRights"] ?? "",
            usageRights: parsed.fields["usageRights"] ?? "",
          });
          sendJson(res, 201, { id, sensitivity });
          return;
        }
        const body = await readJson(req);
        const { id, sensitivity } = await createStory(pool, me.family_id, {
          title: String(body["title"] ?? ""),
          text: String(body["text"] ?? ""),
          language: (body["language"] as string | undefined) ?? "vi",
          sourceRights: body["sourceRights"] as string | undefined,
          usageRights: body["usageRights"] as string | undefined,
        });
        sendJson(res, 201, { id, sensitivity });
        return;
      }
      if (route === "GET /api/stories") {
        const rows = await pool.query("SELECT id, title, language, created_at FROM stories WHERE family_id = $1 ORDER BY created_at DESC", [me.family_id]);
        sendJson(res, 200, rows.rows);
        return;
      }
      const storyMatch = /^(GET|POST) \/api\/stories\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (storyMatch) {
        const [, method, id, rest] = storyMatch;
        if (method === "GET" && !rest) {
          const found = await pool.query("SELECT id, title, source_filename, extracted_text, language, source_rights, usage_rights, created_at FROM stories WHERE id = $1 AND family_id = $2", [id, me.family_id]);
          if (found.rows.length === 0) {
            sendJson(res, 404, { error: "not-found" });
            return;
          }
          const row = found.rows[0] as Record<string, unknown>;
          sendJson(res, 200, { ...row, sensitivity: flagSensitive(String(row["extracted_text"] ?? "")) });
          return;
        }
        if (method === "POST" && rest === "/audiences") {
          const body = await readJson(req);
          sendJson(res, 201, await createAudience(pool, me.family_id, id, {
            age: String(body["age"] ?? ""),
            language: (body["language"] as string | undefined) ?? "vi",
            context: body["context"] as string | undefined,
            practiceGoal: body["practiceGoal"] as string | undefined,
          }));
          return;
        }
      }
      const audMatch = /^(GET|POST) \/api\/audiences\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (audMatch) {
        const [, method, id, rest] = audMatch;
        if (method === "POST" && rest === "/story-map/propose") {
          sendJson(res, 201, await proposeStoryMap(pool, getEnv(), me.family_id, id));
          return;
        }
        if (method === "GET" && rest === "/story-map") {
          const rows = await pool.query(
            "SELECT sm.* FROM story_maps sm JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE a.id = $1 AND s.family_id = $2 ORDER BY sm.id DESC LIMIT 1",
            [id, me.family_id],
          );
          if (rows.rows.length === 0) {
            sendJson(res, 404, { error: "not-found" });
            return;
          }
          sendJson(res, 200, rows.rows[0]);
          return;
        }
      }
      const mapMatch = /^(PUT|POST) \/api\/story-maps\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (mapMatch) {
        const [, method, id, rest] = mapMatch;
        if (method === "PUT" && !rest) {
          const body = await readJson(req);
          await editStoryMap(pool, me.family_id, id, {
            chapters: (body["chapters"] ?? []) as unknown[],
            characters: (body["characters"] ?? []) as unknown[],
            essential_details: (body["essential_details"] ?? []) as unknown[],
          });
          sendJson(res, 200, { ok: true });
          return;
        }
        if (method === "POST" && rest === "/confirm") {
          await confirmStoryMap(pool, me.family_id, id);
          sendJson(res, 200, { ok: true });
          return;
        }
      }
      const imgCreate = /^POST \/api\/story-maps\/([^/]+)\/images$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (imgCreate) {
        const mapId = imgCreate[1];
        const contentType = req.headers["content-type"] ?? "";
        if (contentType.includes("multipart/form-data")) {
          const parsed = parseMultipart(contentType, await readRaw(req));
          const saved = saveUpload(parsed.filename, parsed.data);
          const { id, provider } = await createSceneImage(pool, getEnv(), me.family_id, mapId, {
            sceneRef: parsed.fields["sceneRef"] ?? parsed.filename,
            style: parsed.fields["style"],
            storagePath: saved,
            kind: "uploaded",
          });
          sendJson(res, 201, { id, provider });
          return;
        }
        const body = await readJson(req);
        const { id, provider } = await createSceneImage(pool, getEnv(), me.family_id, mapId, {
          sceneRef: String(body["sceneRef"] ?? ""),
          style: body["style"] as string | undefined,
          kind: "generated",
        });
        sendJson(res, 201, { id, provider });
        return;
      }
      const imgMatch = /^(PATCH|GET) \/api\/images\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (imgMatch) {
        const [, method, id, rest] = imgMatch;
        if (method === "PATCH" && !rest) {
          const body = await readJson(req);
          await reviewSceneImage(pool, me.family_id, id, String(body["reviewStatus"] ?? ""));
          sendJson(res, 200, { ok: true });
          return;
        }
        if (method === "GET" && rest === "/file") {
          const { storagePath } = await imageFile(pool, me.family_id, id);
          const { createReadStream, statSync } = await import("node:fs");
          const ext = "." + storagePath.split(".").pop()?.toLowerCase();
          const types: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
          res.writeHead(200, { "content-type": types[ext] ?? "application/octet-stream", "content-length": statSync(storagePath).size });
          createReadStream(storagePath).pipe(res);
          return;
        }
      }
      const attList = /^GET \/api\/audiences\/([^/]+)\/attempts$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (attList) {
        const u = new URL(req.url ?? "", "http://x");
        const pm = u.searchParams.get("promptsMode") ?? "";
        const as = u.searchParams.get("assistance") ?? "";
        const rows = await pool.query(
          `SELECT at.* FROM attempts at JOIN audiences a ON a.id = at.audience_id JOIN stories s ON s.id = a.story_id
           WHERE a.id = $1 AND s.family_id = $2 AND ($3 = '' OR at.prompts_mode = $3) AND ($4 = '' OR at.assistance = $4) ORDER BY at.created_at`,
          [attList[1], me.family_id, pm, as],
        );
        sendJson(res, 200, rows.rows);
        return;
      }
      if (route === "POST /api/attempts") {
        const contentType = req.headers["content-type"] ?? "";
        let fields: Record<string, string> = {};
        let audioPath = "";
        if (contentType.includes("multipart/form-data")) {
          const parsed = parseMultipart(contentType, await readRaw(req));
          fields = parsed.fields;
          if (parsed.filename) {
            const ext = "." + parsed.filename.split(".").pop()?.toLowerCase();
            if (!(AUDIO_EXTS as readonly string[]).includes(ext)) {
              sendJson(res, 400, { error: `unsupported audio type: ${ext}` });
              return;
            }
            audioPath = saveUpload(parsed.filename, parsed.data);
          }
        } else {
          const body = await readJson(req);
          for (const [k, v] of Object.entries(body)) fields[k] = String(v ?? "");
        }
        try {
          const { id, metrics, sensitivity } = await createAttempt(pool, me.family_id, {
            audienceId: fields["audienceId"] ?? "",
            sceneImageId: fields["sceneImageId"] || undefined,
            audioPath: audioPath || undefined,
            promptsMode: fields["promptsMode"],
            assistance: fields["assistance"],
            transcript: fields["transcript"],
            acknowledgeFlags: fields["acknowledgeFlags"] === "true",
          });
          sendJson(res, 201, { id, metrics, sensitivity });
        } catch (err) {
          if (audioPath) {
            const { rmSync } = await import("node:fs");
            rmSync(audioPath, { force: true });
          }
          throw err;
        }
        return;
      }
      const attMatch = /^(PATCH|POST) \/api\/attempts\/([^/]+)(\/.*)?$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (attMatch) {
        const [, method, id, rest] = attMatch;
        if (method === "PATCH" && !rest) {
          const body = await readJson(req);
          await correctTranscript(pool, me.family_id, id, String(body["transcriptCorrected"] ?? ""));
          sendJson(res, 200, { ok: true });
          return;
        }
        if (method === "POST" && rest === "/feedback") {
          sendJson(res, 200, await buildFeedback(pool, getEnv(), me.family_id, id));
          return;
        }
      }
      const docMatch = /^GET \/api\/docs\/([^/]+)\/([^/?]+)$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (docMatch) {
        const [, kind, id] = docMatch;
        const u = new URL(req.url ?? "", "http://x");
        const format = u.searchParams.get("format") ?? "pdf";
        let html: string;
        if (kind === "program") html = await renderProgramDoc(pool, me.family_id, id);
        else if (kind === "grade") html = await renderGradeDoc(pool, me.family_id, id);
        else if (kind === "matrix") html = await renderMatrixDoc(pool, me.family_id, id);
        else if (kind === "yearplan") html = await renderYearPlanDoc(pool, me.family_id, id);
        else if (kind === "timetable") html = await renderTimetableDoc(pool, me.family_id, id, Number(u.searchParams.get("week") ?? 1));
        else if (kind === "journal") html = await renderJournalDoc(pool, me.family_id, id);
        else {
          sendJson(res, 404, { error: "unknown document kind" });
          return;
        }
        if (format === "html") {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.end(html);
          return;
        }
        const pdf = await htmlToPdf(html);
        res.writeHead(200, { "content-type": "application/pdf", "content-length": pdf.length });
        res.end(pdf);
        return;
      }
      const signMatch = /^POST \/api\/reports\/([^/]+)\/signoff$/.exec(`${req.method} ${req.url?.split("?")[0]}`);
      if (signMatch) {
        const body = await readJson(req);
        await signOffReport(pool, me.family_id, signMatch[1], String(body["signoff"] ?? ""));
        sendJson(res, 200, { ok: true });
        return;
      }
      if (route === "POST /api/draft") {
        const body = await readJson(req);
        const kind = String(body["kind"] ?? "");
        if (!["program_philosophy", "grade_narrative", "year_plan", "feedback"].includes(kind)) {
          sendJson(res, 400, { error: "unknown draft kind" });
          return;
        }
        sendJson(res, 200, await draftProse(pool, getEnv(), me.family_id, {
          kind: kind as never,
          language: (body["language"] as string | undefined) ?? "vi",
          context: String(body["context"] ?? ""),
        }));
        return;
      }
      sendJson(res, 404, { error: "not-found" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "internal";
      if (/daily AI quota exceeded/.test(message)) {
        sendJson(res, 429, { error: message });
        return;
      }
      const status = /unauthorized|invalid credentials/.test(message) ? 401 : /Missing|invalid|too short|exists|unknown|required|locked|not found|over-allocates|positive|must be|after start|unsupported|too long|unapproved|acknowledgement/.test(message) ? 400 : 500;
      sendJson(res, status, { error: status === 500 ? "internal" : message });
    }
  });
}

// istanbul ignore next: entry point only
if (import.meta.url === `file://${process.argv[1]}`) {
  const env = loadEnv();
  const app = createApp(env);
  app.listen(env.PORT, () => {
    console.log(`XuVi Waldorf listening on ${env.APP_BASE_URL}`);
  });
}
