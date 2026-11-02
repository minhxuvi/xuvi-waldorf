// E2E privacy flow: register -> login -> wrong-password rejected ->
// export (no secrets) -> audit shows entries -> delete -> login fails.
// Run: node scripts/e2e-privacy.mjs (needs .env with DATABASE_URL).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3112";
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

    const email = `e2e-${Date.now()}@example.vn`;
    const reg = await api("/api/teachers/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "mat-khau-e2e-123", teacherName: "E2E Teacher" }),
    });
    if (reg.status !== 201 || !reg.body.token) throw new Error(`register failed: ${JSON.stringify(reg)}`);
    const token = reg.body.token;
    const auth = { headers: { authorization: `Bearer ${token}` } };

    const bad = await api("/api/teachers/login", { method: "POST", body: JSON.stringify({ email, password: "sai" }) });
    if (bad.status !== 401) throw new Error("wrong password was not rejected");

    const login = await api("/api/teachers/login", { method: "POST", body: JSON.stringify({ email, password: "mat-khau-e2e-123" }) });
    if (login.status !== 200 || !login.body.token) throw new Error("login failed");

    const exported = await api("/api/export", auth);
    if (exported.status !== 200) throw new Error("export failed");
    const dump = JSON.stringify(exported.body);
    if (/password_hash|token_hash/.test(dump)) throw new Error("export leaks secrets");
    if (!exported.body.teachers || exported.body.teachers.length !== 1) throw new Error("export missing teacher");

    const audit = await api("/api/audit", auth);
    if (audit.status !== 200) throw new Error("audit failed");
    const actions = audit.body.map((r) => r.action);
    for (const need of ["teacher.register", "teacher.login", "family.export"]) {
      if (!actions.includes(need)) throw new Error(`audit missing ${need} (got ${actions})`);
    }
    if (audit.body.some((r) => !r.provider || !r.payload_type)) throw new Error("audit rows lack provider/payload_type");

    const noauth = await api("/api/export");
    if (noauth.status !== 401) throw new Error("export without token was not rejected");

    const del = await api("/api/account", { method: "DELETE", ...auth });
    if (del.status !== 200) throw new Error("delete failed");
    const relogin = await api("/api/teachers/login", { method: "POST", body: JSON.stringify({ email, password: "mat-khau-e2e-123" }) });
    if (relogin.status !== 401) throw new Error("deleted account can still log in");

    console.log("E2E PASS: privacy-flow (register/login/export/audit/delete)");
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
