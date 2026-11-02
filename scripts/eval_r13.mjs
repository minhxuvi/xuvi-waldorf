// R13 exploratory comparison — OFFLINE evaluation harness, not a product
// feature. Pairs two unfamiliar stories (A/B), records which arm each
// attempt used, and writes a blinded review sheet (file only) for an
// independent teacher to score. Results never enter the product surface.
//
// Usage: node scripts/eval_r13.mjs <out.json>   (reads fixtures below)
import { writeFileSync } from "node:fs";

const ARMS = [
  { arm: "X", story: "Con Dế", prep: "XuVi Story (bản đồ + tranh gợi nhớ)", retelling: "Ngày xưa có một con dế sống dưới gốc tre. Một hôm dế đi tìm bạn." },
  { arm: "Y", story: "Chim Sâu", prep: "Chỉ đọc văn bản", retelling: "Có một chú chim sâu chăm chỉ bắt sâu mỗi sáng." },
];

function blinded(rows) {
  return rows.map((r, i) => ({ blindId: `R${i + 1}`, retelling: r.retelling, prep: "[ẩn — chấm xong mới mở]", arm: "[niêm phong]" }));
}

const sheet = {
  protocol: "R13 exploratory comparison (evaluation-only; not proof of effectiveness)",
  arms: ARMS.map((a) => ({ arm: a.arm, story: a.story, prep: a.prep })),
  reviewSheet: blinded(ARMS),
  criteria: ["độ đầy đủ chi tiết thiết yếu", "ngôn ngữ sinh động/mạch lạc", "phù hợp lứa tuổi", "cách kể (nhịp, ngừng, biểu cảm)"],
  note: "Giáo viên chấm độc lập từng bản kể theo cùng tiêu chí, không biết bản nào thuộc nhóm nào.",
};

const out = process.argv[2] ?? "/tmp/r13-sheet.json";
writeFileSync(out, JSON.stringify(sheet, null, 2));
console.log(`R13 sheet written to ${out} (file only — never surfaced in product)`);
