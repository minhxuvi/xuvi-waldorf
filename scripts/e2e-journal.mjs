// E2E: journal append -> report draft -> create -> signoff (Doc 6).
// Run: node scripts/e2e-journal.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3115";
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

    const email = `journal-${Date.now()}@example.vn`;
    const reg = await api("/api/teachers/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "mat-khau-jrn-1", teacherName: "Journal Teacher" }),
    });
    if (reg.status !== 201) throw new Error("register failed");
    const H = { headers: { authorization: `Bearer ${reg.body.token}` } };

    const childRes = await api("/api/children", {
      method: "POST",
      body: JSON.stringify({ displayName: "Bé A", ageBand: "6-7", grade: "Lớp 1" }),
      ...H,
    });
    if (childRes.status !== 201) throw new Error("child create failed");
    const cid = childRes.body.id;

    // Bad date rejected.
    const bad = await api(`/api/children/${cid}/journal`, {
      method: "POST",
      body: JSON.stringify({ entryDate: "01-02-2026" }),
      ...H,
    });
    if (bad.status !== 400) throw new Error("bad date was not rejected");

    for (const d of ["2026-09-01", "2026-09-02"]) {
      const e = await api(`/api/children/${cid}/journal`, {
        method: "POST",
        body: JSON.stringify({ entryDate: d, contentDelivered: "kể truyện", attendance: "có mặt", artifactRefs: ["vở bài học"] }),
        ...H,
      });
      if (e.status !== 201) throw new Error("journal append failed");
    }

    const list = await api(`/api/children/${cid}/journal`, H);
    if (list.body.length !== 2) throw new Error("journal list wrong");

    const draft = await api(`/api/children/${cid}/report-draft?period=H%E1%BB%8Dc%20I`, H);
    if (!draft.body.narrative.includes("Số buổi đã ghi: 2")) throw new Error(`report draft wrong: ${JSON.stringify(draft.body)}`);

    const rep = await api(`/api/children/${cid}/reports`, {
      method: "POST",
      body: JSON.stringify({ periodLabel: "Học kì I", narrative: "Tiến bộ tốt." }),
      ...H,
    });
    if (rep.status !== 201) throw new Error("report create failed");

    const sign = await api(`/api/reports/${rep.body.id}/signoff`, {
      method: "POST",
      body: JSON.stringify({ signoff: "Mẹ Bé A" }),
      ...H,
    });
    if (sign.status !== 200) throw new Error("signoff failed");

    const sign2 = await api(`/api/reports/${rep.body.id}/signoff`, {
      method: "POST",
      body: JSON.stringify({ signoff: "Bố Bé A" }),
      ...H,
    });
    if (sign2.status !== 400) throw new Error(`double signoff was not rejected (got ${sign2.status})`);

    console.log("E2E PASS: journal-to-report");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
