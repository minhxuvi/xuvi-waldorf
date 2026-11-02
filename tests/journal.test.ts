import { describe, expect, it } from "vitest";

describe("journal date rule", () => {
  it("accepts YYYY-MM-DD only", () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test("2026-09-01")).toBe(true);
    expect(/^\d{4}-\d{2}-\d{2}$/.test("01-02-2026")).toBe(false);
  });
});
