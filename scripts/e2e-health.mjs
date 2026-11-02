// E2E: boot the real server, hit /api/health, assert shape, shut down.
// Run: pnpm test:e2e (requires .env with DATABASE_URL + AUTH_SECRET).
import { spawn } from "node:child_process";

const PORT = process.env["E2E_PORT"] || "3111";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const child = spawn("npx", ["tsx", "src/server.ts"], {
    env: { ...process.env, PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  if (child.stdout) {
    child.stdout.on("data", (d) => {
      out += String(d);
    });
  }
  try {
    let health = null;
    for (let i = 0; i < 30; i++) {
      await wait(500);
      try {
        const res = await fetch(`http://localhost:${PORT}/api/health`);
        if (res.ok) {
          health = await res.json();
          break;
        }
      } catch {
        // not up yet
      }
    }
    if (!health || typeof health.ok !== "boolean" || !health.db || !health.ai) {
      console.error("E2E FAIL: unexpected /api/health payload", out);
      process.exit(1);
    }
    console.log("E2E PASS: /api/health", JSON.stringify(health));
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error("E2E FAIL", err);
  process.exit(1);
});
