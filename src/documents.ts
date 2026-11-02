// Documents 1/2/4: generate → parent edit → lock. Deterministic fields
// (hours, matrix, timetable) are owned by Task 6; LLMs draft narrative
// prose only (R16) and every draft is parent-edited before lock.
import type { Pool } from "pg";
import { logAudit } from "./auth.js";

export const RHYTHM_CHOICES = ["waldorf-36-4", "ntn-periods", "cambridge-banded", "custom"] as const;
export const LANGUAGE_TIMING = ["immersion-from-2", "oral-until-4", "custom"] as const;
export const EXAM_PRECEDENCE = ["waldorf-first", "exam-first", "per-band", "custom"] as const;

export type ProgramConfig = {
  corpus?: "classical" | "cambridge" | "ntn" | "mixed";
  rhythm?: (typeof RHYTHM_CHOICES)[number];
  languageTiming?: (typeof LANGUAGE_TIMING)[number];
  examPrecedence?: (typeof EXAM_PRECEDENCE)[number];
};

export function validateProgramConfig(config: ProgramConfig): void {
  // D1-D4: explicit family choices — unknown values and silent merges rejected.
  if (config.rhythm !== undefined && !(RHYTHM_CHOICES as readonly string[]).includes(config.rhythm)) {
    throw new Error(`unknown rhythm: ${config.rhythm}`);
  }
  if (config.languageTiming !== undefined && !(LANGUAGE_TIMING as readonly string[]).includes(config.languageTiming)) {
    throw new Error(`unknown languageTiming: ${config.languageTiming}`);
  }
  if (config.examPrecedence !== undefined && !(EXAM_PRECEDENCE as readonly string[]).includes(config.examPrecedence)) {
    throw new Error(`unknown examPrecedence: ${config.examPrecedence}`);
  }
}

export async function createProgram(
  pool: Pool,
  familyId: string,
  input: { philosophy?: string; goals?: string; config?: ProgramConfig; provenance?: Record<string, unknown> },
): Promise<{ id: string }> {
  if (input.config) validateProgramConfig(input.config);
  const rows = await pool.query(
    "INSERT INTO programs(family_id, philosophy, goals, config, provenance) VALUES ($1,$2,$3,$4,$5) RETURNING id",
    [familyId, input.philosophy ?? "", input.goals ?? "", JSON.stringify(input.config ?? {}), JSON.stringify(input.provenance ?? {})],
  );
  await logAudit(pool, familyId, "program.create");
  return { id: rows.rows[0].id as string };
}

export async function updateProgram(
  pool: Pool,
  familyId: string,
  id: string,
  patch: { philosophy?: string; goals?: string; qualities?: string; competencies?: string; areas?: string; methods?: string; assessment?: string },
): Promise<void> {
  const cur = await pool.query("SELECT status FROM programs WHERE id = $1 AND family_id = $2", [id, familyId]);
  if (cur.rows.length === 0) throw new Error("program not found");
  if (cur.rows[0].status === "locked") throw new Error("program is locked; unlock to edit");
  const fields = ["philosophy", "goals", "qualities", "competencies", "areas", "methods", "assessment"] as const;
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const f of fields) {
    if (patch[f] !== undefined) {
      vals.push(patch[f]);
      sets.push(`${f} = $${vals.length + 2}`);
    }
  }
  if (sets.length === 0) return;
  vals.unshift(id, familyId);
  await pool.query(`UPDATE programs SET ${sets.join(", ")} WHERE id = $1 AND family_id = $2`, vals);
  await logAudit(pool, familyId, "program.update");
}

export async function lockProgram(pool: Pool, familyId: string, id: string): Promise<void> {
  const r = await pool.query("UPDATE programs SET status = 'locked' WHERE id = $1 AND family_id = $2 AND status = 'draft'", [id, familyId]);
  if (r.rowCount === 0) throw new Error("program not found or already locked");
  await logAudit(pool, familyId, "program.lock");
}

export async function createGradeProgram(
  pool: Pool,
  familyId: string,
  programId: string,
  input: { grade: string; subjects?: unknown; objectives?: string; content?: string; allocatedHours?: unknown; provenance?: Record<string, unknown> },
): Promise<{ id: string }> {
  const own = await pool.query("SELECT id FROM programs WHERE id = $1 AND family_id = $2", [programId, familyId]);
  if (own.rows.length === 0) throw new Error("program not found");
  if (!input.grade.trim()) throw new Error("grade is required");
  const rows = await pool.query(
    "INSERT INTO grade_programs(program_id, grade, subjects, objectives, content, allocated_hours, provenance) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
    [programId, input.grade, JSON.stringify(input.subjects ?? []), input.objectives ?? "", input.content ?? "", JSON.stringify(input.allocatedHours ?? {}), JSON.stringify(input.provenance ?? {})],
  );
  await logAudit(pool, familyId, "grade_program.create");
  return { id: rows.rows[0].id as string };
}

export async function createYearPlan(
  pool: Pool,
  familyId: string,
  programId: string,
  input: { yearLabel: string; weeksTotal: number; festivalWeeks?: number; monthlyThemes?: unknown; activities?: string; contingency?: string; rhythmProvenance?: string },
): Promise<{ id: string }> {
  const own = await pool.query("SELECT id FROM programs WHERE id = $1 AND family_id = $2", [programId, familyId]);
  if (own.rows.length === 0) throw new Error("program not found");
  if (!Number.isInteger(input.weeksTotal) || input.weeksTotal <= 0) throw new Error("weeksTotal must be a positive integer");
  const rows = await pool.query(
    "INSERT INTO year_plans(program_id, year_label, weeks_total, festival_weeks, monthly_themes, activities, contingency, rhythm_provenance) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
    [programId, input.yearLabel, input.weeksTotal, input.festivalWeeks ?? 0, JSON.stringify(input.monthlyThemes ?? []), input.activities ?? "", input.contingency ?? "", input.rhythmProvenance ?? ""],
  );
  await logAudit(pool, familyId, "year_plan.create");
  return { id: rows.rows[0].id as string };
}
