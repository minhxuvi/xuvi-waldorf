import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Pool } from "pg";

const scryptAsync = promisify(scrypt);
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000; // 30 days

export type Teacher = { id: string; family_id: string; email: string | null };

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) throw new Error("password too short (min 8 chars)");
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

export async function logAudit(
  pool: Pool,
  familyId: string | null,
  action: string,
  provider = "local",
  payloadType = "none",
): Promise<void> {
  await pool.query("INSERT INTO audit_log(family_id, action, provider, payload_type) VALUES ($1,$2,$3,$4)", [
    familyId,
    action,
    provider,
    payloadType,
  ]);
}

export async function registerTeacher(
  pool: Pool,
  email: string,
  password: string,
  teacherName: string,
): Promise<{ teacher: Teacher; token: string }> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) throw new Error("invalid email");
  const password_hash = await hashPassword(password);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const fam = await client.query("INSERT INTO families(teacher_name) VALUES ($1) RETURNING id", [teacherName]);
    const family_id = fam.rows[0].id as string;
    let teacher;
    try {
      const t = await client.query("INSERT INTO teachers(family_id, email, password_hash) VALUES ($1,$2,$3) RETURNING id, family_id, email", [
        family_id,
        normalized,
        password_hash,
      ]);
      teacher = t.rows[0] as Teacher;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
    const token = randomBytes(32).toString("hex");
    await client.query("INSERT INTO sessions(token_hash, teacher_id, expires_at) VALUES ($1,$2, now() + make_interval(secs => $3))", [
      sha256Hex(token),
      teacher.id,
      SESSION_TTL_MS / 1000,
    ]);
    await client.query("INSERT INTO audit_log(family_id, action) VALUES ($1,'teacher.register')", [family_id]);
    await client.query("COMMIT");
    return { teacher, token };
  } finally {
    client.release();
  }
}

export async function loginTeacher(pool: Pool, email: string, password: string): Promise<{ teacher: Teacher; token: string }> {
  const normalized = email.trim().toLowerCase();
  const found = await pool.query("SELECT id, family_id, email, password_hash FROM teachers WHERE lower(email) = $1", [normalized]);
  const row = found.rows[0];
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    throw new Error("invalid credentials");
  }
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(token_hash, teacher_id, expires_at) VALUES ($1,$2, now() + make_interval(secs => $3))", [
    sha256Hex(token),
    row.id,
    SESSION_TTL_MS / 1000,
  ]);
  await logAudit(pool, row.family_id, "teacher.login");
  return { teacher: { id: row.id, family_id: row.family_id, email: row.email }, token };
}

export async function logoutTeacher(pool: Pool, token: string): Promise<void> {
  await pool.query("DELETE FROM sessions WHERE token_hash = $1", [sha256Hex(token)]);
}

export async function authenticate(pool: Pool, token: string): Promise<Teacher | null> {
  const found = await pool.query(
    "SELECT t.id, t.family_id, t.email FROM sessions s JOIN teachers t ON t.id = s.teacher_id WHERE s.token_hash = $1 AND s.expires_at > now()",
    [sha256Hex(token)],
  );
  return (found.rows[0] as Teacher) ?? null;
}
