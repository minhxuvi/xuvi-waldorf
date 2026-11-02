// E2E: document generate -> edit -> lock (Docs 1/2/4).
// Run: node scripts/e2e-docs.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3113";
const BASE = `http://localhost:${PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function main() {
  const child = spawn("npx", ["tsx", "src/server.ts"], {
    env: { ...process.env, PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
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

    const email = `docs-${Date.now()}@example.vn`;
    const reg = await api("/api/teachers/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "mat-khau-docs-1", teacherName: "Docs Teacher" }),
    });
    if (reg.status !== 201) throw new Error(`register failed: ${JSON.stringify(reg)}`);
    const auth = { headers: { authorization: `Bearer ${reg.body.token}` } };

    // Unknown config values are rejected (no silent merge, D1-D4).
    const bad = await api("/api/programs", {
      method: "POST",
      body: JSON.stringify({ config: { rhythm: "waldorf-40" } }),
      ...auth,
    });
    if (bad.status !== 400) throw new Error("unknown rhythm was not rejected");

    const prog = await api("/api/programs", {
      method: "POST",
      body: JSON.stringify({
        philosophy: "Waldorf tại nhà",
        goals: "Phát triển toàn diện",
        config: { corpus: "classical", rhythm: "waldorf-36-4", languageTiming: "oral-until-4", examPrecedence: "per-band" },
        provenance: { corpus: "classical", file: "01-Waldorf-co-dien-lop-1-12.md" },
      }),
      ...auth,
    });
    if (prog.status !== 201) throw new Error(`program create failed: ${JSON.stringify(prog)}`);
    const pid = prog.body.id;

    const grade = await api(`/api/programs/${pid}/grades`, {
      method: "POST",
      body: JSON.stringify({ grade: "Lớp 1", objectives: "Truyện cổ tích", allocatedHours: { unit: "block_weeks", value: 5 } }),
      ...auth,
    });
    if (grade.status !== 201) throw new Error("grade create failed");

    const plan = await api(`/api/programs/${pid}/year-plans`, {
      method: "POST",
      body: JSON.stringify({ yearLabel: "2026-2027", weeksTotal: 36, festivalWeeks: 4, rhythmProvenance: "classical tmp/01 (36+4)" }),
      ...auth,
    });
    if (plan.status !== 201) throw new Error("year plan create failed");

    // Draft prose (stub-labelled in this env) then edit then lock.
    const draft = await api("/api/draft", {
      method: "POST",
      body: JSON.stringify({ kind: "program_philosophy", language: "vi", context: "triết lý Waldorf lớp 1" }),
      ...auth,
    });
    if (draft.status !== 200 || typeof draft.body.text !== "string") throw new Error("draft failed");

    const edit = await api(`/api/programs/${pid}`, {
      method: "PATCH",
      body: JSON.stringify({ philosophy: draft.body.text.slice(0, 200) }),
      ...auth,
    });
    if (edit.status !== 200) throw new Error("edit failed");

    const lock = await api(`/api/programs/${pid}/lock`, { method: "POST", ...auth });
    if (lock.status !== 200) throw new Error("lock failed");

    const editLocked = await api(`/api/programs/${pid}`, {
      method: "PATCH",
      body: JSON.stringify({ philosophy: "sửa sau khóa" }),
      ...auth,
    });
    if (editLocked.status === 200) throw new Error("locked program was editable");

    const audit = await api("/api/audit", auth);
    const actions = audit.body.map((r) => r.action);
    for (const need of ["program.create", "program.update", "program.lock", "ai.draft.program_philosophy"]) {
      if (!actions.includes(need)) throw new Error(`audit missing ${need}`);
    }

    console.log("E2E PASS: doc-generate-edit-lock");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
