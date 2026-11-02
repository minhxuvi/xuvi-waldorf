import { describe, expect, it } from "vitest";
import { ALLOWED_EXTS, flagSensitive, parseMultipart } from "../src/xuvi.js";

describe("upload allowlist", () => {
  it("accepts doc/docx/pdf/html/markdown/plain text, rejects legacy .doc at extract time", () => {
    expect(ALLOWED_EXTS).toContain(".docx");
    expect(ALLOWED_EXTS).toContain(".pdf");
    expect(ALLOWED_EXTS).not.toContain(".doc");
    expect(ALLOWED_EXTS).not.toContain(".exe");
  });

  it("parses a single-file multipart body", () => {
    const boundary = "----testboundary";
    const body = Buffer.from(
      `------testboundary\r\nContent-Disposition: form-data; name="title"\r\n\r\nTruyện\r\n------testboundary\r\nContent-Disposition: form-data; name="file"; filename="truyen.txt"\r\nContent-Type: text/plain\r\n\r\nNgày xửa ngày xưa...\r\n------testboundary--\r\n`,
      "utf8",
    );
    const parsed = parseMultipart(`multipart/form-data; boundary=${boundary}`, body);
    expect(parsed.filename).toBe("truyen.txt");
    expect(parsed.data.toString("utf8")).toContain("Ngày xửa");
    expect(parsed.fields["title"]).toBe("Truyện");
  });
});

describe("age gating (D5/U9)", () => {
  it("flags war/death/dark content with minimum ages", () => {
    expect(flagSensitive("Ngày xửa ngày xưa có một nàng tiên.")).toEqual({ flags: [], minAge: 0 });
    const war = flagSensitive("Thánh Gióng đánh giặc, chiến tranh lan rộng.");
    expect(war.flags).toContain("war");
    expect(war.minAge).toBeGreaterThanOrEqual(9);
    const dark = flagSensitive("Khu rừng chìm trong bóng tối, ma quỷ hiện về.");
    expect(dark.flags).toContain("dark");
  });
});
