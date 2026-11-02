import { describe, expect, it } from "vitest";
import { assertNoScore } from "../src/model/validation.js";

function hasScoreKey(v: unknown): boolean {
  if (v !== null && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (/^(score|ranking|rank|grade_points)$/i.test(k)) return true;
      if (hasScoreKey(val)) return true;
    }
  }
  return false;
}

describe("feedback fixed form (T9)", () => {
  it("schema carries strengths + missing + one next step, never a score", () => {
    const sample = {
      strengths: ["Giữ được chi tiết: con diều"],
      missing_or_altered: ["rặng tre"],
      one_next_step: "Lần kể tới, thêm rặng tre.",
      excerpts: [{ text: "Cậu bé thả diều", at_char: 0 }],
      provider: "stub",
    };
    expect(sample.strengths.length).toBeGreaterThan(0);
    expect(typeof sample.one_next_step).toBe("string");
    expect(hasScoreKey(sample)).toBe(false);
    expect(() => assertNoScore(sample)).not.toThrow();
    expect(() => assertNoScore({ ...sample, score: 9 })).toThrow();
  });
});
