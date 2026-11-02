import { describe, expect, it } from "vitest";
import { DISCLAIMER } from "../src/export.js";

describe("export invariants (T7, T9)", () => {
  it("disclaimer is a planning/evidence statement with no official claims", () => {
    expect(DISCLAIMER).toMatch(/gia đình lập kế hoạch/);
    // Any mention of officialdom must be an explicit negation.
    expect(DISCLAIMER).toMatch(/không phải hồ sơ/);
    expect(DISCLAIMER).toMatch(/không thay thế xác nhận/);
    expect(DISCLAIMER).not.toMatch(/được công nhận|được chứng nhận|được chấp nhận|hợp lệ|hợp pháp/i);
  });

  it("no renderer may emit a score field", async () => {
    const mod = await import("../src/export.js");
    for (const fn of Object.values(mod)) {
      if (typeof fn === "function" && fn.name.startsWith("render")) {
        expect(fn.name).not.toMatch(/score/i);
      }
    }
  });
});
