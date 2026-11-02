import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type MoetRow = {
  internal_id: string;
  product_generated_id: boolean;
  subject: string;
  grade: string;
  level: string;
  yeu_cau_can_dat_verbatim: string;
  source_locator: { pdf_page: number; section: string; heading: string };
};

const data = JSON.parse(readFileSync("data/moet_outcomes.json", "utf8")) as {
  meta: { product_generated_ids: boolean; currency_caveat: string };
  rows: MoetRow[];
};

describe("moet dataset (R5 granularity, T1)", () => {
  it("has substantial verbatim coverage", () => {
    expect(data.rows.length).toBeGreaterThanOrEqual(10000);
  });

  it("labels internal ids as product-generated", () => {
    expect(data.meta.product_generated_ids).toBe(true);
    for (const r of data.rows) {
      expect(r.internal_id.startsWith("MOET-")).toBe(true);
      expect(r.product_generated_id).toBe(true);
    }
  });

  it("contains no invented MOET outcome codes", () => {
    const codeRe = /\b[A-ZĐ]{2,}\d(?:[-.][A-ZĐ0-9]+)+\b/;
    for (const r of data.rows) {
      expect(r.yeu_cau_can_dat_verbatim.trim().length).toBeGreaterThan(0);
      expect(codeRe.test(r.yeu_cau_can_dat_verbatim)).toBe(false);
      expect(r.source_locator.pdf_page).toBeGreaterThan(0);
    }
  });

  it("keeps the currency caveat next to the data (U1)", () => {
    expect(data.meta.currency_caveat).toMatch(/U1/);
  });

  it("contains the synthesis spot samples verbatim", () => {
    const texts = data.rows.map((r) => r.yeu_cau_can_dat_verbatim);
    // Ngu van Lop 1 reading-speed bullet (line-wrap joined during ingest).
    expect(texts.some((t) => t.includes("40") && t.includes("60") && t.includes("tiếng trong 1 phút"))).toBe(true);
    // Toan Lop 1 strands present.
    expect(data.rows.some((r) => r.subject === "TOÁN" && r.grade === "Lớp 1")).toBe(true);
    // Core subjects all represented.
    for (const s of ["NGỮ VĂN", "TOÁN", "TIẾNG ANH", "VẬT LÍ", "KHOA HỌC TỰ NHIÊN", "SINH HỌC"]) {
      expect(data.rows.some((r) => r.subject === s)).toBe(true);
    }
  });
});
