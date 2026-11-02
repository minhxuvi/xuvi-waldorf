import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/auth.js";
import { stripSecrets } from "../src/privacy.js";
import { ROUTES } from "../src/server.js";

describe("password hashing", () => {
  it("round-trips and rejects wrong passwords", async () => {
    const h = await hashPassword("mat-khau-dai-123");
    expect(h.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("mat-khau-dai-123", h)).toBe(true);
    expect(await verifyPassword("sai-mat-khau", h)).toBe(false);
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });

  it("rejects short passwords", async () => {
    await expect(hashPassword("ngan")).rejects.toThrow(/too short/);
  });
});

describe("secret stripping", () => {
  it("drops password and token hashes from exports", () => {
    const row = stripSecrets({ id: "1", email: "a@b.c", password_hash: "x", note: "ok" });
    expect(row).toEqual({ id: "1", email: "a@b.c", note: "ok" });
  });
});

describe("route table (T10)", () => {
  it("contains no child-login or child-facing routes", () => {
    const joined = ROUTES.join("\n").toLowerCase();
    expect(joined).not.toMatch(/child.*login|login.*child|\/api\/children/);
    expect(ROUTES).toContain("POST /api/teachers/register");
    expect(ROUTES).toContain("DELETE /api/account");
  });
});
