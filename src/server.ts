import { Client } from "pg";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { authenticate, loginTeacher, logoutTeacher, logAudit, registerTeacher } from "./auth.js";
import { getPool } from "./db.js";
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
      sendJson(res, 404, { error: "not-found" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "internal";
      const status = /unauthorized|invalid credentials/.test(message) ? 401 : /Missing|invalid|too short|exists/.test(message) ? 400 : 500;
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
