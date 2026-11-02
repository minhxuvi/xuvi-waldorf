// Document 6: teaching journal (continuous append) + periodic narrative
// reports with teacher sign-off. Fields stay minimal and
// family-configurable (R4 gap: no Waldorf-prescribed schema is claimed).
import type { Pool } from "pg";
import { logAudit } from "./auth.js";

export async function createChildProfile(
  pool: Pool,
  familyId: string,
  input: { displayName: string; ageBand: string; grade: string; language?: string; needs?: string },
): Promise<{ id: string }> {
  if (!input.displayName.trim()) throw new Error("displayName is required");
  if (!input.ageBand.trim() || !input.grade.trim()) throw new Error("ageBand and grade are required");
  const r = await pool.query(
    "INSERT INTO child_profiles(family_id, display_name, age_band, grade, language, needs) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
    [familyId, input.displayName, input.ageBand, input.grade, input.language ?? "vi", input.needs ?? ""],
  );
  await logAudit(pool, familyId, "child.create");
  return { id: r.rows[0].id as string };
}

export async function ownChild(pool: Pool, familyId: string, childId: string): Promise<void> {
  const r = await pool.query("SELECT id FROM child_profiles WHERE id = $1 AND family_id = $2", [childId, familyId]);
  if (r.rows.length === 0) throw new Error("child profile not found");
}

export async function appendJournalEntry(
  pool: Pool,
  familyId: string,
  childId: string,
  input: { entryDate: string; contentDelivered?: string; attendance?: string; assessmentNotes?: string; assignments?: string; artifactRefs?: unknown; progressNotes?: string },
): Promise<{ id: string }> {
  await ownChild(pool, familyId, childId);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.entryDate)) throw new Error("entryDate must be YYYY-MM-DD");
  const r = await pool.query(
    `INSERT INTO journal_entries(child_profile_id, entry_date, content_delivered, attendance,
      assessment_notes, assignments, artifact_refs, progress_notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8) RETURNING id`,
    [childId, input.entryDate, input.contentDelivered ?? "", input.attendance ?? "", input.assessmentNotes ?? "", input.assignments ?? "", JSON.stringify(input.artifactRefs ?? []), input.progressNotes ?? ""],
  );
  await logAudit(pool, familyId, "journal.append");
  return { id: r.rows[0].id as string };
}

export async function listJournal(pool: Pool, familyId: string, childId: string): Promise<Record<string, unknown>[]> {
  await ownChild(pool, familyId, childId);
  const r = await pool.query("SELECT * FROM journal_entries WHERE child_profile_id = $1 ORDER BY entry_date", [childId]);
  return r.rows as Record<string, unknown>[];
}

// Deterministic rollup: counts + date range + artifact refs. The narrative
// itself is parent-written (or drafted via /api/draft); never auto-claimed.
export async function buildReportDraft(pool: Pool, familyId: string, childId: string, periodLabel: string): Promise<{ narrative: string; entryCount: number }> {
  const entries = await listJournal(pool, familyId, childId);
  const dates = entries.map((e) => String(e["entry_date"])).sort();
  const artifacts = entries.flatMap((e) => (e["artifact_refs"] as unknown[]) ?? []);
  const narrative = [
    `Kỳ: ${periodLabel}.`,
    `Số buổi đã ghi: ${entries.length}.`,
    dates.length > 0 ? `Từ ${dates[0]} đến ${dates[dates.length - 1]}.` : "Chưa có buổi ghi nào.",
    `Học liệu/thành phẩm được dẫn: ${artifacts.length}.`,
  ].join(" ");
  return { narrative, entryCount: entries.length };
}

export async function createReport(pool: Pool, familyId: string, childId: string, periodLabel: string, narrative: string): Promise<{ id: string }> {
  await ownChild(pool, familyId, childId);
  if (!periodLabel.trim()) throw new Error("periodLabel is required");
  if (!narrative.trim()) throw new Error("narrative is required");
  const r = await pool.query("INSERT INTO periodic_reports(child_profile_id, period_label, narrative) VALUES ($1,$2,$3) RETURNING id", [
    childId,
    periodLabel,
    narrative,
  ]);
  await logAudit(pool, familyId, "report.create");
  return { id: r.rows[0].id as string };
}

export async function signOffReport(pool: Pool, familyId: string, reportId: string, signoff: string): Promise<void> {
  if (!signoff.trim()) throw new Error("signoff is required");
  const r = await pool.query(
    `UPDATE periodic_reports pr SET signoff = $1, signoff_at = now() FROM child_profiles cp
     WHERE pr.id = $2 AND pr.child_profile_id = cp.id AND cp.family_id = $3 AND pr.signoff_at IS NULL`,
    [signoff, reportId, familyId],
  );
  if (r.rowCount === 0) throw new Error("report not found or already signed off");
  await logAudit(pool, familyId, "report.signoff");
}
