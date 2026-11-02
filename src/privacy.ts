// Family data portability: full export archive and full delete (R21).
// Exports never include password hashes or session token hashes.
import type { Pool } from "pg";

const FAMILY_TABLES = [
  "child_profiles",
  "programs",
  "grade_programs",
  "alignment_rows",
  "year_plans",
  "timetable_slots",
  "journal_entries",
  "periodic_reports",
  "stories",
  "audiences",
  "story_maps",
  "scene_images",
  "attempts",
] as const;

export function stripSecrets<T>(row: T): T {
  if (row !== null && typeof row === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
      if (/password_hash|token_hash/i.test(k)) continue;
      out[k] = v;
    }
    return out as T;
  }
  return row;
}

export async function exportFamily(pool: Pool, familyId: string): Promise<Record<string, unknown[]>> {
  const archive: Record<string, unknown[]> = {};
  const fam = await pool.query("SELECT id, teacher_name, created_at FROM families WHERE id = $1", [familyId]);
  archive["families"] = fam.rows;
  const teachers = await pool.query("SELECT id, family_id, email, created_at FROM teachers WHERE family_id = $1", [familyId]);
  archive["teachers"] = teachers.rows;
  for (const table of FAMILY_TABLES) {
    // Each table links to the family tree; walk via explicit joins per table.
    const rows = await pool.query(`SELECT * FROM ${table} WHERE family_id = $1`, [familyId]).catch(() => null);
    if (rows) {
      archive[table] = rows.rows.map(stripSecrets);
      continue;
    }
    archive[table] = await collectViaJoins(pool, table, familyId);
  }
  const audit = await pool.query("SELECT id, family_id, action, provider, payload_type, created_at FROM audit_log WHERE family_id = $1 ORDER BY created_at", [
    familyId,
  ]);
  archive["audit_log"] = audit.rows;
  return archive;
}

async function collectViaJoins(pool: Pool, table: string, familyId: string): Promise<unknown[]> {
  // Tables without a direct family_id column are reached through their parents.
  const queries: Record<string, string> = {
    grade_programs: `SELECT gp.* FROM grade_programs gp JOIN programs p ON p.id = gp.program_id WHERE p.family_id = $1`,
    alignment_rows: `SELECT ar.* FROM alignment_rows ar JOIN grade_programs gp ON gp.id = ar.grade_program_id JOIN programs p ON p.id = gp.program_id WHERE p.family_id = $1`,
    year_plans: `SELECT yp.* FROM year_plans yp JOIN programs p ON p.id = yp.program_id WHERE p.family_id = $1`,
    timetable_slots: `SELECT ts.* FROM timetable_slots ts JOIN year_plans yp ON yp.id = ts.year_plan_id JOIN programs p ON p.id = yp.program_id WHERE p.family_id = $1`,
    journal_entries: `SELECT je.* FROM journal_entries je JOIN child_profiles cp ON cp.id = je.child_profile_id WHERE cp.family_id = $1`,
    periodic_reports: `SELECT pr.* FROM periodic_reports pr JOIN child_profiles cp ON cp.id = pr.child_profile_id WHERE cp.family_id = $1`,
    audiences: `SELECT a.* FROM audiences a JOIN stories s ON s.id = a.story_id WHERE s.family_id = $1`,
    story_maps: `SELECT sm.* FROM story_maps sm JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE s.family_id = $1`,
    scene_images: `SELECT si.* FROM scene_images si JOIN story_maps sm ON sm.id = si.story_map_id JOIN audiences a ON a.id = sm.audience_id JOIN stories s ON s.id = a.story_id WHERE s.family_id = $1`,
    attempts: `SELECT at.* FROM attempts at JOIN audiences a ON a.id = at.audience_id JOIN stories s ON s.id = a.story_id WHERE s.family_id = $1`,
  };
  const q = queries[table];
  if (!q) return [];
  const rows = await pool.query(q, [familyId]);
  return rows.rows.map(stripSecrets);
}

export async function deleteFamily(pool: Pool, familyId: string): Promise<void> {
  // Cascades to every family-owned row including audit history.
  await pool.query("DELETE FROM families WHERE id = $1", [familyId]);
}
