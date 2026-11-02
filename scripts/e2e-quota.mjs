// E2E: per-family daily AI quota demonstrably stops over-limit jobs (429).
// Run: node scripts/e2e-quota.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3121";
const BASE = `http://localhost:${PORT}`;
const CHILD_ENV = { ...process.env, PORT, META_API_KEY: "", LLM_FALLBACK_API_KEY: "", AI_DAILY_QUOTA: "1" };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const child = spawn("npx", ["tsx", "src/server.ts"], { env: CHILD_ENV, stdio: ["ignore", "pipe", "pipe"] });
  try {
    let up = false;
    for (let i = 0; i < 30; i++) {
      await wait(500);
      try {
        const r = await fetch(`${BASE}/api/health`);
        if (r.ok) {
          up = true;
          break;
        }
      } catch {
        // not up yet
      }
    }
    if (!up) throw new Error("server did not boot");

    const email = `quota-${Date.now()}@example.vn`;
    const reg = await (await fetch(`${BASE}/api/teachers/register`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "mat-khau-qta-1", teacherName: "Quota Teacher" }),
    })).json();
    const H = { authorization: `Bearer ${reg.token}`, "content-type": "application/json" };

    const d1 = await fetch(`${BASE}/api/draft`, { method: "POST", headers: H, body: JSON.stringify({ kind: "program_philosophy", language: "vi", context: "x" }) });
    if (d1.status !== 200) throw new Error(`first draft should pass, got ${d1.status}`);
    const d2 = await fetch(`${BASE}/api/draft`, { method: "POST", headers: H, body: JSON.stringify({ kind: "program_philosophy", language: "vi", context: "x" }) });
    if (d2.status !== 429) throw new Error(`quota was not enforced (got ${d2.status})`);

    console.log("E2E PASS: quota-429 (1st draft 200, 2nd draft 429)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
