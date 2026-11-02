# 02. Research Synthesis: A Product for Waldorf-Inspired Homeschooling in Vietnam

> Status: APPROVED — reviewer replied `APPROVE` on 2026-11-03. Phase 3 (Implementation Plan) authorized.
> Source of truth for intent: [Master Prompt](/Users/moc/Projects/xuvi-waldorf/specs/00_master_prompt.md).
> Plan executed: [Research Plan](/Users/moc/Projects/xuvi-waldorf/specs/01_research_plan.md) (`APPROVE`, 2026-11-03).
> Method: for each R item, finding + evidence citation (file section/page or URL) + constraint. Where sources conflict, the conflict is named, not merged.

## 0. Confirmed defaults and how to read this document

The following were confirmed at `APPROVE` time and are treated as settled in this synthesis:

| Decision | Confirmed default |
|---|---|
| Research span | Mầm non (ages 2–7) through lớp 12. The v1 UI may narrow this later; research does not. |
| First language | Vietnamese first for UI and generated documents; English supported for stories and prompts. |
| R13 comparison | Evaluation-only. Not a product feature and not proof of learning effectiveness. |
| A1–A3 | Confirmed: primary user is the teacher (parent or other educator); children are not direct app users (screen-free telling); families want Waldorf pedagogy *and* a defensible MOET alignment mapping. |
| `tmp/` clearance | Reviewer created all `tmp/` files and clears them for use without copyright concern. Provenance caveats in R23 still constrain what may be claimed, but not whether the files may be read. |
| Models | Workers ran on `muse-spark-1.3-contributor`; critic and this synthesis on `muse-wonder-1.0`. See Deviations for the data-use note this creates. |

**Reading guide.** Section 1 gives key findings per R1–R24 (or explicit unresolved + blocker). Section 2 collects technical constraints. Section 3 gives architectural recommendations including the recommended stack. Section 4 is the ten-product verdict table. Section 5 sketches the shared content model for the six documents. Section 6 is the explicit unresolved list. Section 7 records deviations from the approved execution setup.

**Completeness honesty.** Every worker returned `complete: true` in its own structured result, yet R5–R7, R17–R19, and R22–R24 carry material unresolved items, and the adversarial critic (prior result 7) flagged an overclaim pattern across workstreams. This synthesis follows the evidence, not the `complete` flags: items the critic showed to be uninspected, second-hand, or internally contradictory are marked unresolved here even where the originating worker did not.

---

## 1. Key findings

### 1.1 Waldorf pedagogy (R1–R4) — workstream 1

**R1 — Waldorf structure to encode.**
Three local corpora encode a recognisably Waldorf structure, with different bandings:

- Classical corpus (`tmp/01-Waldorf-co-dien-lop-1-12.md:26-46,230-244,1837-2070,2035,2504,2735`): stages *thiếu nhi* (lớp 1–8) then *tuổi mới lớn* (lớp 9–12). Year = 36 teaching weeks + 4 festival weeks = 40 weeks ("Nhịp 40 tuần"). Main-lesson rhythm = multi-week thematic blocks (3–5 weeks) in the morning main lesson, plus year-round continuous strands (foreign language, music, painting/handwork, eurythmy, drama).
- Nhà Thuận Nhiên / NTN corpus (`tmp/03-Nha-Thuan-Nhien-mam-non-lop-12.md:315-330,1034-1055,3205-3210`): early-childhood group vs. school group; 45-minute periods at lớp 1 (10–20 tiết of 45′) and 30-minute mầm non tiết (e.g. outdoor play 5×30 min, 08:30–09:00 Mon–Fri).
- Cambridge corpus (`tmp/02-Waldorf-Cambridge-lop-1-12.md:26-46,222-225`): phases primary-1..6 / foundation / IGCSE-1–2 / AS / A2 layered over Waldorf blocks.

Methods shared across corpora: story-first literacy (*nghe kể → tưởng tượng → vẽ → nhận diện chữ → tập viết*), no rote / no workbooks early, form drawing before writing, wet-on-wet watercolor, beeswax modelling, eurythmy. Subjects widen by age (folktale/number/form in lớp 1–2; farm/house/crafts lớp 3; Norse myth lớp 4; ancient civilisations lớp 5; Rome/physics lớp 6; Renaissance lớp 7; revolutions lớp 8; modern literature + algebra lớp 9; systems lớp 10–12).

Hours are expressed in two incompatible units: main-lesson blocks in *weeks*, continuous strands in *periods per week* (e.g. English 2/wk oral, music/art/eurythmy 2/wk, drama 1/wk), and NTN in clock minutes. Any shared model must store all three and never silently convert between them (see Conflict C2).

Assessment: no conventional tests early; the main-lesson book (*vở bài học chính*) is the central artifact from lớp 1, with oral retelling and teacher observation. Qualitative narrative evaluation is endorsed at upper grades.

**R2 — Grade/age coverage and corpus conflicts.**
Coverage is asymmetric, and this is the single largest product-shaping finding in R1–R4:

- `tmp/01` spans lớp 1–12 only (12 documents, no mầm non).
- `tmp/02` spans lớp 1–12 only, with exam-phase banding (IGCSE lớp 9–10, AS lớp 11, A2 lớp 12) and per-block `examStatus` (82 waldorf-only, 16 IGCSE, 6 AS, 7 A2 rows).
- Only NTN (`tmp/03`) covers mầm non 2–7 through lớp 12 (18 documents), but with **five overlapping mầm non presentations** (MN 2–3; MN 3–5 lớp ghép; MN nhỏ 3–5; MN lớn 5–7; MN 5–7 bản nguồn ẩn incl. hidden sheets).

Named conflicts (not merged — see also §2, Conflicts C1–C4):

- **C-a (MN existence):** mầm non exists only in NTN. The product span "mầm non–lớp 12" therefore rests on a single corpus for ages 2–7.
- **C-b (exam phases vs. Waldorf content):** `tmp/02` exam phases (IGCSE/AS/A2) sit against `tmp/01` *tuổi mới lớn* content (Faust, art history, economics). No corpus states which takes precedence per grade.
- **C-c (stale content):** `tmp/02` header states `examStatus` is internal only; lớp 3 still lists craft/mộc while the live schedule changed block 13 to Xe đạp (10/10/2026). Corpus content can lag lived practice.
- **C-d (data quality):** NTN audit reports 10 ERROR + 39 REVIEW + 2 VARIATION (date serials, `pending_confirmation`, blanks never auto-filled). NTN is the most complete corpus and the least clean.

**R3 — Vietnamese localisation.**
Localisation is already substantive in the corpora, not an afterthought:

- Folktales: Vietnamese tales prioritised *before* Grimm equivalents (`tmp/01` detail note); lớp 1 milestone is retelling Vietnamese folktales; later local material includes homeland stories and ethnic-minority tales (`tmp/01:41-55,164-172,230-233,367-375,513-532`).
- Language: 29-letter Vietnamese alphabet via story-images in lớp 1; mầm non circle time uses *ca dao / đồng dao* for "tinh thần quê hương".
- Festivals: Tết, Trung thu, hội xuân, khai giảng, Tết Đoan Ngọ, Lễ hội ánh sáng 23/12, Lễ Tạ Ơn, Phục Sinh, Giáng Sinh across the 4 festival weeks + NTN monthly blocks.
- Handwork: watercolor, beeswax, knit/crochet, sewing, woodwork, pottery, gardening, bread/bánh baking.

Conflict **C-e (foreign-language timing):** `tmp/02` adds English-immersion festival elements and bilingual stories from lớp 2, and NTN teaches Tết English vocabulary, while `tmp/01` delays English/Chinese to oral-only until lớp 4 read-write (`tmp/02:41,243-247`; `tmp/03:127-141,344-349,857-975,1986-1999`). The product must expose foreign-language timing as a family choice, not pick a corpus silently.

**R4 — Assessment without conventional testing.**
Corpus evidence supports four mechanisms (`tmp/03:322,461,570,577,851,3210,3740`; `tmp/01:2035,2504,2060,2735`):

1. Daily teacher observation (e.g. NTN mầm non "trẻ chơi tự do ngoài trời và có quan sát"; sitting-still observed as a self-regulation signal, explicitly *not* a metric per audit).
2. The main-lesson book as central artifact, via a Monday review + write/draw routine; presenting it is a listed skill.
3. Oral retelling / performance as evidence.
4. Periodic narrative reports, not scores; lớp 12 via final work + panel.

**Explicit gap (critic-confirmed):** no corpus specifies a journal schema (dates / attendance / artifacts / notes fields), a reporting cadence, or how delayed academics are evidenced (no memorised addition before age 7; oral-only foreign language to lớp 3/4). Readiness signs (ear-touch, tooth change) are reference-only, never pass/fail. Consequently the Document-6 fields used in R15 rest on the master prompt's six-row table (`specs/00_master_prompt.md:13`), not on Waldorf evidence. The product must present Document 6 as a planning/recording tool the family configures, not as a Waldorf-prescribed schema.

### 1.2 MOET curriculum, alignment, and legal context (R5–R7) — workstream 2 + gap follow-up

**R5 — MOET GDPT 2018 (TT32) structure.**
Grounded in direct extraction from the local 1,555-page PDF (`tmp/01-GDPT2018-TT32-day-du-1555-trang-khong-watermark.pdf`, 15,022,313 bytes) with PDF-page citations:

- Two stages: cơ bản (lớp 1–9) and định hướng nghề nghiệp (lớp 10–12); 35 tuần thực học/năm. *Chương trình tổng thể* (PDF pp.4–37) + 27 phần môn/HĐGD (subject sections at PDF pp.57, 167, 290, 349, 377, 476, 558, 632, 722, 760, 816, 881, 939, 1024, 1076, 1154, 1185, 1232, 1250, 1304, 1335, 1375, 1426, 1463, 1520).
- Competency framework (*Chương trình tổng thể* III, PDF p.10, printed p.7): 5 phẩm chất (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm), 3 năng lực chung (tự chủ–tự học; giao tiếp–hợp tác; giải quyết vấn đề–sáng tạo), 7 năng lực đặc thù (ngôn ngữ, tính toán, khoa học, công nghệ, tin học, thẩm mĩ, thể chất). Specific *yêu cầu cần đạt* at Mục IX + per-subject section IV.
- Every subject follows a standard structure: Đặc điểm → Quan điểm → Mục tiêu (chung + từng cấp) → Yêu cầu cần đạt → Ngữ liệu gợi ý → Phương pháp → Đánh giá (exemplar: Ngữ văn, PDF pp.58–62).
- Assessment (VI.2, PDF pp.35–36, printed 32–33): basis = *yêu cầu cần đạt*; object = product **and** process (portfolio-compatible); qualitative + quantitative, thường xuyên + định kì. This is structurally compatible with Waldorf observation/artifact assessment, which is what makes an honest alignment matrix possible at all.
- Subject hours at official granularity only (see R5-hours below).

**R5 outcome granularity — RESOLVED by follow-up (prior result 8).**
This was the named blocker for R14/R6 and is now closed by direct full-text inspection (`uv run --with pypdf`, 1,555 pages):

- **No MOET outcome codes exist.** Search found 0 hits for `NV1` / `NV1-DOC-03` and 0 "Mã yêu cầu" codes, while "Yêu cầu cần đạt" appears on 811 pages as uncoded prose. The earlier R6 example `NV1-DOC-03` is therefore a **product-invented identifier, not MOET**. Any `AlignmentRow.internal_id` (e.g. `NV-L1-DOC-001`) must be labelled internal / product-generated, never presented as an official code.
- **Granularity = one verbatim bullet.** Each subject has (a) section IV *Yêu cầu cần đạt*: general + by-level (cấp) prose by competency component (e.g. Toán IV tables *Thành phần năng lực × Cấp* tiểu học/THCS/THPT, PDF pp.176–177, printed 10–11; Ngữ văn IV, PDF pp.64–66, printed 8–10); and (b) section V *Nội dung giáo dục* per grade as a two-column *Nội dung | Yêu cầu cần đạt* table under strand/topic headings with atomic bullets (e.g. Ngữ văn Lớp 1 ĐỌC > KĨ THUẬT ĐỌC "Tốc độ đọc khoảng 40–60 tiếng/1 phút", PDF pp.74–76, printed 18–20; Toán Lớp 1 Số và phép tính / Hình học và Đo lường, PDF pp.188–189, printed 22–23). The alignment-row unit is therefore one bullet.
- **Subject-hours granularity = tiết/năm/subject/grade only** at official level (*Chương trình tổng thể* tables, 35 tuần thực học/năm, PDF p.10): tiểu học PDF p.12/printed 9 (Tiếng Việt 420/350/245/245/245 for lớp 1–5; Toán 105/175/175/175/175; totals 875/875/980/1050/1050; 25–30 tiết/tuần), THCS PDF p.14/printed 11 (Ngữ văn/Toán/KHTN 140; totals 1015/1015/1032/1032), THPT PDF p.16/printed 13 (Ngữ văn/Toán/NN1 105; môn lựa chọn 70; chuyên đề 105; total 1015). No per-topic or per-outcome official hours exist.
- **Finer hours are only % estimates** per strand in some subject programs, e.g. Toán "Thời lượng" (PDF pp.286–287, printed 120–121): per-grade totals 105/175/140/105 for lớp 1–12 plus % per mạch (Lớp 1: 80% Số/Đại số, 15% Hình học–Đo lường, 0% Thống kê–Xác suất, 5% Thực hành–trải nghiệm); Ngoại ngữ 2 totals e.g. 735 tiết = 105/năm (PDF pp.1332, 1373).

**R5 currency caveat — UNRESOLVED.** The local PDF contains only the curriculum (first 3 PDF pages blank); TT32 Điều 2 (grade/year roadmap) and Điều 3 (effective date) are absent. `thuvienphapluat` fetch returned 403 and MOET timed out, so "Còn hiệu lực" status and the reported GDPT revision timeline (secondary AI-written source `asiadaily.org/news/17082`: revision done 2026, unified textbooks 2027, free 2028–2029) are **not verified against an official source**. TT32 is cited continuously into 2025–2026 (e.g. IJLTER curriculum-reform paper citing `moet.gov.vn` CT-GDPT-Tổng-Thể ItemID=8421), but this synthesis does not assert currency beyond "the framework the local PDF encodes". Official cross-check is carried to the unresolved list.

**R6 — Alignment method.**
A matrix is directly feasible once the granularity above is respected:

- One row = one verbatim *yêu cầu cần đạt* bullet ↔ homeschool content ↔ allocated time ↔ verification method ↔ degree of alignment.
- Verification values should follow VI.2 (observation, artifact/product, oral questioning, periodic task), which matches Waldorf evidence types — this is the honest bridge between the two systems.
- Degree values (*đầy đủ / một phần / deferred / tiếp cận khác / chưa bao phủ*) are a **product taxonomy**, grounded in VI.2's "đánh giá căn cứ yêu cầu cần đạt, đối tượng sản phẩm + quá trình" (PDF pp.35–36), not MOET fields. They must be labelled as such in the UI and export.
- Honesty rule: Waldorf-delayed outcomes (e.g. formal reading/writing in lớp 1) must be recordable as *deferred* with a public later-attainment roadmap. Assigning early attainment to match MOET pacing would misrepresent both systems.
- Two distinct hours fields are mandatory: `official_hours {tiet_per_year_subject_grade, optional strand_percent}` vs. `allocated_hours_product {tiet assigned by family/product}`. Allocated hours must never be rendered as MOET-prescribed.

What remains open in R6 is content, not structure: filling the *deferred* column requires Waldorf age-band inputs from R1–R4 (e.g. when delayed reading/writing actually lands per corpus). That fill-in is Phase 3 work, not a research blocker.

**R7 — Legal/regulatory context.**
Finding, stated with the uncertainty the evidence supports:

- Homeschooling as a *replacement* for school "has yet to gain official recognition from the Vietnamese education system" (VJE 2024 8(1):51–59, doi:10.52296/vje.2024.355; n=10, CC-BY; full text read via pypdf). The "~70k-member Facebook group" figure (dẫn Trong Nhân 2022) is unverified independently and is not relied on.
- Law does not directly prohibit family education but places duties on families framed as *cooperation with the school*: Điều 90, Luật Giáo dục 43/2019/QH14 (create conditions to complete compulsory education; participate/coordinate with the school). No provision recognises home education as a substitute. Verified on the English text at `english.luatvietnam.vn` (Điều 90/91 body, lines 3560–3580).
- Compulsory scope is expanding: Luật 43/2019 Điều 14 (primary compulsory; universal mầm non 5 tuổi + THCS; Điều 14.4 family duty) → Luật 123/2025/QH15 amends Điều 14.1 to "Primary education and lower secondary education are compulsory education", universal mầm non 3–6 tuổi, effective 01/01/2026, Government to detail (Điều 14 lines 2618–2628; amendment line 2507; effective line 2851, `english.luatvietnam.vn`). Điều 89: the school leads universal-education work (*phổ cập*).

**Legal overclaim guard (critic-confirmed).** Non-recognition rests on a small-n study, an English translation of Điều 90/91, and a 2025 amendment whose implementing detail is delegated. No Công báo / primary Vietnamese legal text was inspected. The product therefore must be positioned as family **planning and evidence** tooling with a visible disclaimer, and must never claim legal filing, certification, or official recognition. Any stronger legal statement is unresolved.

**R7 currency flag.** Same unresolved official cross-check as R5 (above). Unverified leads (Đà Nẵng 2026 case via `thevietnamese.org` — timeout; Nghị định 20/2014 *phổ cập* assessment via guardians) are named as follow-ups, not findings.

### 1.3 XuVi Story (R8–R13) — workstream 3

Evidence base for this whole subsection is intentionally narrow and must be read as such: the 31-line local product note `tmp/xuvistory.md` (2,946 bytes, verified) plus the mandate bullet in `specs/00_master_prompt.md:4`. These are **requirements, not research findings**. No external Waldorf storytelling triangulation was completed, and no segmentation / illustration / STT accuracy evidence was gathered. The critic flagged this thinness explicitly; Phase 3 must not treat R9–R12 as validated pedagogy.

**R8 — End-to-end practice loop.**
Mandate anchor: "upload a story, divide it into memorable scenes, generate age-appropriate watercolor/crayon illustrations per scene, record a retelling, and provide comparative feedback" (`specs/00_master_prompt.md:4`). The local note expands this into a closed loop (`tmp/xuvistory.md:23-31`):

1. **Story library:** accepts DOC/DOCX, PDF, HTML, Markdown, plain text; parent reviews extracted text and reads in-app; source + usage-rights stored per story (line 23).
2. **Audience settings:** listener age, language, context + the teacher's personal practice goal (line 24).
3. **Story map:** editable key scenes, characters, essential details; chapters kept connected for longer stories (line 25).
4. **Visual + practice:** generate or upload per-scene images in a chosen style; rehearse with image prompts, gradually hide them, or tell freely. Images support teacher preparation; children do not need the app — telling is screen-free (lines 26–27, goal line 3; consistent with confirmed A2).
5. **Record / feedback / history:** recording → replay → transcript correction → retry; history compares attempts under labelled conditions plus an optional seven-day rhythm; private-by-default, export/delete, AI-data disclosure (lines 28–31).

**R9 — Scene segmentation.**
Requirement: preserve key events, relationships, causes, and culturally meaningful details *without* requiring word-for-word recall; the parent edits scenes/characters/details; long stories keep chapters connected (`tmp/xuvistory.md:16,25`). This matches confirmed A11 (semi-automatic: AI proposes, parent edits). No accuracy evidence for any segmenter on Vietnamese folktales exists yet — segmentation quality is an open empirical question for Phase 4 prototyping, not a settled capability.

**R10 — Illustration generation.**
Requirement: wet-on-wet watercolor, wax crayon, colored pencil, or other styles; review for cultural accuracy + age suitability; replace by keywords or by the teacher's own sketches/uploads (`tmp/xuvistory.md:26`). The parent review gate is mandatory, not optional polish: generated imagery for young children and culturally specific tales cannot ship unreviewed (see R21).

**R11 — Retelling capture and transcription.**
Requirement: record *or* upload audio, replay, correct the transcript; label each attempt With/Without image prompts; track text or keyword assistance separately (`tmp/xuvistory.md:28`). The correction UI is load-bearing: it is the mitigation for unknown Vietnamese STT error rates (R19) and must exist in v1, not as a later refinement.

**R12 — Comparative feedback.**
Comparison target: the retelling vs. the *selected story version* + story map. The evaluator must distinguish omissions from intentional adaptations, and judge (`tmp/xuvistory.md:15-19,29`):

- Fidelity (missing/altered essential details);
- Vivid language / coherence / imagination space left for the listener;
- Age fit (age, needs, language, length, emotional intensity);
- Delivery (clarity, pacing, pauses, vocal expression) — judged **from the recording, not the transcript alone**.

Output form is fixed: strengths + missing/altered details + **one** practical next step, with excerpts or timestamps. **No overall score or ranking** (line 19; consistent with A7). Any design that collapses feedback into a score violates the confirmed requirement.

Delivery judgement creates a hard technical dependency: it needs timing/pause information from audio. As R17/R18(v) show, the leading STT candidate provides only turn-level timestamps, so delivery feedback needs a supplement (word timestamps + energy/vad analysis). This is a constraint, not a preference (§2).

**R13 — Evaluation validity.**
Protocol already sketched locally (`tmp/xuvistory.md:7-9`): two unfamiliar stories matched on length/complexity/audience; equal preparation (XuVi Story vs. text alone); retell both without prompts after the same delay; same-criteria evaluation + blinded independent teacher review; separate clip demos for with-image-prompt practice.

Validity boundary is explicit (`tmp/xuvistory.md:11`): this is an **exploratory comparison, not proof of learning effectiveness**, and per the confirmed default it is **evaluation-only** — it must not be surfaced in the product as an efficacy claim, marketing claim, or in-app badge.

### 1.4 The six generated documents (R14–R16) — workstream 4

**R14 — Shared content model.**
One structured source can render all six documents. The entity chain, grounded in both the master prompt's six-row table and corpus structures, is:

`Program (philosophy, goals, competencies, areas, methods, assessment) > GradeProgram (subjects, objectives/outcomes, content, hours, methods, materials) > AlignmentRow (MOET outcome ↔ content, time, verification, degree) > YearPlan (dates, weeks, distribution, monthly themes/projects, activities, assessment schedule, contingency) > TimetableSlot (day, start/end, content, owner, objectives, actual duration, instructional-vs-routine flag) > JournalEntry (date, content, attendance, assessment, assignments, artifacts, notes) + PeriodicReport`

Corpus grounding: classical Lớp-1 YAML carries `weeksTotal: 36, festivalWeeks: 4, blocks[subject/weeks/topic/goals/activities/skills]` (`tmp/01-Waldorf-co-dien-lop-1-12.md`); NTN blocks carry `subject/duration/sourcePeriod/approach/content/skills/sourceRows/status`, e.g. outdoor play 5×30 min 08:30–09:00, circle time 5×5 min 09:45–09:50 (`tmp/03-Nha-Thuan-Nhien-mam-non-lop-12.md`); assessment throughout = observation + *sổ tay / nhật ký*; year rhythm 36+4 = 40 weeks.

**Silent-merge warning (critic-confirmed).** The 36+4 rhythm and the 08:00–15:00 timetable are applied in R14 as if shared, but 36+4 appears only in `tmp/01`, NTN uses 30-minute mầm non periods, and `tmp/02` uses Cambridge exam banding. No corpus-precedence rule exists. The model in §5 therefore stores rhythm, banding, and timetable as *family-chosen configuration*, with corpus provenance per value — it does not hard-code 36+4 or 08:00–15:00 as Waldorf facts. The 08:00–15:00 Mon–Fri shape itself comes from the master prompt (`specs/00_master_prompt.md:12`), which is a product requirement and may be hard-coded as the default template.

**R15 — Per-document requirements.**
Minima are fixed by the six-row table in `specs/00_master_prompt.md:8-13`, including an 08:00–15:00 Mon–Fri timetable distinguishing instructional time from routines, and the journal field set. Per document:

- Owner inputs: family/child profile + grade band; philosophy choices; per-subject objectives/materials; MOET mapping confirmations; year dates/themes/contingency; slot owners + actual durations; journal entries/artifacts/attendance.
- Export: print/PDF minimum for all six.
- Workflow: draft → parent review/edit → lock/export; journal appends continuously with periodic sign-off (per A8 per-family generation and A10 drafting-assistance in `specs/01_research_plan.md`).

Document 6's fields rest on the master prompt, not Waldorf evidence (see R4 gap). Phase 3 should keep them minimal and family-configurable.

**R16 — Generation strategy.**
Deterministic template + structured rendering for: Document 3 matrix, Document 5 timetable, and **all** hours arithmetic (block weeks must sum to 36+4 where that rhythm is chosen; slots must sum within the school day). LLM drafting only for narrative prose in Documents 1/2/4/6.

Hard rule: **AI must never invent hours, MOET outcome text, or alignment degrees.** Grounded in corpus caveats the product must surface, not hide: "not an official standard" (`tmp/01:5`), `examStatus` internal not certification (`tmp/02:5` + waldorf-only rows), `pending_confirmation` + audit ERROR:10 / REVIEW:39 (`tmp/03:5` + appendix Counts). Combined with the R5 finding (verbatim bullets, internal IDs labelled as invented), this means Document 3 renders only parent-confirmed rows over verbatim MOET text.

**R15/R16 deferral chain (critic-confirmed, now mostly closed).** R14–R16 originally deferred (a) MOET outcome granularity to R5 and (b) PDF/print implementation to R20. (a) is now resolved by the gap follow-up (verbatim-bullet granularity, no codes, split hours fields). (b) remains only partially answered: R20 recommends server-rendered PDF with no print-fidelity evidence yet for the wide Document-3 matrix or the Document-5 timetable grid. Print fidelity is a Phase 4 prototype check, listed as unresolved.

### 1.5 Meta products, capability fit, Vietnamese quality (R17–R19) — workstream 5

**Evidence-quality warning (critic-confirmed, load-bearing).** R17 verdicts below cite almost entirely secondary sources (`apidog.com`, `dev.to`, `codersera.com`, `unite.ai`, `prnewswire.com`, `marktechpost.com`, `slator.com`, `together.ai`, `datacamp.com`, vendor blogs). Only SAM 3.1 cites an official Meta source (`ai.meta.com`). No `api.meta.ai` pricing page, data-terms page, or API reference body was directly inspected, which falls short of the plan's evidence contract (`specs/01_research_plan.md:144,194`: open and read every cited source body; URLs preserved). **Every "USE" verdict in this subsection is therefore provisional** and is downgraded in the §4 verdict table to reflect two independent blockers the worker itself found: (i) Meta Model API launched as a US-only public preview with **no source confirming Vietnam access**, and (ii) **no public Vietnamese benchmark** for the LLMs and no per-language Vietnamese WER for the STT. Phase 4 pre-flight must verify Vietnam availability/payment, Standard-tier data terms, and Vietnamese quality by hands-on probe before any "USE" becomes final. Non-Meta fallbacks are named per need so Phase 3 is not blocked on Meta.

**R17 — Identity and availability (per product).**

- **Wonder (`muse-wonder-1.0`):** Meta closed frontier model via Meta Model API (`api.meta.ai/v1`, OpenAI-compatible), $4/1M input + $20/1M output ($0.20 cached), 1M context, multimodal input. "Wonder Full" is Muse Code subscription-only ($50/$200), no API. Sources: `apidog.com/blog/what-is-muse-wonder/`; `dev.to/theglitchfixer` Muse Wonder access/pricing.
- **Spark (`muse-spark-1.3`):** Meta closed multimodal reasoning model, API-only on Meta Model API: $1.25/1M in, $0.15 cached, $4.25/1M out. Contributor tier $0.10/$0.002/$0.20 **but Meta may train on prompts/completions**. $20 free credit. Sources: `codersera.com` Spark 1.3 guide; `aicraftjournal` Spark 1.3 pricing; `techcrunch.com` 2026-09-03 contributor discount.
- **Image (`muse-image-1.0`):** Meta agentic image generation/editing (plans, tools, self-review); via Meta Model API + fal endpoints `meta/muse-image/text-to-image` and `/edit`, $0.01/image, marked commercial use. Sources: `unite.ai` Muse Image on fal; `prnewswire` fal launch release.
- **Voice Transcribe (`muse-voice-transcribe-1.0`, 2026-09-01):** streaming ASR + diarization + endpointing, $3/1000 audio-min ($0.18/hr), live WebSocket + file POST. Vietnamese is among 25 validated languages (70+ trained). **Limit: turn-level timestamps only; no word timestamps, confidence, or emotion.** Sources: `marktechpost` 2026-09-01 release; `slator.com` launch article.
- **SAM 3.1:** unified detection/segmentation/tracking (text + visual prompts, 16-object multiplex, 16→32 fps); open weights (HuggingFace `facebook/sam3.1`) + API `sam-3.1` (~$2.50/1000 images, $0.20/1000 video frames). Sources: `ai.meta.com` SAM3 blog; meta-model-cookbook 07_sam API basics.
- **Spark Open:** 816B-MoE (42B active, 1M context, multimodal-in) open *weights* (not API), released 2026-10-15, custom Muse Model License (not OSI): attribution required, $20M-revenue MaaS clause, usage bans incl. critical infrastructure. Day-0 on Fireworks (US serverless, zero retention) / 7 clouds; self-host ~2TB BF16. Sources: `fireworks.ai/blog/meta-muse-spark-open`; `codersera` Spark Open guide; `zentor.ai` license notes.
- **Glimmer:** 30B dense agentic model, released 2026-08-10, Apache 2.0 (most permissive of the set), 128K+ context, text+image in; **no Meta-hosted API** (self-host on a single 24GB GPU or third-party: Together $0.35/$1.50 per 1M, Fireworks/NVIDIA NIM). 100+ training languages claimed. Sources: `together.ai/models/muse-glimmer`; `datacamp.com` Muse Glimmer; `toolhalla.ai` hosted-vs-openweight.
- **Baseten / Modal / Fireworks:** all **third-party, not Meta**. Baseten managed inference ~$6.50/hr H100 per GPU-minute; Modal serverless GPU ~$3.95/hr H100 per-second (Starter $0 + $30 credit); Fireworks open-model serverless $0.10–0.90/1M. Sources: `runpod.io` Baseten alternatives; `budgetforge.dev` Modal pricing 2026; `devtune.ai` Fireworks AI.
- **Availability:** Meta Model API launched US-only public preview (no EU at launch); **no source confirms Vietnam access** — the key Phase 4 risk. By contrast ChatGPT/Claude/Gemini natively support Vietnam (Claude.ai since 2024). Sources: `marktechpost` Spark 1.1 regional availability; `techtimes` developer API launch; `digitalinasia.com` Asia LLM tracker Oct 2026.

**Privacy-critical distinction:** the Contributor tier's train-on-prompts/completions terms make it **excluded for any child-adjacent data** (retelling audio transcripts, journal text, family documents), regardless of its ~100× price advantage. Only the Standard tier may carry product data, and its retention terms were not directly inspected (unresolved).

**R18 — Capability fit per product need.**

| Need | Leading candidate | Fallback / supplement | Fit note |
|---|---|---|---|
| (i) Story understanding / scene segmentation | Spark | Wonder (quality ceiling); non-Meta Claude/GPT | LLM task; quality on Vietnamese folktale register unproven (R19). |
| (ii) Vietnamese document drafting + feedback text | Spark | Wonder; non-Meta Claude/GPT | Same Vietnamese caveat; deterministic rendering still owns matrix/timetable (R16). |
| (iii) Waldorf-style illustration | Image ($0.01/image) | SDXL/Flux/OpenAI image (`teamday.ai` image models Nov 2026) | Needs style control + mandatory parent review (R10); Vietnamese prompting undocumented — prompt in English, review culturally. |
| (iv) Vietnamese STT | Voice Transcribe ($0.18/hr) | Whisper ($0.006/min = $0.36/hr, word timestamps, 99 langs incl. Vietnamese; `cartesia.ai` Whisper pricing) | Voice Transcribe cheaper and Vietnamese-validated; Whisper wins on timestamps. |
| (v) Delivery analysis (prosody/pauses) | Voice Transcribe **insufficient alone** | Energy/VAD + Whisper word timestamps | Turn-level timestamps cannot judge pacing/pauses (R12). Supplement is mandatory, not optional. |
| (vi) Sketch/photo segmentation | SAM 3.1 — **not used by default** | Revisit only if a cut-out flow survives | No mask-requiring flow exists in R8–R15. |

**R19 — Vietnamese language quality (asymmetric, largely unproven).**

- **STT: strongest leg.** Vietnamese is explicitly 1 of 25 validated languages for Voice Transcribe, with code-switching support. But no per-language Vietnamese WER is published (English ~3% only), so "validated" cannot be converted into an expected error rate. Sources: `digit.in` 70-language article; `justspeaktoit` META_MUSE_VOICE_TRANSCRIBE.md (25-language list, no word timestamps).
- **LLM: weakest leg.** No public Vietnamese benchmark for Spark/Wonder (`benchlm.ai` Spark compare: no multilingual score); Glimmer claims 100+ languages with no Vietnamese figures. Diacritics, tone, children's vocabulary, and folktale-register failure modes are undocumented. The transcript-correction UI (R11) and parent-editable story map (R9) are the designed mitigations; a hands-on Vietnamese probe is still required.
- **Image: undocumented for Vietnamese.** Prompt in English; rely on the R10 cultural-accuracy review gate.

Bottom line: no R18 "USE" for Vietnamese text, feedback, or STT is currently falsified *or* verified. All are Phase 4 probe items.

### 1.6 Stack, cost, provenance, sample corpus (R20–R24) — workstream 6

**R20 — Reference stack.**
The stack is greenfield: the workspace has no `package.json`, `tsconfig`, `pyproject`, `requirements`, or `Dockerfile` (verified by `ls`; cites `.gitignore`, `specs/01_research_plan.md:§3`, `tmp/xuvistory.md:23-31`). Recommended single-family v1:

- TypeScript web monolith (UI + API in one codebase);
- Postgres;
- Object storage for audio/images;
- Server-rendered PDF export;
- Background job queue for AI calls (segmentation, illustration, STT, feedback are all async);
- Single-region managed hosting.

Path to more families: household auth → multi-family tenancy, storage quotas, job concurrency/rate-limiting. PDF/print implementation choice (library, matrix pagination, timetable grid fidelity) is deferred to a Phase 4 prototype — see unresolved.

**R21 — Privacy, safety, rights.**
Already specified locally and confirmed here: private-by-default + export/delete + disclose-when-data-leaves-device (`tmp/xuvistory.md:23,26,31`; `specs/00_master_prompt.md:§1` docs 5–6; plan A1/A2/A13). Recommendations:

- Data minimisation by default; per-story and per-account export/delete;
- Per-AI-action disclosure (the parent sees which service receives text/audio/image, before it is sent);
- Story source + usage-rights metadata fields (mandatory, per R8);
- Mandatory image-review gate before any generated image is used for practice (R10);
- Children are not app users (screen-free telling) — no child accounts, no child-facing surface;
- Document 6 (journal/assessment) is the child-data hotspot and gets the strictest retention/deletion defaults;
- No legal-filing, certification, or official-recognition claims anywhere in UI or exports (R7).

The Contributor-tier exclusion (R17) is part of R21: discounted inference that trains on inputs must never receive child-adjacent data.

**R22 — Cost and operations.**
Text is negligible (largest corpus file 389 KB). Cost drivers, in order:

1. **Audio dominates storage:** ~1–5 MB per 5-minute retelling depending on codec (no codec/bitrate citation was provided — treat as an order-of-magnitude envelope, not a measured figure; critic-flagged as not falsifiable as stated).
2. **Images per scene** (per-story, per-revision).
3. **LLM drafting** is token-driven per call; deterministic renders cost ~zero AI spend.

What breaks first at 10× families: AI-job throughput/rate limits, audio+image storage growth, STT/image latency. Mitigations from v1: quotas, the job queue (R20), and an explicit retention policy. **Absolute dollar figures and free-tier headroom cannot be stated** until R17 vendor selection is finalised in Phase 4; envelopes are formulas (calls × unit price), not totals. This is carried as unresolved rather than estimated over.

**R23 — `tmp/` provenance.**
All corpora were merged 02/11/2026 from `saokhue.xuvi.vn` with per-section SHA-256. Verified mechanically: `git ls-files tmp/` is empty and `.gitignore:5` ignores `/tmp/` — everything in `tmp/` is machine-local and uncommitted. `LICENSE` in the workspace is MIT. Per-corpus status:

- `tmp/01` (classical): explicitly **NOT an official Waldorf/national standard** (header L3–7; "not an official standard", line 5). Research/reference use.
- `tmp/02` (Cambridge): `examStatus` is **internal-only, not certification** (header L3–7, line 5; 112 `examStatus` hits verified by grep); structure-reference-only. Waldorf-only rows must never be presented as exam coverage.
- `tmp/03` (NTN): **single source** (one workbook `.xlsx`), not independent evidence (header L3–7); 6+ `pending_confirmation` rows (L151/985/1382/2036/2642/5538) plus an audit trail (e.g. L156; appendix counts ERROR:10 / REVIEW:39). Whether `pending_confirmation` rows may seed product content or must stay research-only **awaits a reviewer/content-owner decision** — unresolved.
- MOET PDF (15,022,313 bytes): official reference text for R5/R6, subject to the currency caveat in R5.
- No in-file licenses were found in the corpora; product use rests on the reviewer's clearance (confirmed at APPROVE), not on embedded license grants.

Synthesis rule adopted: corpora inform the product's *configurable defaults and reference content with provenance labels*; they are never presented to parents as official standards, certifications, or MOET text.

**R24 — Sample story corpus.**
`tmp/Việt Huyền Sử Ký.md` is **usable with scoping**: 136,863 chars, 2,797 lines, 28 self-contained chapters, lengths from ~1.4k chars (*Con Dế*) to ~11k chars (*Cá Chép Hóa Rồng*). The mid band (4–8k chars) fits the XuVi practice loop; the full file is the right stress test for long/chaptered handling (R9). It must not be ingested as one story.

Age gating is required but currently unvalidated: gentle tales fit young listeners, while *Ngư Tinh* (boats/people lost, shore grief calls, ~L828–840), *Thánh Gióng* (war), and *Bóng Tối* (dark content) need audience gating. The worker's gating judgement is by content impression and cites **no age-band criteria** from R1–R4 or MOET (critic-flagged). Recommended Phase 4 test set (selection provisional until age-band criteria are fixed):

1. One short gentle chapter (young-audience happy path);
2. One mid mythic chapter — *Khi Trời Rách* (4.1k chars);
3. *Ngư Tinh* specifically to exercise age-flagging.

---

## 2. Technical constraints

These constraints bind Phase 3 regardless of vendor choice. Each cites its finding.

| # | Constraint | Source |
|---|---|---|
| T1 | Alignment rows use **verbatim MOET bullets**; internal IDs are labelled product-generated. No invented MOET codes, hours, outcome text, or degrees. | R5 (resolved), R16 |
| T2 | Hours exist in three units (block-weeks, periods/week, clock minutes) plus MOET tiết/năm. Store natively; never silently convert. Split `official_hours` vs. `allocated_hours_product`. | R1, R5, R14 |
| T3 | Delivery feedback needs **word-level timing + audio energy**. Turn-level STT alone cannot judge pacing/pauses. | R12, R17–R18(v) |
| T4 | Transcript correction + story-map editing are **v1 requirements**, because Vietnamese LLM/STT quality is unbenchmarked. | R9, R11, R19 |
| T5 | Generated illustrations pass a **mandatory parent review gate** (cultural accuracy + age suitability) before practice use. | R10, R21 |
| T6 | **Contributor-tier inference is forbidden** for child-adjacent data (trains on inputs). Standard tier only; retention terms to be verified. | R17, R21 |
| T7 | No legal-filing / certification / official-recognition claims in UI, exports, or marketing. Documents are family planning/evidence tools with disclaimer. | R7 |
| T8 | Corpus caveats travel with content: "not an official standard" (01), internal `examStatus` (02), `pending_confirmation` (03) must be labelled wherever corpus-derived defaults appear. | R16, R23 |
| T9 | Feedback output is fixed-form (strengths + missing/altered + one next step, excerpts/timestamps). **No overall score or ranking**, in UI or API. | R12, A7 |
| T10 | Children have **no accounts and no app surface**. All child-adjacent data is parent-owned, private-by-default, exportable/deletable. | A2, R8, R21 |
| T11 | R13 stays **evaluation-only**; no efficacy claims, badges, or marketing derived from it. | R13 |
| T12 | Meta Model API **Vietnam availability is unverified** (US-only preview at research time). Architecture must keep every AI capability behind a provider interface with a non-Meta fallback. | R17–R19 |
| T13 | Waldorf corpora **conflict** (C1–C5 below). The product must expose the choice; it must not encode a silent merge. | R2–R3 |

### Named Waldorf corpus conflicts (do not silently merge)

| ID | Conflict | Corpora | Product consequence |
|---|---|---|---|
| C1 | Mầm non exists only in NTN, in **five overlapping presentations** (2–3 / 3–5 ghép / nhỏ 3–5 / lớn 5–7 / 5–7 bản nguồn ẩn). | `tmp/03` vs. `tmp/01,02` (lớp 1–12 only) | Ages 2–7 rest on one corpus; which MN presentation is the default is **undecided** (unresolved U5). |
| C2 | Year rhythm: 36+4=40 weeks only in `tmp/01`; NTN uses 30-min MN periods; `tmp/02` uses Cambridge exam banding. | `tmp/01` vs. `tmp/02,03` | Rhythm/banding stored as family-chosen configuration with provenance, not hard-coded fact. |
| C3 | Exam phases (IGCSE 9–10, AS 11, A2 12) vs. Waldorf *tuổi mới lớn* content (Faust, art history, economics). | `tmp/02` vs. `tmp/01` | Per-grade precedence is a family/curriculum choice; no default is asserted. |
| C4 | Foreign-language timing: English immersion + bilingual stories from lớp 2 (`tmp/02`, NTN Tết vocabulary) vs. oral-only EN/ZH until lớp 4 (`tmp/01`). | `tmp/01` vs. `tmp/02,03` | Language-timing selector required; default undecided. |
| C5 | Data freshness/quality: lớp 3 craft/mộc stale vs. live Xe đạp block (10/10/2026, `tmp/02`); NTN audit 10 ERROR + 39 REVIEW + `pending_confirmation` rows. | `tmp/02,03` internal | Corpus defaults ship with provenance + caveat labels (T8); seed-use of flagged rows awaits owner decision (U6). |

## 3. Architectural recommendations

1. **Single-family v1, provider-abstracted.** TypeScript web monolith (UI + API, one codebase), Postgres, object storage (audio/images), server-rendered PDF, background job queue for all AI calls, single-region managed hosting (R20). Every AI need (i)–(v) sits behind an internal provider interface so Meta vs. non-Meta is a configuration choice — this is what keeps T12 from becoming a launch blocker.
2. **Deterministic core, LLM at the edges.** Templates + structured rendering own Document 3, Document 5, and all arithmetic (T1–T2). LLMs draft narrative prose only (Documents 1/2/4/6) and always under parent review (A10, R16).
3. **XuVi Story as an async pipeline.** Upload/extract → audience → story map (AI propose, parent edit) → illustration (generate/upload, parent gate) → practice (prompt fading) → record/upload → STT (+ word-timing/energy supplement) → feedback (fixed-form, no score) → labelled history. Each stage persists its inputs/outputs so retries and the seven-day rhythm never re-pay for completed stages.
4. **Privacy by construction.** Private-by-default, per-story/per-account export-delete, per-action AI disclosure, rights metadata per story, Document-6 minimisation, no child accounts (T10, R21). Audit log of every outbound AI payload (what left the device, to whom, when).
5. **Provenance everywhere.** Every corpus-derived default, MOET bullet, and alignment degree carries its source label (T1, T8). Exports render those labels; they are part of honesty, not decoration.
6. **Quotas and retention from day one.** Per-family storage/AI quotas, job concurrency limits, audio/image retention policy (R22). Retrofitting quotas after families have data is the expensive path.
7. **Print fidelity as a Phase 4 gate.** Prototype the two hard exports early (wide Document-3 matrix; Document-5 timetable grid) before committing the shared model — this is the one place R20's "server-rendered PDF" is still an assumption.
8. **Evaluation harness, not a feature.** Implement R13 as an offline evaluation protocol with blinded review; keep its results out of the product surface (T11).

## 4. Verdict table: the ten named products

Verdicts use the plan's three values. "Evaluate further" here means: do not architect v1 around it until the named Phase 4 check passes. All Meta-API verdicts are provisional for the two reasons in §1.5 (Vietnam availability unverified; Vietnamese quality unbenchmarked; official pricing/terms pages not directly inspected).

| Product | Verdict | Reason (one line) |
|---|---|---|
| Wonder (`muse-wonder-1.0`) | Evaluate further | Quality ceiling for (i)(ii) + feedback, but $4/$20 per 1M, Vietnam access unverified, no Vietnamese benchmark. |
| Spark (`muse-spark-1.3`, Standard) | Evaluate further | Best-fit default for (i)(ii) on price ($1.25/$4.25), blocked only by Vietnam access + Vietnamese probe. **Contributor tier: not used** (trains on inputs; T6). |
| Image (`muse-image-1.0`) | Evaluate further | Fits (iii) at $0.01/image with edit endpoint; Waldorf-style fidelity + cultural accuracy unproven, parent gate mandatory. |
| Voice Transcribe (`muse-voice-transcribe-1.0`) | Evaluate further | Cheapest STT ($0.18/hr), Vietnamese validated; but turn-level timestamps only (needs supplement for (v)) and Vietnam access unverified. |
| SAM 3.1 | Not used | No mask-requiring flow in v1 (R18(vi)); revisit only if sketch cut-out survives Phase 3 design. |
| Spark Open (816B weights) | Not used (v1) | ~2TB self-host / non-OSI license; no v1 need that a managed API cannot meet. |
| Glimmer (30B, Apache 2.0) | Evaluate further | Only credible private/on-device fallback if cloud consent (A13) fails; no hosted Meta API, Vietnamese quality unknown. |
| Baseten | Not used (v1) | Third-party hosting; needed only if an open model must be self-served, which v1 avoids. |
| Modal | Not used (v1) | Same as Baseten; keep as the named fallback host if Glimmer/Spark Open is ever adopted. |
| Fireworks | Not used (v1) | Same as Baseten/Modal; also Spark Open's day-0 host if that path is ever taken. |

Net effect: **no product is an unconditional "use" for v1 today.** The intended v1 set, pending Phase 4, is Spark (Standard) + Image + Voice Transcribe (with a Whisper/VAD supplement for delivery analysis), Wonder as the quality escalation, and Glimmer as the privacy fallback. Non-Meta baselines (Claude/GPT-class LLM, Whisper, SDXL/Flux-class image) must be probed alongside so the comparison the plan requires (R18) actually happens.

## 5. Shared content model sketch (six documents)

One family-owned source renders all six documents. Indentation = contains/references. `*` = verbatim or provenance-labelled (never AI-invented).

```
Family (teacher account, children as profiles — no child logins)
└─ ChildProfile (age band, grade, language, needs)
   └─ Program (philosophy, goals, qualities*, competencies*, areas, methods, assessment principles)   → Doc 1
      └─ GradeProgram (per grade/age: subjects, objectives, outcomes, content,
      │                  official_hours* {tiet/yr/subject/grade, strand_%?},
      │                  allocated_hours {family-assigned}, methods, materials)                     → Doc 2
      │  └─ AlignmentRow (internal_id [labelled product-generated],
      │                    MOET bullet*: subject, grade, level/cấp, strand/mạch, topic,
      │                      yeu_cau_can_dat_verbatim*, paired noi_dung*,
      │                      source_locator* {program, printed/PDF page, §IV/V, heading},
      │                      competency_refs* {pham_chat / nang_luc_chung / nang_luc_dac_thu},
      │                    homeschool_content, official_hours* vs allocated_hours,
      │                    verification {observation | artifact | oral | periodic task},   [VI.2]
      │                    degree {day_du | mot_phan | deferred+roadmap | tiep_can_khac | chua_bao_phu} [product taxonomy, labelled]
      │                   )                                                                          → Doc 3
      └─ YearPlan (year dates, weeks_total [family-chosen rhythm, provenance-labelled],
                   festival_weeks, subject distribution, monthly themes/projects,
                   experiential activities, assessment schedule, contingency)                      → Doc 4
         └─ TimetableSlot (week, day, start, end, content, owner,
                           objectives, planned vs actual duration,
                           kind {instructional | routine | activity})   [default template 08:00–15:00 Mon–Fri] → Doc 5
            └─ JournalEntry (date, content delivered, attendance, assessment notes,
                             assignments, artifact_refs, progress notes)                            → Doc 6
               └─ PeriodicReport (period, narrative summary, sign-off)                             → Doc 6
XuVi Story (per ChildProfile / audience):
   Story (source file, extracted text, source + usage_rights*, language)
   └─ Audience (age, language, context, practice goal)
      └─ StoryMap (chapters[] → scenes[], characters[], essential_details[]; parent-edited)
         └─ SceneImage (generated | uploaded, style, review_status {pending|approved|replaced})
            └─ Attempt (audio_ref, mode {with_prompts | fading | free},
                        assistance {none | text | keywords}, transcript [parent-corrected],
                        feedback {strengths, missing_or_altered, one_next_step, excerpts/timestamps})  [no score field exists]
```

Invariants enforced by the model (not by prompt discipline): hours arithmetic validates on save (T2); Document 3 cannot render an unconfirmed row (T1); `Attempt` has no score/ranking column (T9); every `*` field renders with its provenance label (T8).

## 6. Explicit unresolved items

Nothing below is silently dropped. Each item names its blocker and where it must be settled.

| ID | Unresolved item | Blocker / owner |
|---|---|---|
| U1 | TT32 currency + official cross-check (Điều 2/3 absent locally; "Còn hiệu lực"; GDPT revision timeline). | `thuvienphapluat` 403, MOET timeout; only an AI-written secondary source. Settle via Công báo / official MOET in Phase 3 pre-flight. |
| U2 | Homeschooling legal position beyond "planning/evidence tool, no claims". | No primary Vietnamese legal text (Công báo) inspected; rests on VJE 2024 (n=10) + English translations. Product ships with disclaimer regardless (T7). |
| U3 | Meta Model API availability, payment, and Standard-tier data/retention terms **from Vietnam**; official pricing/terms pages not yet directly read. | US-only preview at research time; secondary sources only. Phase 4 pre-flight + hands-on probe. Downgrades all §4 Meta verdicts until closed. |
| U4 | Vietnamese quality: LLM folktale register / diacritics / children's vocabulary; per-language STT WER; image prompting. No benchmark, no probe run. | Phase 4 hands-on probe (folktale text + recorded retelling, no real child data). |
| U5 | Mầm non default: which of NTN's five overlapping MN presentations wins; corpus precedence for C1–C4 generally. | Reviewer / content-owner decision in Phase 3. Research cannot pick silently. |
| U6 | May `pending_confirmation` / audit-flagged rows in `tmp/03` (and stale rows in `tmp/02`) seed product content, or stay research-only? | Reviewer / content-owner decision (R23). Default until decided: research-only. |
| U7 | Absolute dollar costs and free-tier headroom (per-story / per-document envelopes). | Depends on U3 vendor finalisation; audio envelope (~1–5 MB / 5 min) also lacks a codec citation. Formulas only until then. |
| U8 | PDF/print fidelity for Document-3 matrix and Document-5 timetable; PDF library choice. | No prototype rendered yet. Phase 4 prototype gate (Recommendation 7). |
| U9 | R24 age-band criteria for gating chapters (*Ngư Tinh*, *Thánh Gióng*, *Bóng Tối*) and the 3-chapter test set. | No age-band criteria cited from R1–R4/MOET. Fix criteria in Phase 3, then re-pick chapters. |
| U10 | R6 *deferred*-column content (when Waldorf-delayed outcomes actually land, per corpus/grade). | Needs R1–R4 age-band fill-in; Phase 3 content work, not a research blocker. |
| U11 | XuVi pedagogy triangulation: R8–R12 rest on one 31-line local note; no external Waldorf storytelling evidence, no segmentation/illustration accuracy data. | Accepted as requirements; validate empirically in Phase 4 prototyping. |
| U12 | Prosody supplement design (Whisper word timestamps + energy/VAD) has no Vietnamese prosody test. | Phase 4 prototype; Whisper cited on pricing only. |

Resolved since the workstreams reported (for the record): MOET outcome granularity (no codes; verbatim-bullet unit; split hours fields) — closed by prior result 8 via direct PDF inspection. It no longer blocks R14/R6 structure, only U10 content fill-in.

## 7. Deviations from the approved execution setup

1. **Models — as approved, with one consequence to record.** Workers ran on `muse-spark-1.3-contributor`, critic and synthesis on `muse-wonder-1.0`, per `specs/01_research_plan.md:§6.1`. The plan states the contributor tier may carry `tmp/` corpora because the reviewer cleared them; this synthesis notes the corollary the worker evidence surfaced: a train-on-inputs tier is acceptable for cleared research corpora and simultaneously **excluded from product child-adjacent data** (T6). No unpublished material beyond the reviewer-cleared `tmp/` files and public sources was routed to workers.
2. **`tmp/` cleared by reviewer — recorded, with provenance intact.** Per the caller instruction and §6.4 of the plan, the reviewer created and cleared all `tmp/` files. This synthesis nevertheless retains every corpus caveat (R23, T8): clearance settles *permission to use*, not *authority to claim*.
3. **Official-source verification fell short of the plan's evidence contract.** The plan required official MOET cross-checks (R5) and official Meta documentation with preserved URLs (R17). MOET/`thuvienphapluat` were unreachable (403/timeout) and Meta verdicts rest on secondary sources. Rather than treating execution completion as research completeness, the affected claims are downgraded (§1.5, §4) and carried as U1/U3. This is a deviation in *evidence depth*, disclosed instead of papered over.
4. **No hands-on Vietnamese probes were run.** The plan made probes optional/time-boxed (R19); none were executed, so U4 stands. No product code, accounts, or API keys were created, per Phase 2 scope.
5. **One gap follow-up beyond the original six workstreams.** The MOET granularity gap (R5/R6/R14) received a single focused follow-up (prior result 8, direct `pypdf` inspection) under the plan's "at most one focused follow-up per surviving gap" rule, plus the adversarial critic (prior result 7) whose flags are incorporated throughout. `tmp/` was **not** cleared/deleted by the research execution; all local files remain in place for Phase 3.

---

*End of Phase 2 deliverable. Awaiting reviewer approval before Phase 3 (Implementation Plan).*


