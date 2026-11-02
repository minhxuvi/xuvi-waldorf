import { describe, expect, it } from "vitest";
import { toMatrixRow, validateAlignmentInput } from "../src/alignment.js";
import { validateDaySlots } from "../src/model/validation.js";

describe("alignment validation (T1)", () => {
  const base = {
    internalId: "MOET-NGUV-00001",
    moetSubject: "NGỮ VĂN",
    moetGrade: "Lớp 1",
    yeuCauCanDatVerbatim: "Tốc độ đọc khoảng 40–60 tiếng trong 1 phút.",
  };

  it("requires verbatim MOET text and known enums", () => {
    expect(() => validateAlignmentInput(base)).not.toThrow();
    expect(() => validateAlignmentInput({ ...base, yeuCauCanDatVerbatim: "  " })).toThrow(/verbatim/);
    expect(() => validateAlignmentInput({ ...base, degree: "full" })).toThrow(/unknown degree/);
    expect(() => validateAlignmentInput({ ...base, degree: "deferred" })).toThrow(/roadmap/);
    expect(() => validateAlignmentInput({ ...base, degree: "deferred", deferredRoadmap: "đọc thành thạo ở Lớp 2" })).not.toThrow();
  });

  it("labels provenance on every rendered row (golden)", () => {
    const row = toMatrixRow({
      internal_id: "MOET-NGUV-00001",
      moet_subject: "NGỮ VĂN",
      moet_grade: "Lớp 1",
      moet_level: "",
      moet_strand: "",
      moet_topic: "KĨ THUẬT ĐỌC",
      yeu_cau_can_dat_verbatim: "Tốc độ đọc khoảng 40–60 tiếng trong 1 phút.",
      paired_noi_dung: "",
      source_locator: { pdf_page: 76 },
      homeschool_content: "đọc truyện mỗi sáng",
      official_hours: { tiet_per_year: 420 },
      allocated_hours: { unit: "periods_per_week", value: 10 },
      verification: "oral",
      degree: "mot_phan",
      deferred_roadmap: "",
    });
    expect(row).toMatchSnapshot();
    expect(row.internal_id_label).toMatch(/product-generated/);
    expect(row.allocated_hours_label).toMatch(/not MOET-prescribed/);
    expect(row.degree_label).toMatch(/product taxonomy/);
  });
});

describe("timetable arithmetic (golden)", () => {
  it("rejects days over 420 minutes", () => {
    expect(() =>
      validateDaySlots([{ start_min: 480, end_min: 900, planned_minutes: 420, kind: "instructional" }]),
    ).not.toThrow();
    expect(() =>
      validateDaySlots([{ start_min: 480, end_min: 901, planned_minutes: 421, kind: "instructional" }]),
    ).toThrow(/over-allocates/);
  });
});
