import { Client } from "pg";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { draftProse } from "./ai.js";
import { confirmAlignmentRow, createAlignmentRow, renderMatrix } from "./alignment.js";
import { authenticate, loginTeacher, logoutTeacher, logAudit, registerTeacher } from "./auth.js";
import { getEnv, getPool } from "./db.js";
import { createGradeProgram, createProgram, createYearPlan, lockProgram, updateProgram } from "./documents.js";
import { renderGradeDoc, renderJournalDoc, renderMatrixDoc, renderProgramDoc, renderTimetableDoc, renderYearPlanDoc } from "./export.js";
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
] as const;

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
      const status = /unauthorized|invalid credentials/.test(message) ? 401 : /Missing|invalid|too short|exists|unknown|required|locked|not found|over-allocates|positive|must be|after start/.test(message) ? 400 : 500;
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
