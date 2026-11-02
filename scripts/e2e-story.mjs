// E2E: XuVi Story core — upload (multipart .txt + JSON .md), audience,
// propose (stub, META stripped in child env), parent edit, confirm.
// Run: node scripts/e2e-story.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3117";
const BASE = `http://localhost:${PORT}`;
// Force the stub proposer in e2e (no AI spend, deterministic).
const CHILD_ENV = { ...process.env, PORT, META_API_KEY: "", LLM_FALLBACK_API_KEY: "" };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const GENTLE = `Ngày xửa ngày xưa, ở một làng quê Việt Nam có một cậu bé chăn trâu.

Một buổi chiều, cậu thả diều trên đê và hát véo von.

Tối về, cậu kể cho bà nghe chuyện con diều bay cao qua rặng tre.`;

function multipart(fields, filename, content) {
  const boundary = "----e2eboundary1234";
  let body = "";
  for (const [k, v] of Object.entries(fields)) {
    body += `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`;
  }
  body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: text/plain\r\n\r\n${content}\r\n--${boundary}--\r\n`;
  return { body: Buffer.from(body, "utf8"), contentType: `multipart/form-data; boundary=${boundary}` };
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

    const email = `story-${Date.now()}@example.vn`;
    const reg = await (await fetch(`${BASE}/api/teachers/register`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "mat-khau-sto-1", teacherName: "Story Teacher" }),
    })).json();
    const H = { authorization: `Bearer ${reg.token}` };
    const post = (p, b) => fetch(`${BASE}${p}`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(b) });

    // 1. Multipart .txt upload.
    const { body, contentType } = multipart({ title: "Cậu bé chăn trâu", language: "vi" }, "trau.txt", GENTLE);
    const up1 = await fetch(`${BASE}/api/stories`, { method: "POST", headers: { ...H, "content-type": contentType }, body });
    const s1 = await up1.json();
    if (up1.status !== 201 || !s1.id) throw new Error(`upload failed: ${JSON.stringify(s1)}`);
    if (s1.sensitivity.flags.length !== 0) throw new Error("gentle story should not be flagged");

    // 2. JSON story with war content gets flagged + min age.
    const war = await (await post("/api/stories", { title: "Thánh Gióng", text: "Giặc đến, chiến tranh lan rộng. ".repeat(20), language: "vi" })).json();
    if (!war.sensitivity.flags.includes("war") || war.sensitivity.minAge < 9) {
      throw new Error(`war story not gated: ${JSON.stringify(war.sensitivity)}`);
    }

    // 3. Audience + propose (stub) + edit + confirm.
    const aud = await (await post(`/api/stories/${s1.id}/audiences`, { age: "6-7", language: "vi", practiceGoal: "kể trôi chảy" })).json();
    if (!aud.id) throw new Error("audience failed");
    const prop = await (await fetch(`${BASE}/api/audiences/${aud.id}/story-map/propose`, { method: "POST", headers: H })).json();
    if (!prop.id || prop.provider !== "stub") throw new Error(`propose failed: ${JSON.stringify(prop)}`);
    const map = await (await fetch(`${BASE}/api/audiences/${aud.id}/story-map`, { headers: H })).json();
    if (!Array.isArray(map.chapters) || map.chapters.length === 0) throw new Error("empty story map");
    if (map.status !== "draft") throw new Error("map should start as draft");

    // Parent edits (adds a character), then confirms.
    const edited = {
      chapters: map.chapters,
      characters: [{ name: "Cậu bé", note: "hồn nhiên" }],
      essential_details: ["con diều", "rặng tre"],
    };
    const put = await fetch(`${BASE}/api/story-maps/${prop.id}`, {
      method: "PUT", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(edited),
    });
    if (put.status !== 200) throw new Error("edit failed");
    const conf = await fetch(`${BASE}/api/story-maps/${prop.id}/confirm`, { method: "POST", headers: H });
    if (conf.status !== 200) throw new Error("confirm failed");

    // Editing a confirmed map is rejected.
    const put2 = await fetch(`${BASE}/api/story-maps/${prop.id}`, {
      method: "PUT", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(edited),
    });
    if (put2.status !== 400) throw new Error("confirmed map was editable");

    // 4. Rejected upload type.
    const bad = multipart({}, "evil.exe", "x".repeat(100));
    const upBad = await fetch(`${BASE}/api/stories`, { method: "POST", headers: { ...H, "content-type": bad.contentType }, body: bad.body });
    if (upBad.status !== 400) throw new Error("bad upload type was not rejected");

    console.log("E2E PASS: story-upload-to-map");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
