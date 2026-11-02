import { Client } from "pg";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { loadEnv, type AppEnv } from "./env.js";
import { t } from "./i18n.js";

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
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/api/health") {
      // Never leak secrets: report only up/down and capability modes.
      const db: HealthStatus["db"] = (await dbCheck(env.DATABASE_URL)) ? "up" : "down";
      sendJson(res, 200, { ...buildHealth(env, db), message: t("vi", "health.ok") });
      return;
    }
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${t("vi", "app.name")}</title></head><body><h1>${t("vi", "app.name")}</h1><p>${t("vi", "health.ok")}: <a href="/api/health">/api/health</a></p></body></html>`);
      return;
    }
    sendJson(res, 404, { error: "not-found" });
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
