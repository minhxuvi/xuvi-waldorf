// Data-layer invariants (T1, T2, T5, T9). Validated here so business logic
// cannot bypass them even if a caller skips the DB constraints.

export const VERIFICATIONS = ["observation", "artifact", "oral", "periodic_task"] as const;
export const DEGREES = ["day_du", "mot_phan", "deferred", "tiep_can_khac", "chua_bao_phu"] as const;
export const SLOT_KINDS = ["instructional", "routine", "activity"] as const;
export const HOUR_UNITS = ["block_weeks", "periods_per_week", "clock_minutes", "tiet"] as const;

// Default school-day template: 08:00-15:00 Mon-Fri = 420 min/day.
export const SCHOOL_DAY_MINUTES = 420;

export type HourValue = { unit: (typeof HOUR_UNITS)[number]; value: number };
export type OfficialHours = { tiet_per_year?: number; subject?: string; grade?: string; strand_percent?: number };

export function assertAllocatedHours(h: HourValue): void {
  if (!HOUR_UNITS.includes(h.unit)) throw new Error(`unknown hour unit: ${h.unit}`);
  if (!Number.isFinite(h.value) || h.value <= 0) throw new Error(`invalid hour value: ${h.value}`);
}

export function assertOfficialHours(h: OfficialHours): void {
  // MOET prescribes tiet/nam/subject/grade only (synthesis R5). Strand % is
  // allowed only where the subject program gives it. Never invent finer units.
  if (h.tiet_per_year !== undefined && (!Number.isFinite(h.tiet_per_year) || h.tiet_per_year <= 0)) {
    throw new Error(`invalid tiet_per_year: ${h.tiet_per_year}`);
  }
  if (h.strand_percent !== undefined && (h.strand_percent < 0 || h.strand_percent > 100)) {
    throw new Error(`invalid strand_percent: ${h.strand_percent}`);
  }
}

export type TimetableSlotInput = { start_min: number; end_min: number; planned_minutes: number; kind: (typeof SLOT_KINDS)[number] };

export function validateDaySlots(slots: TimetableSlotInput[]): { total: number; instructional: number } {
  let total = 0;
  let instructional = 0;
  for (const s of slots) {
    if (s.end_min <= s.start_min) throw new Error("slot end must be after start");
    if (s.planned_minutes <= 0) throw new Error("planned_minutes must be positive");
    if (!SLOT_KINDS.includes(s.kind)) throw new Error(`unknown slot kind: ${s.kind}`);
    total += s.end_min - s.start_min;
    if (s.kind === "instructional") instructional += s.end_min - s.start_min;
  }
  if (total > SCHOOL_DAY_MINUTES) {
    throw new Error(`day over-allocates: ${total} > ${SCHOOL_DAY_MINUTES} minutes`);
  }
  return { total, instructional };
}

export type AlignmentRowInput = {
  internal_id: string;
  yeu_cau_can_dat_verbatim: string;
  verification: string;
  degree: string;
  confirmed: boolean;
};

// A Document-3 row renders only when parent-confirmed over verbatim MOET text (T1).
export function canRenderAlignmentRow(row: AlignmentRowInput): boolean {
  return (
    row.confirmed === true &&
    row.yeu_cau_can_dat_verbatim.trim().length > 0 &&
    (VERIFICATIONS as readonly string[]).includes(row.verification) &&
    (DEGREES as readonly string[]).includes(row.degree)
  );
}

// Guard: Attempt/feedback must never carry a score or ranking (T9).
export function assertNoScore(value: unknown, path = "attempt"): void {
  if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (/^(score|ranking|rank|grade_points)$/i.test(k)) {
        throw new Error(`${path} must not contain a score field (found ${k})`);
      }
      assertNoScore(v, `${path}.${k}`);
    }
  }
}

// Guard: generated images enter practice only after parent approval (T5).
export function canUseImageInPractice(reviewStatus: string): boolean {
  return reviewStatus === "approved";
}
