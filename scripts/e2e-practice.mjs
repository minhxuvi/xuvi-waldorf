// E2E: visuals gate + practice + recording + transcript correction (Task 10).
// Run: node scripts/e2e-practice.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3118";
const BASE = `http://localhost:${PORT}`;
const CHILD_ENV = { ...process.env, PORT, META_API_KEY: "", LLM_FALLBACK_API_KEY: "" };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeWav() {
  const sampleRate = 8000;
  const segs = [
    { sec: 0.5, tone: true },
    { sec: 0.5, tone: false },
    { sec: 1.0, tone: true },
  ];
  const total = Math.floor(segs.reduce((a, s) => a + s.sec, 0) * sampleRate);
  const data = Buffer.alloc(total * 2);
  let i = 0;
  for (const seg of segs) {
    const n = Math.floor(seg.sec * sampleRate);
    for (let j = 0; j < n && i < total; j++, i++) {
      const v = seg.tone ? Math.floor(8000 * Math.sin((2 * Math.PI * 440 * (i / sampleRate)))) : 0;
      data.writeInt16LE(v, i * 2);
    }
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVE", 8);
  head.write("fmt ", 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(1, 22);
  head.writeUInt32LE(sampleRate, 24);
  head.writeUInt32LE(sampleRate * 2, 28);
  head.writeUInt16LE(2, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36);
  head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
}

function multipart(fields, filename, content) {
  const boundary = "----e2eprac1234";
  let pre = "";
  for (const [k, v] of Object.entries(fields)) {
    pre += `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`;
  }
  const head = Buffer.from(`${pre}--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: audio/wav\r\n\r\n`, "utf8");
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
  return { body: Buffer.concat([head, content, tail]), contentType: `multipart/form-data; boundary=${boundary}` };
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

    const email = `prac-${Date.now()}@example.vn`;
    const reg = await (await fetch(`${BASE}/api/teachers/register`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "mat-khau-prc-1", teacherName: "Practice Teacher" }),
    })).json();
    const H = { authorization: `Bearer ${reg.token}` };
    const post = (p, b) => fetch(`${BASE}${p}`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(b) }).then((r) => r.json().then((j) => ({ status: r.status, body: j })));

    const story = await post("/api/stories", { title: "Diều", text: "Cậu bé thả diều trên đê. ".repeat(20), language: "vi" });
    const aud = await post(`/api/stories/${story.body.id}/audiences`, { age: "6-7", language: "vi" });
    const prop = await fetch(`${BASE}/api/audiences/${aud.body.id}/story-map/propose`, { method: "POST", headers: H }).then((r) => r.json());
    await fetch(`${BASE}/api/story-maps/${prop.id}/confirm`, { method: "POST", headers: H });

    // Generate (stub) image, then verify gate: unapproved image blocked.
    const img = await post(`/api/story-maps/${prop.id}/images`, { sceneRef: "Cậu bé thả diều", style: "watercolor" });
    if (!img.body.id || img.body.provider !== "stub") throw new Error("stub image failed");
    const file = await fetch(`${BASE}/api/images/${img.body.id}/file`, { headers: H });
    if (file.status !== 200 || !(file.headers.get("content-type") || "").includes("svg")) {
      throw new Error("image file not served");
    }
    const attBlocked = await post("/api/attempts", { audienceId: aud.body.id, sceneImageId: img.body.id, promptsMode: "with_prompts" });
    if (attBlocked.status !== 400) throw new Error("unapproved image entered practice");

    // Approve, then attempt with WAV recording: metrics must show the pause.
    await fetch(`${BASE}/api/images/${img.body.id}`, { method: "PATCH", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify({ reviewStatus: "approved" }) });
    const { body, contentType } = multipart({ audienceId: aud.body.id, sceneImageId: img.body.id, promptsMode: "fading", assistance: "keywords", transcript: "cậu bé thả diều" }, "retelling.wav", makeWav());
    const att = await fetch(`${BASE}/api/attempts`, { method: "POST", headers: { ...H, "content-type": contentType }, body }).then((r) => r.json().then((j) => ({ status: r.status, body: j })));
    if (att.status !== 201) throw new Error(`attempt failed: ${JSON.stringify(att.body)}`);
    if (!att.body.metrics || att.body.metrics.analyzed !== true || att.body.metrics.pauseCount < 1) {
      throw new Error(`VAD metrics wrong: ${JSON.stringify(att.body.metrics)}`);
    }

    // Transcript correction + labelled history.
    const corr = await fetch(`${BASE}/api/attempts/${att.body.id}`, {
      method: "PATCH", headers: { ...H, "content-type": "application/json" },
      body: JSON.stringify({ transcriptCorrected: "Cậu bé thả diều trên đê." }),
    });
    if (corr.status !== 200) throw new Error("correction failed");
    const hist = await fetch(`${BASE}/api/audiences/${aud.body.id}/attempts?promptsMode=fading&assistance=keywords`, { headers: H }).then((r) => r.json());
    if (!Array.isArray(hist) || hist.length !== 1 || hist[0].transcript_corrected !== "Cậu bé thả diều trên đê.") {
      throw new Error("labelled history wrong");
    }

    console.log("E2E PASS: record-correct-retry (gate + WAV VAD + correction + history)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
