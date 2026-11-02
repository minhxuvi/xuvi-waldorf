// Document 5: deterministic weekly timetable on the 08:00-15:00 Mon-Fri
// default template (420 min/day). All arithmetic validated; no LLM touches
// slots or sums (R16).
import type { Pool } from "pg";
import { logAudit } from "./auth.js";
import { SCHOOL_DAY_MINUTES, validateDaySlots, type TimetableSlotInput } from "./model/validation.js";

export type SlotInput = TimetableSlotInput & {
  content?: string;
  owner?: string;
  objectives?: string;
  actualMinutes?: number;
};

export async function createSlots(pool: Pool, familyId: string, yearPlanId: string, week: number, day: number, slots: SlotInput[]): Promise<{ ids: string[] }> {
  if (!Number.isInteger(week) || week <= 0) throw new Error("week must be a positive integer");
  if (!Number.isInteger(day) || day < 1 || day > 5) throw new Error("day must be 1-5 (Mon-Fri)");
  validateDaySlots(slots);
  const own = await pool.query(
    "SELECT yp.id FROM year_plans yp JOIN programs p ON p.id = yp.program_id WHERE yp.id = $1 AND p.family_id = $2",
    [yearPlanId, familyId],
  );
  if (own.rows.length === 0) throw new Error("year plan not found");
  const ids: string[] = [];
  for (const s of slots) {
    const r = await pool.query(
      `INSERT INTO timetable_slots(year_plan_id, week, day, start_min, end_min, content, owner,
        objectives, planned_minutes, actual_minutes, kind)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [yearPlanId, week, day, s.start_min, s.end_min, s.content ?? "", s.owner ?? "", s.objectives ?? "", s.planned_minutes, s.actualMinutes ?? null, s.kind],
    );
    ids.push(r.rows[0].id as string);
  }
  await logAudit(pool, familyId, "timetable.slots.create");
  return { ids };
}

export type TimetableDay = { day: number; total: number; instructional: number; slots: Record<string, unknown>[] };

export async function renderWeek(pool: Pool, familyId: string, yearPlanId: string, week: number): Promise<TimetableDay[]> {
  const own = await pool.query(
    "SELECT yp.id FROM year_plans yp JOIN programs p ON p.id = yp.program_id WHERE yp.id = $1 AND p.family_id = $2",
    [yearPlanId, familyId],
  );
  if (own.rows.length === 0) throw new Error("year plan not found");
  const rows = await pool.query("SELECT * FROM timetable_slots WHERE year_plan_id = $1 AND week = $2 ORDER BY day, start_min", [yearPlanId, week]);
  const days: TimetableDay[] = [];
  for (let day = 1; day <= 5; day++) {
    const list = rows.rows.filter((r) => (r as Record<string, unknown>)["day"] === day);
    let instructional = 0;
    for (const s of list) {
      const r = s as Record<string, unknown>;
      if (r["kind"] === "instructional") instructional += (r["end_min"] as number) - (r["start_min"] as number);
    }
    const total = list.reduce((a, s) => a + ((s as Record<string, unknown>)["end_min"] as number) - ((s as Record<string, unknown>)["start_min"] as number), 0);
    days.push({ day, total, instructional, slots: list });
  }
  return days;
}

export { SCHOOL_DAY_MINUTES };
