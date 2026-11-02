import { describe, expect, it } from "vitest";
import {
  assertAllocatedHours,
  assertNoScore,
  assertOfficialHours,
  canRenderAlignmentRow,
  canUseImageInPractice,
  SCHOOL_DAY_MINUTES,
  validateDaySlots,
} from "../src/model/validation.js";

describe("hours split (T2)", () => {
  it("accepts native units, rejects silent-conversion bait", () => {
    expect(() => assertAllocatedHours({ unit: "block_weeks", value: 3 })).not.toThrow();
    expect(() => assertAllocatedHours({ unit: "tiet", value: 105 })).not.toThrow();
    expect(() => assertAllocatedHours({ unit: "weeks" as never, value: 3 })).toThrow();
    expect(() => assertAllocatedHours({ unit: "tiet", value: -1 })).toThrow();
  });

  it("official hours stay at tiet/nam granularity", () => {
    expect(() => assertOfficialHours({ tiet_per_year: 140, subject: "Toán", grade: "6" })).not.toThrow();
    expect(() => assertOfficialHours({ tiet_per_year: 105, strand_percent: 80 })).not.toThrow();
    expect(() => assertOfficialHours({ tiet_per_year: 0 })).toThrow();
    expect(() => assertOfficialHours({ strand_percent: 120 })).toThrow();
  });
});

describe("timetable day arithmetic", () => {
  it("sums within the 08:00-15:00 template", () => {
    expect(SCHOOL_DAY_MINUTES).toBe(420);
    const r = validateDaySlots([
      { start_min: 480, end_min: 600, planned_minutes: 120, kind: "instructional" },
      { start_min: 600, end_min: 630, planned_minutes: 30, kind: "routine" },
    ]);
    expect(r.total).toBe(150);
    expect(r.instructional).toBe(120);
  });

  it("rejects over-allocation and inverted slots", () => {
    expect(() =>
      validateDaySlots([{ start_min: 480, end_min: 480 + 421, planned_minutes: 421, kind: "instructional" }]),
    ).toThrow(/over-allocates/);
    expect(() =>
      validateDaySlots([{ start_min: 600, end_min: 500, planned_minutes: 10, kind: "routine" }]),
    ).toThrow();
  });
});

describe("alignment row render gate (T1)", () => {
  const base = {
    internal_id: "NV-L1-DOC-001",
    yeu_cau_can_dat_verbatim: "Tốc độ đọc khoảng 40–60 tiếng/1 phút",
    verification: "oral",
    degree: "mot_phan",
    confirmed: true,
  };
  it("renders only confirmed rows over verbatim text", () => {
    expect(canRenderAlignmentRow(base)).toBe(true);
    expect(canRenderAlignmentRow({ ...base, confirmed: false })).toBe(false);
    expect(canRenderAlignmentRow({ ...base, yeu_cau_can_dat_verbatim: "  " })).toBe(false);
    expect(canRenderAlignmentRow({ ...base, degree: "full" })).toBe(false);
  });
});

describe("no-score guard (T9)", () => {
  it("rejects score/ranking anywhere in attempt payloads", () => {
    expect(() => assertNoScore({ feedback: { strengths: ["a"] } })).not.toThrow();
    expect(() => assertNoScore({ score: 9 })).toThrow(/must not contain a score/);
    expect(() => assertNoScore({ feedback: { ranking: 1 } })).toThrow();
  });
});

describe("image review gate (T5)", () => {
  it("only approved images enter practice", () => {
    expect(canUseImageInPractice("approved")).toBe(true);
    expect(canUseImageInPractice("pending")).toBe(false);
    expect(canUseImageInPractice("replaced")).toBe(false);
  });
});
