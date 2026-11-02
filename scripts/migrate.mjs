// Migration runner: applies db/migrations/*.sql in order, tracked in
// schema_migrations. Each file runs in its own transaction.
// Usage: node scripts/migrate.mjs  (needs DATABASE_URL)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");

function mask(url) {
  return url.replace(/:[^:@/]+@/, ":***@");
}

async function main() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  if (files.length === 0) throw new Error(`No migrations in ${dir}`);
  const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 15000 });
  await client.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
    const applied = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
    for (const f of files) {
      if (applied.has(f)) {
        console.log(`skip ${f} (already applied)`);
        continue;
      }
      const sql = await readFile(path.join(dir, f), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations(name) VALUES ($1)", [f]);
        await client.query("COMMIT");
        console.log(`applied ${f}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
    console.log(`migrate OK against ${mask(databaseUrl)}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("MIGRATE FAIL", err.message);
  process.exit(1);
});
