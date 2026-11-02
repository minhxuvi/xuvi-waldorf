import { describe, expect, it } from "vitest";
import { isStubDraft, pickLlmProvider } from "../src/ai.js";
import { validateProgramConfig } from "../src/documents.js";
import type { AppEnv } from "../src/env.js";

const baseEnv = { DATABASE_URL: "postgresql://x", AUTH_SECRET: "s3cret" } as AppEnv;

describe("provider selection (T12)", () => {
  it("prefers meta, falls back, then stubs", () => {
    expect(pickLlmProvider({ ...baseEnv, META_API_KEY: "k" })).toBe("meta");
    expect(pickLlmProvider({ ...baseEnv, LLM_FALLBACK_API_KEY: "k" })).toBe("fallback");
    expect(pickLlmProvider(baseEnv)).toBe("stub");
  });

  it("labels stub drafts honestly", () => {
    expect(isStubDraft("[Bản nháp mẫu — chưa qua AI. Gia đình cần xem lại toàn bộ trước khi dùng.]\nx")).toBe(true);
    expect(isStubDraft("real prose")).toBe(false);
  });
});

describe("program config (D1-D4, no silent merges)", () => {
  it("accepts explicit family choices", () => {
    expect(() =>
      validateProgramConfig({ corpus: "classical", rhythm: "waldorf-36-4", languageTiming: "oral-until-4", examPrecedence: "per-band" }),
    ).not.toThrow();
  });

  it("rejects unknown values", () => {
    expect(() => validateProgramConfig({ rhythm: "waldorf-40" as never })).toThrow(/unknown rhythm/);
    expect(() => validateProgramConfig({ languageTiming: "english-only" as never })).toThrow();
    expect(() => validateProgramConfig({ examPrecedence: "merge" as never })).toThrow();
  });
});
