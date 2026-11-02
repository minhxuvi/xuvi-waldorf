// E2E: all six documents render as HTML and PDF (print-fidelity gate).
// Run: node scripts/e2e-export.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3116";
const BASE = `http://localhost:${PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const child = spawn("npx", ["tsx", "src/server.ts"], {
    env: { ...process.env, PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    let up = false;
    for (let i = 0; i < 40; i++) {
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

    const email = `export-${Date.now()}@example.vn`;
    const reg = await fetch(`${BASE}/api/teachers/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "mat-khau-exp-1", teacherName: "Export Teacher" }),
    }).then((r) => r.json());
    const H = { authorization: `Bearer ${reg.token}` };
    const api = async (path, opts = {}) => {
      const { headers: optHeaders, ...rest } = opts;
      const res = await fetch(`${BASE}${path}`, { ...rest, headers: { ...H, ...(optHeaders || {}) } });
      return res;
    };
    const post = (path, body) => api(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());

    const prog = await post("/api/programs", { philosophy: "p", goals: "g" });
    const grade = await post(`/api/programs/${prog.id}/grades`, { grade: "Lớp 1" });
    const row = await post(`/api/grades/${grade.id}/alignments`, {
      internalId: "NV-L1-DOC-001",
      moetSubject: "NGỮ VĂN",
      moetGrade: "Lớp 1",
      yeuCauCanDatVerbatim: "Tốc độ đọc khoảng 40–60 tiếng trong 1 phút.",
      verification: "oral",
      degree: "mot_phan",
    });
    await api(`/api/alignments/${row.id}/confirm`, { method: "PATCH" });
    const yp = await post(`/api/programs/${prog.id}/year-plans`, { yearLabel: "2026-2027", weeksTotal: 36, festivalWeeks: 4 });
    await post(`/api/year-plans/${yp.id}/slots`, {
      week: 1,
      day: 2,
      slots: [{ start_min: 480, end_min: 600, planned_minutes: 120, kind: "instructional", content: "truyện" }],
    });
    const ch = await post("/api/children", { displayName: "Bé B", ageBand: "6-7", grade: "Lớp 1" });
    await post(`/api/children/${ch.id}/journal`, { entryDate: "2026-09-01", contentDelivered: "kể truyện" });

    const docs = [
      ["program", prog.id, ""],
      ["grade", grade.id, ""],
      ["matrix", grade.id, ""],
      ["yearplan", yp.id, ""],
      ["timetable", yp.id, "&week=1"],
      ["journal", ch.id, ""],
    ];
    for (const [kind, id, extra] of docs) {
      const html = await api(`/api/docs/${kind}/${id}?format=html${extra}`);
      const htmlText = await html.text();
      if (html.status !== 200 || !htmlText.includes("gia đình lập kế hoạch")) {
        throw new Error(`${kind} html missing disclaimer`);
      }
      if (/chấm điểm|tổng điểm|score/i.test(htmlText)) throw new Error(`${kind} html contains a score`);
      const pdf = await api(`/api/docs/${kind}/${id}?format=pdf${extra}`);
      const buf = Buffer.from(await pdf.arrayBuffer());
      if (pdf.status !== 200 || buf.subarray(0, 5).toString() !== "%PDF-") {
        throw new Error(`${kind} pdf invalid`);
      }
      if (buf.length < 5000) throw new Error(`${kind} pdf suspiciously small (${buf.length}b)`);
      console.log(`ok ${kind}: html=${htmlText.length}b pdf=${buf.length}b`);
    }

    // Unknown kind 404s.
    const bad = await api(`/api/docs/nope/x?format=html`);
    if (bad.status !== 404) throw new Error("unknown doc kind was not rejected");

    console.log("E2E PASS: pdf-export (6 docs html+pdf)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
