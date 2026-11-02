import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/env.js";
import { buildHealth } from "../src/server.js";
import { t } from "../src/i18n.js";

describe("loadEnv", () => {
  it("fails fast when required vars are missing", () => {
    expect(() => loadEnv({})).toThrow(/Missing required env vars: DATABASE_URL, AUTH_SECRET/);
  });

  it("loads required vars and defaults", () => {
    const env = loadEnv({ DATABASE_URL: "postgresql://x", AUTH_SECRET: "s3cret" });
    expect(env.DATABASE_URL).toBe("postgresql://x");
    expect(env.APP_BASE_URL).toBe("http://localhost:3000");
    expect(env.PORT).toBe(3000);
  });
});

describe("buildHealth", () => {
  it("reports modes without leaking secrets", () => {
    const env = loadEnv({ DATABASE_URL: "postgresql://x", AUTH_SECRET: "s3cret" });
    const health = buildHealth(env, "up");
    expect(health.ok).toBe(true);
    expect(health.storage).toBe("local-stub");
    expect(health.ai.stt).toBe("stub");
    expect(JSON.stringify(health)).not.toContain("s3cret");
  });

  it("marks not-ok only when db is down", () => {
    const env = loadEnv({ DATABASE_URL: "postgresql://x", AUTH_SECRET: "s3cret" });
    expect(buildHealth(env, "down").ok).toBe(false);
  });
});

describe("i18n", () => {
  it("serves Vietnamese first", () => {
    expect(t("vi", "app.name")).toBe("XuVi Waldorf");
  });
});
