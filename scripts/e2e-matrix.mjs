// E2E: deterministic Doc 3 matrix + Doc 5 timetable (no LLM anywhere).
// Run: node scripts/e2e-matrix.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3114";
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

    const email = `matrix-${Date.now()}@example.vn`;
    const reg = await api("/api/teachers/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "mat-khau-mtx-1", teacherName: "Matrix Teacher" }),
    });
    if (reg.status !== 201) throw new Error("register failed");
    const H = { headers: { authorization: `Bearer ${reg.body.token}` } };

    // MOET reference lookup works (seed may still be backfilling; require >= 0).
    const search = await api("/api/moet/search?subject=NG%E1%BB%AE%20V%C4%82N&grade=L%E1%BB%9Bp%201", H);
    if (search.status !== 200 || !Array.isArray(search.body)) throw new Error("moet search failed");
    const verbatim = search.body.length > 0
      ? search.body[0].yeu_cau_can_dat_verbatim
      : "Tốc độ đọc khoảng 40–60 tiếng trong 1 phút.";

    const prog = await api("/api/programs", { method: "POST", body: JSON.stringify({ philosophy: "p", goals: "g" }), ...H });
    const grade = await api(`/api/programs/${prog.body.id}/grades`, {
      method: "POST",
      body: JSON.stringify({ grade: "Lớp 1" }),
      ...H,
    });
    const gid = grade.body.id;

    // Invented outcome text is rejected structurally? No — verbatim is parent
    // supplied; the gate is: only confirmed rows render. Empty verbatim rejected.
    const empty = await api(`/api/grades/${gid}/alignments`, {
      method: "POST",
      body: JSON.stringify({ internalId: "X-1", moetSubject: "NGỮ VĂN", moetGrade: "Lớp 1", yeuCauCanDatVerbatim: " " }),
      ...H,
    });
    if (empty.status !== 400) throw new Error("empty verbatim was not rejected");

    const row = await api(`/api/grades/${gid}/alignments`, {
      method: "POST",
      body: JSON.stringify({
        internalId: "NV-L1-DOC-001",
        moetSubject: "NGỮ VĂN",
        moetGrade: "Lớp 1",
        yeuCauCanDatVerbatim: verbatim,
        officialHours: { tiet_per_year: 420, subject: "Tiếng Việt", grade: "Lớp 1" },
        allocatedHours: { unit: "periods_per_week", value: 10 },
        verification: "oral",
        degree: "mot_phan",
      }),
      ...H,
    });
    if (row.status !== 201) throw new Error(`alignment create failed: ${JSON.stringify(row)}`);

    // Unconfirmed row must not render.
    const before = await api(`/api/grades/${gid}/matrix`, H);
    if (before.body.length !== 0) throw new Error("unconfirmed row rendered");

    const conf = await api(`/api/alignments/${row.body.id}/confirm`, { method: "PATCH", ...H });
    if (conf.status !== 200) throw new Error("confirm failed");

    const after = await api(`/api/grades/${gid}/matrix`, H);
    if (after.body.length !== 1) throw new Error("confirmed row missing");
    const m = after.body[0];
    if (m.internal_id !== "NV-L1-DOC-001" || m.internal_id_label !== "product-generated, not a MOET code") {
      throw new Error("matrix provenance labels wrong");
    }
    if (m.allocated_hours_label !== "family-assigned, not MOET-prescribed") throw new Error("hours label wrong");

    // Timetable: over-allocation rejected, valid week renders with sums.
    const plan = await api(`/api/programs/${prog.body.id}/year-plans`, {
      method: "POST",
      body: JSON.stringify({ yearLabel: "2026-2027", weeksTotal: 36, festivalWeeks: 4 }),
      ...H,
    });
    const yid = plan.body.id;
    const over = await api(`/api/year-plans/${yid}/slots`, {
      method: "POST",
      body: JSON.stringify({ week: 1, day: 2, slots: [{ start_min: 480, end_min: 901, planned_minutes: 421, kind: "instructional" }] }),
      ...H,
    });
    if (over.status !== 400) throw new Error("over-allocation was not rejected");

    const ok = await api(`/api/year-plans/${yid}/slots`, {
      method: "POST",
      body: JSON.stringify({
        week: 1,
        day: 2,
        slots: [
          { start_min: 480, end_min: 600, planned_minutes: 120, kind: "instructional", content: "truyện cổ tích" },
          { start_min: 600, end_min: 630, planned_minutes: 30, kind: "routine", content: "ăn nhẹ" },
        ],
      }),
      ...H,
    });
    if (ok.status !== 201) throw new Error("slot create failed");

    const week = await api(`/api/year-plans/${yid}/timetable?week=1`, H);
    const tue = week.body.find((d) => d.day === 2);
    if (!tue || tue.total !== 150 || tue.instructional !== 120) throw new Error(`timetable sums wrong: ${JSON.stringify(tue)}`);

    console.log("E2E PASS: matrix-timetable (deterministic, confirmed-only)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
