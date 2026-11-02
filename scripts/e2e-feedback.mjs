// E2E: fixed-form feedback + labelled history grouping + no-score proof.
// Run: node scripts/e2e-feedback.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3119";
const BASE = `http://localhost:${PORT}`;
const CHILD_ENV = { ...process.env, PORT, META_API_KEY: "", LLM_FALLBACK_API_KEY: "" };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deepHasScore(v) {
  if (v !== null && typeof v === "object") {
    for (const [k, val] of Object.entries(v)) {
      if (/^(score|ranking|rank|grade_points)$/i.test(k)) return k;
      const inner = deepHasScore(val);
      if (inner) return inner;
    }
  }
  return null;
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

    const email = `fb-${Date.now()}@example.vn`;
    const reg = await (await fetch(`${BASE}/api/teachers/register`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "mat-khau-fbk-1", teacherName: "Feedback Teacher" }),
    })).json();
    const H = { authorization: `Bearer ${reg.token}` };
    const post = (p, b) => fetch(`${BASE}${p}`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(b) }).then((r) => r.json().then((j) => ({ status: r.status, body: j })));

    const story = await post("/api/stories", { title: "Diều", text: "Cậu bé thả diều trên đê cạnh rặng tre. ".repeat(20), language: "vi" });
    const aud = await post(`/api/stories/${story.body.id}/audiences`, { age: "6-7", language: "vi" });
    const prop = await fetch(`${BASE}/api/audiences/${aud.body.id}/story-map/propose`, { method: "POST", headers: H }).then((r) => r.json());
    // Parent edits the map with known details, then confirms.
    await fetch(`${BASE}/api/story-maps/${prop.id}`, {
      method: "PUT", headers: { ...H, "content-type": "application/json" },
      body: JSON.stringify({ chapters: [{ index: 0, scenes: [{ index: 0, summary: "Cậu bé thả diều trên đê" }] }], characters: [], essential_details: ["con diều", "rặng tre", "buổi chiều"] }),
    });
    await fetch(`${BASE}/api/story-maps/${prop.id}/confirm`, { method: "POST", headers: H });

    // Two attempts under different labelled conditions.
    const a1 = await post("/api/attempts", { audienceId: aud.body.id, promptsMode: "with_prompts", assistance: "keywords", transcript: "Cậu bé thả con diều trên đê vào buổi chiều." });
    const a2 = await post("/api/attempts", { audienceId: aud.body.id, promptsMode: "free", assistance: "none", transcript: "Có một cậu bé." });
    if (a1.status !== 201 || a2.status !== 201) throw new Error("attempts failed");

    const fb = await fetch(`${BASE}/api/attempts/${a1.body.id}/feedback`, { method: "POST", headers: H }).then((r) => r.json().then((j) => ({ status: r.status, body: j })));
    if (fb.status !== 200) throw new Error(`feedback failed: ${JSON.stringify(fb.body)}`);
    for (const k of ["strengths", "missing_or_altered", "one_next_step", "excerpts"]) {
      if (!(k in fb.body)) throw new Error(`feedback missing ${k}`);
    }
    if (typeof fb.body.one_next_step !== "string" || fb.body.one_next_step.length === 0) throw new Error("one_next_step must be exactly one non-empty step");
    const leak = deepHasScore(fb.body);
    if (leak) throw new Error(`score leaked in feedback: ${leak}`);

    // History groups by condition labels.
    const histFree = await fetch(`${BASE}/api/audiences/${aud.body.id}/attempts?promptsMode=free`, { headers: H }).then((r) => r.json());
    const histAll = await fetch(`${BASE}/api/audiences/${aud.body.id}/attempts`, { headers: H }).then((r) => r.json());
    if (histFree.length !== 1 || histAll.length !== 2) throw new Error("history grouping wrong");
    const leakHist = deepHasScore(histAll);
    if (leakHist) throw new Error(`score leaked in history: ${leakHist}`);

    console.log("E2E PASS: feedback-no-score (fixed form, labelled history)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
