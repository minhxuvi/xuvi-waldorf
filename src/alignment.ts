// Document 3: deterministic alignment matrix. Only parent-confirmed rows
// over verbatim MOET text render (T1). Internal ids are labelled
// product-generated; allocated hours never render as MOET-prescribed (T2).
import type { Pool } from "pg";
import { logAudit } from "./auth.js";
import { DEGREES, VERIFICATIONS } from "./model/validation.js";

export type AlignmentInput = {
  internalId: string;
  moetSubject: string;
  moetGrade: string;
  moetLevel?: string;
  moetStrand?: string;
  moetTopic?: string;
  yeuCauCanDatVerbatim: string;
  pairedNoiDung?: string;
  sourceLocator?: Record<string, unknown>;
  competencyRefs?: unknown;
  homeschoolContent?: string;
  officialHours?: Record<string, unknown>;
  allocatedHours?: Record<string, unknown>;
  verification?: string;
  degree?: string;
  deferredRoadmap?: string;
};

export function validateAlignmentInput(row: AlignmentInput): void {
  if (!row.internalId.trim()) throw new Error("internalId is required (labelled product-generated)");
  if (!row.moetSubject.trim() || !row.moetGrade.trim()) throw new Error("moetSubject and moetGrade are required");
  if (!row.yeuCauCanDatVerbatim.trim()) throw new Error("verbatim MOET text is required; AI must never invent it (T1)");
  if (row.verification !== undefined && !(VERIFICATIONS as readonly string[]).includes(row.verification)) {
    throw new Error(`unknown verification: ${row.verification}`);
  }
  if (row.degree !== undefined && !(DEGREES as readonly string[]).includes(row.degree)) {
    throw new Error(`unknown degree: ${row.degree}`);
  }
  if (row.degree === "deferred" && !(row.deferredRoadmap ?? "").trim()) {
    throw new Error("deferred rows require a later-attainment roadmap");
  }
}

export async function createAlignmentRow(pool: Pool, familyId: string, gradeProgramId: string, row: AlignmentInput): Promise<{ id: string }> {
  validateAlignmentInput(row);
  const own = await pool.query(
    "SELECT gp.id FROM grade_programs gp JOIN programs p ON p.id = gp.program_id WHERE gp.id = $1 AND p.family_id = $2",
    [gradeProgramId, familyId],
  );
  if (own.rows.length === 0) throw new Error("grade program not found");
  const r = await pool.query(
    `INSERT INTO alignment_rows(grade_program_id, internal_id, moet_subject, moet_grade, moet_level,
      moet_strand, moet_topic, yeu_cau_can_dat_verbatim, paired_noi_dung, source_locator,
      competency_refs, homeschool_content, official_hours, allocated_hours, verification, degree,
      deferred_roadmap, confirmed, provenance)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12,$13::jsonb,$14::jsonb,$15,$16,$17,false,$18::jsonb)
     RETURNING id`,
    [
      gradeProgramId, row.internalId, row.moetSubject, row.moetGrade, row.moetLevel ?? "",
      row.moetStrand ?? "", row.moetTopic ?? "", row.yeuCauCanDatVerbatim, row.pairedNoiDung ?? "",
      JSON.stringify(row.sourceLocator ?? {}), JSON.stringify(row.competencyRefs ?? []),
      row.homeschoolContent ?? "", JSON.stringify(row.officialHours ?? {}),
      JSON.stringify(row.allocatedHours ?? {}), row.verification ?? "observation",
      row.degree ?? "chua_bao_phu", row.deferredRoadmap ?? "",
      JSON.stringify({ internal_id_label: "product-generated, not a MOET code" }),
    ],
  );
  await logAudit(pool, familyId, "alignment.create");
  return { id: r.rows[0].id as string };
}

export async function confirmAlignmentRow(pool: Pool, familyId: string, id: string): Promise<void> {
  const r = await pool.query(
    `UPDATE alignment_rows ar SET confirmed = true FROM grade_programs gp JOIN programs p ON p.id = gp.program_id
     WHERE ar.id = $1 AND ar.grade_program_id = gp.id AND p.family_id = $2`,
    [id, familyId],
  );
  if (r.rowCount === 0) throw new Error("alignment row not found");
  await logAudit(pool, familyId, "alignment.confirm");
}

export type MatrixRow = {
  internal_id: string;
  internal_id_label: string;
  moet_subject: string;
  moet_grade: string;
  moet_level: string;
  moet_strand: string;
  moet_topic: string;
  yeu_cau_can_dat_verbatim: string;
  paired_noi_dung: string;
  source_locator: unknown;
  homeschool_content: string;
  official_hours: unknown;
  allocated_hours: unknown;
  allocated_hours_label: string;
  verification: string;
  degree: string;
  degree_label: string;
  deferred_roadmap: string;
};

export function toMatrixRow(r: Record<string, unknown>): MatrixRow {
  return {
    internal_id: r["internal_id"] as string,
    internal_id_label: "product-generated, not a MOET code",
    moet_subject: r["moet_subject"] as string,
    moet_grade: r["moet_grade"] as string,
    moet_level: (r["moet_level"] as string) ?? "",
    moet_strand: (r["moet_strand"] as string) ?? "",
    moet_topic: (r["moet_topic"] as string) ?? "",
    yeu_cau_can_dat_verbatim: r["yeu_cau_can_dat_verbatim"] as string,
    paired_noi_dung: (r["paired_noi_dung"] as string) ?? "",
    source_locator: r["source_locator"] ?? {},
    homeschool_content: (r["homeschool_content"] as string) ?? "",
    official_hours: r["official_hours"] ?? {},
    allocated_hours: r["allocated_hours"] ?? {},
    allocated_hours_label: "family-assigned, not MOET-prescribed",
    verification: r["verification"] as string,
    degree: r["degree"] as string,
    degree_label: "product taxonomy, not a MOET field",
    deferred_roadmap: (r["deferred_roadmap"] as string) ?? "",
  };
}

export async function renderMatrix(pool: Pool, familyId: string, gradeProgramId: string): Promise<MatrixRow[]> {
  const own = await pool.query(
    "SELECT gp.id FROM grade_programs gp JOIN programs p ON p.id = gp.program_id WHERE gp.id = $1 AND p.family_id = $2",
    [gradeProgramId, familyId],
  );
  if (own.rows.length === 0) throw new Error("grade program not found");
  // Unconfirmed rows never render (T1).
  const rows = await pool.query(
    "SELECT * FROM alignment_rows WHERE grade_program_id = $1 AND confirmed = true ORDER BY moet_subject, moet_grade, internal_id",
    [gradeProgramId],
  );
  return rows.rows.map(toMatrixRow);
}
