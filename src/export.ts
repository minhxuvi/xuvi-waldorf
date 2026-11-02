// Server-rendered print/PDF for all six documents (Task 8).
// Every export carries the planning/evidence disclaimer (T7) and
// provenance labels (T8); no scores, no official-recognition claims.
import type { Pool } from "pg";
import { renderMatrix } from "./alignment.js";
import { listJournal } from "./journal.js";
import { renderWeek } from "./timetable.js";

export const DISCLAIMER =
  "Tài liệu này do gia đình lập kế hoạch và lưu bằng chứng học tập; không phải hồ sơ nộp cơ quan, không thay thế xác nhận chính thức.";

const CSS = `@page{size:A4;margin:15mm}body{font-family:sans-serif;font-size:12px;color:#111}
h1{font-size:20px}h2{font-size:15px}table{border-collapse:collapse;width:100%;margin:8px 0}
th,td{border:1px solid #555;padding:4px 6px;text-align:left;vertical-align:top}
.disclaimer{border:1px solid #555;background:#f4f4f4;padding:6px;margin:10px 0;font-size:11px}
.prov{font-size:10px;color:#444}.pagebreak{page-break-before:always}
@media print{.noprint{display:none}}`;

function shell(title: string, body: string): string {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body><h1>${esc(title)}</h1><div class="disclaimer">${DISCLAIMER}</div>${body}</body></html>`;
}

function esc(s: unknown): string {
  return String(s ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function kv(label: string, value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "—");
  return `<p><b>${esc(label)}:</b> ${esc(text || "—")}</p>`;
}

export async function renderProgramDoc(pool: Pool, familyId: string, programId: string): Promise<string> {
  const r = await pool.query("SELECT * FROM programs WHERE id = $1 AND family_id = $2", [programId, familyId]);
  if (r.rows.length === 0) throw new Error("program not found");
  const p = r.rows[0] as Record<string, string>;
  const prov = `<p class="prov">Nguồn cấu hình: gia đình chọn (D1–D4). Nội dung dẫn từ corpora tham khảo — không phải chuẩn chính thức.</p>`;
  return shell("Chương trình giáo dục tổng thể", prov + kv("Triết lý", p["philosophy"]) + kv("Mục tiêu", p["goals"]) + kv("Phẩm chất", p["qualities"]) + kv("Năng lực", p["competencies"]) + kv("Lĩnh vực", p["areas"]) + kv("Phương pháp", p["methods"]) + kv("Đánh giá", p["assessment"]) + kv("Trạng thái", p["status"]));
}

export async function renderGradeDoc(pool: Pool, familyId: string, gradeId: string): Promise<string> {
  const r = await pool.query(
    "SELECT gp.* FROM grade_programs gp JOIN programs p ON p.id = gp.program_id WHERE gp.id = $1 AND p.family_id = $2",
    [gradeId, familyId],
  );
  if (r.rows.length === 0) throw new Error("grade program not found");
  const g = r.rows[0] as Record<string, unknown>;
  const rawSubjects = g["subjects"];
  const subjects = (typeof rawSubjects === "string" ? JSON.parse(rawSubjects) : (rawSubjects ?? [])) as unknown[];
  const prov = `<p class="prov">Giờ chính thức (tiết/năm) là số liệu MOET; giờ phân bổ là của gia đình — không trình bày giờ gia đình như giờ MOET quy định.</p>`;
  return shell(`Chương trình chi tiết — ${String(g["grade"])}`, prov + kv("Khối lớp", g["grade"]) + kv("Mục tiêu", g["objectives"]) + kv("Nội dung", g["content"]) + kv("Môn học", subjects.map((s) => JSON.stringify(s)).join("; ")) + kv("Giờ chính thức (MOET)", g["official_hours"]) + kv("Giờ phân bổ (gia đình)", g["allocated_hours"]) + kv("Học liệu", g["materials"]));
}

export async function renderMatrixDoc(pool: Pool, familyId: string, gradeId: string): Promise<string> {
  const rows = await renderMatrix(pool, familyId, gradeId);
  const trs = rows
    .map(
      (m) =>
        `<tr><td>${esc(m.moet_subject)}<br>${esc(m.moet_grade)}</td><td>${esc(m.yeu_cau_can_dat_verbatim)}<br><span class="prov">${esc(JSON.stringify(m.source_locator))}</span></td><td>${esc(m.homeschool_content)}</td><td>${esc(m.allocated_hours_label)}: ${esc(JSON.stringify(m.allocated_hours))}</td><td>${esc(m.verification)}</td><td>${esc(m.degree)}<br><span class="prov">${esc(m.degree_label)}</span><br>${esc(m.deferred_roadmap)}</td></tr>`,
    )
    .join("");
  const head = `<p class="prov">Mã hàng là mã nội bộ (${rows.length > 0 ? esc(rows[0].internal_id_label) : "product-generated, not a MOET code"}); chỉ hàng đã được gia đình xác nhận mới hiển thị. Mức độ liên thông là phân loại nội bộ của sản phẩm.</p>`;
  return shell("Bảng đối sánh chương trình GDPT", head + `<table><tr><th>Môn / Lớp (MOET)</th><th>Yêu cầu cần đạt (nguyên văn MOET)</th><th>Nội dung homeschool</th><th>Thời lượng</th><th>Cách kiểm chứng</th><th>Mức độ</th></tr>${trs}</table>`);
}

export async function renderYearPlanDoc(pool: Pool, familyId: string, yearPlanId: string): Promise<string> {
  const r = await pool.query(
    "SELECT yp.* FROM year_plans yp JOIN programs p ON p.id = yp.program_id WHERE yp.id = $1 AND p.family_id = $2",
    [yearPlanId, familyId],
  );
  if (r.rows.length === 0) throw new Error("year plan not found");
  const y = r.rows[0] as Record<string, string>;
  return shell(`Kế hoạch năm học — ${y["year_label"]}`, `<p class="prov">Nhịp năm do gia đình chọn (${esc(y["rhythm_provenance"] || "—")}); các nhịp Waldorf trong corpora mâu thuẫn nhau (C2) nên không áp đặt mặc định.</p>` + kv("Số tuần học", y["weeks_total"]) + kv("Tuần lễ hội", y["festival_weeks"]) + kv("Chủ đề tháng", y["monthly_themes"]) + kv("Hoạt động trải nghiệm", y["activities"]) + kv("Lịch đánh giá", y["assessment_schedule"]) + kv("Dự phòng", y["contingency"]));
}

export async function renderTimetableDoc(pool: Pool, familyId: string, yearPlanId: string, week: number): Promise<string> {
  const days = await renderWeek(pool, familyId, yearPlanId, week);
  const names = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];
  const tables = days
    .map((d) => {
      const trs = d.slots
        .map((s) => {
          const r = s as Record<string, string | number>;
          return `<tr><td>${r["start_min"]}–${r["end_min"]}</td><td>${esc(String(r["content"]))}</td><td>${esc(String(r["owner"]))}</td><td>${esc(String(r["kind"]))}</td><td>${r["planned_minutes"]}/${r["actual_minutes"] ?? "—"}</td></tr>`;
        })
        .join("");
      return `<h2>${names[d.day]} — tổng ${d.total} phút (học tập ${d.instructional} phút)</h2><table><tr><th>Giờ</th><th>Nội dung</th><th>Người phụ trách</th><th>Loại</th><th>Kế hoạch/Thực tế (phút)</th></tr>${trs}</table>`;
    })
    .join("");
  return shell(`Thời khóa biểu — tuần ${week} (mẫu 08:00–15:00, T2–T6)`, `<p class="prov">Phân biệt giờ học tập với sinh hoạt/thói quen qua cột Loại.</p>` + tables);
}

export async function renderJournalDoc(pool: Pool, familyId: string, childId: string): Promise<string> {
  const entries = await listJournal(pool, familyId, childId);
  const trs = entries
    .map((e) => {
      const e2 = e as Record<string, string>;
      return `<tr><td>${esc(e2["entry_date"])}</td><td>${esc(e2["content_delivered"])}</td><td>${esc(e2["attendance"])}</td><td>${esc(e2["assessment_notes"])}</td><td>${esc(e2["assignments"])}</td><td>${esc(e2["progress_notes"])}</td></tr>`;
    })
    .join("");
  return shell("Nhật ký dạy học và hồ sơ đánh giá", `<table><tr><th>Ngày</th><th>Nội dung</th><th>Điểm danh</th><th>Nhận xét</th><th>Bài tập</th><th>Tiến bộ</th></tr>${trs}</table>`);
}
