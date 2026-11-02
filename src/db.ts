import { Pool } from "pg";
import { loadEnv, type AppEnv } from "./env.js";

let pool: Pool | null = null;
let envCache: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (!envCache) envCache = loadEnv();
  return envCache;
}

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getEnv().DATABASE_URL, max: 5 });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
