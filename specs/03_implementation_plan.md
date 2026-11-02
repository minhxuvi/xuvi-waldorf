# 03. Implementation Plan: A Product for Waldorf-Inspired Homeschooling in Vietnam

> Status: APPROVED — reviewer replied `APPROVE` on 2026-11-03 with no edits, so defaults D1–D6 in §1.1 apply as bracketed. Phase 4 (Pre-flight Check) authorized; Phase 5 starts only when 100% of pre-flight checks pass.
> Source of truth for intent: [Master Prompt](/Users/moc/Projects/xuvi-waldorf/specs/00_master_prompt.md).
> Evidence base: [Research Synthesis](/Users/moc/Projects/xuvi-waldorf/specs/02_research_synthesis.md) (`APPROVE`, 2026-11-03); [Research Plan](/Users/moc/Projects/xuvi-waldorf/specs/01_research_plan.md).
> Workflow: [WORKFLOW OPERATING PROTOCOL](/Users/moc/Projects/xuvi-waldorf/AGENTS.md).
> This document is a plan only. No product code is written in Phase 3. Execution starts only after Phase 4 pre-flight passes 100%.

## 0. Scope locked by the approved synthesis

Build a Vietnamese-first, teacher-facing web product for Waldorf-inspired homeschooling (group-of-families context, single-family v1 data model with a path to multi-family), covering:

1. **XuVi Story** — upload story (DOC/DOCX, PDF, HTML, Markdown, plain text) → audience settings → AI-proposed, parent-edited story map (scenes/characters/essential details) → per-scene watercolor/crayon illustration or parent upload behind a mandatory review gate → practice with fading prompts → record/upload retelling → transcript correction → fixed-form comparative feedback (strengths + missing/altered details + one next step, excerpts/timestamps, **no score**) → labelled practice history with optional seven-day rhythm.
2. **Six on-demand documents** from one shared content model (§5 of the synthesis): (1) Overall program, (2) Detailed program by grade/age, (3) MOET alignment matrix, (4) Academic-year plan, (5) Timetable/weekly plan (default 08:00–15:00, Mon–Fri), (6) Teaching journal + assessment records. Print/PDF export is the minimum for all six.

Binding constraints carried from the synthesis (T1–T13, conflicts C1–C5): verbatim MOET bullets only with product-generated internal IDs labelled as such; hours stored natively in all units (`official_hours` vs `allocated_hours_product`, never silently converted); deterministic rendering owns Document 3, Document 5 and all arithmetic (AI never invents hours, MOET text, or alignment degrees); transcript correction and story-map editing are v1 features; contributor-tier inference never receives child-adjacent data; no child accounts or child-facing surface; no legal-filing/certification/recognition claims (visible disclaimer); corpus caveats travel with corpus-derived content; R13 stays evaluation-only; every AI capability sits behind a provider interface with a non-Meta fallback because Meta Model API availability from Vietnam is unverified.

Explicit non-goals for v1: native mobile apps; child-facing UI; multi-school tenancy; offline-first sync; using SAM 3.1, Spark Open, Baseten, Modal, or Fireworks unless a later probe creates a self-hosting need; any overall score/ranking anywhere in UI or API.

---

## 1. Pre-flight & Permissions

Everything below must be in place before Phase 5 can run autonomously start-to-finish without interruption. Phase 4 verifies each item live (smoke test / dry-run); Phase 5 does not start until 100% pass.

### 1.1 Reviewer decisions required at `APPROVE` of this plan

Defaults in brackets apply if unanswered; each default is the conservative reading of the synthesis.

| ID | Decision | Default if unanswered |
|---|---|---|
| D1 (U5) | Which of NTN's five overlapping mầm non presentations is the default for ages 2–7, and corpus precedence for conflicts C1–C4 generally | [No silent default: MN band ships as an explicit family choice with no pre-selected presentation; lớp 1–12 defaults to the classical corpus] |
| D2 (U6) | May `pending_confirmation`/audit-flagged rows (`tmp/03`) and stale rows (`tmp/02`) seed product content? | [Research-only. Flagged rows are excluded from seeded defaults until the content owner approves them row-by-row] |
| D3 (C4) | Foreign-language timing default (English immersion from lớp 2 vs oral-only until lớp 4) | [Family-chosen selector, no pre-selected default] |
| D4 (C3) | Per-grade precedence: Cambridge exam phases (IGCSE/AS/A2) vs Waldorf *tuổi mới lớn* content | [Family-chosen per grade band; UI presents both, pre-selects neither] |
| D5 (U9) | Age-band criteria for gating story chapters (e.g. *Ngư Tinh*, *Thánh Gióng*, *Bóng Tối*) | [Criteria drafted in Task 9 from R1–R4 age bands + MOET level structure, shown to reviewer before the test-story set is locked] |
| D6 | v1 grade span exposed in the UI (research span is mầm non–lớp 12) | [Full research span, with MN gated behind D1] |

### 1.2 CLI tools and local environment

| Tool | Required for | Phase 4 check |
|---|---|---|
| Git | Per-task commits in Phase 5, progress log | `git --version && git status --short` |
| Node.js 20+ and pnpm | TypeScript web monolith (UI + API), tests, lint, typecheck | `node --version && pnpm --version` |
| Python 3 + `uv` | MOET PDF extraction/ingestion scripts (1,555-page TT32 PDF), evaluation harness utilities | `python3 --version && uv --version` |
| PostgreSQL 15+ (local or Docker) | Primary datastore | `psql --version` or `docker compose ps` |
| Docker (optional, only if Postgres/object storage are not local) | Local Postgres + S3-compatible storage | `docker --version` |
| Headless browser runtime (Playwright Chromium) | E2E and PDF/print-fidelity checks | Installed in Task 1; checked in Phase 4 as available-or-installable |

No other local tooling is assumed. In particular `pdfinfo`/`pdftotext` are absent on this machine; all PDF work goes through `uv run --with pypdf` (extraction) and the app's server-side PDF renderer (export).

### 1.3 Cloud accounts, API keys, and environment variables

Phase 5 must be able to run without asking for credentials mid-flight. Keys are provided by the reviewer in Phase 4, stored only in a local, git-ignored `.env` (never committed, never logged), and verified with the cheapest possible live call.

| Capability | Primary (to probe first) | Fallback (must also be provisioned or explicitly waived) | Env vars |
|---|---|---|---|
| LLM: scene segmentation, document narrative drafting, feedback text | Meta Model API — Spark Standard tier (`muse-spark-1.3`); Wonder (`muse-wonder-1.0`) as quality escalation. **Standard tier only; Contributor tier is forbidden for product data (T6)** | One non-Meta LLM with Vietnamese support (Claude / GPT / Gemini class) | `META_API_KEY`, `LLM_FALLBACK_API_KEY`, `LLM_FALLBACK_PROVIDER` |
| Image generation/editing | Meta Image (`muse-image-1.0`, incl. fal endpoint if that is the accessible route) | One SDXL/Flux-class or OpenAI-image-class provider | `META_API_KEY` (shared), `IMAGE_FALLBACK_API_KEY` |
| Speech-to-text | Meta Voice Transcribe (`muse-voice-transcribe-1.0`) | Whisper-class STT with word timestamps (also the delivery-analysis supplement, T3) | `META_API_KEY` (shared), `STT_FALLBACK_API_KEY` |
| Hosting (single-region managed) | One managed host for web app + Postgres + object storage + background jobs; exact vendor chosen in Task 1 from what the reviewer can provision | Local-only development remains possible without it; production deploy is then descoped, not improvised | `DATABASE_URL`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `APP_BASE_URL` |
| App secrets | Session/auth secret generated locally | — | `AUTH_SECRET` |

Explicitly **not** needed: Baseten, Modal, Fireworks, SAM 3.1, Spark Open, or Glimmer accounts/keys for v1 (verdict table, synthesis §4). If the Phase 4 probes (Task 11) show Meta is unreachable from Vietnam, the fallbacks above become primary — that is a configuration change behind the provider interface, not an architecture change (T12).

### 1.4 Access permissions

- Write access to this repository and permission to create one Git commit per completed Phase 5 task (no push, tag, or remote changes unless the reviewer separately asks).
- Read access to `tmp/` reference corpora (machine-local, git-ignored) for ingestion and test fixtures; product code must treat them as seed/reference data with provenance labels, never as committed assets without a separate reviewer decision.
- Network access from the dev machine to the provisioned AI/hosting endpoints for Phase 4 probes and Phase 5 integration tests. Probes use synthetic folktale text and adult-recorded audio only — never real child data.
- No production data, no real children's data, and no third-party accounts beyond §1.3 are required or permitted.

---

## 2. Guardrails

The following must **never** be performed autonomously in Phases 4–5. Any situation that seems to require one stops execution and is reported to the reviewer instead.

1. **Never** send child-adjacent data (retelling audio/transcripts, journal text, family documents) to contributor-tier or any train-on-inputs inference tier (T6). Standard tier only, and only after its retention terms are recorded in the progress log.
2. **Never** invent MOET outcome text, MOET codes, official hours, or alignment degrees. Document 3 renders verbatim bullets and parent-confirmed rows only; internal IDs are labelled product-generated (T1).
3. **Never** add an overall score, ranking, or efficacy claim anywhere in UI, API, exports, or marketing copy (T9, T11). The `Attempt` model has no score field by construction.
4. **Never** create child accounts, child logins, or a child-facing surface (T10). Children remain screen-free; all data is teacher-owned.
5. **Never** claim legal filing, certification, or official recognition in UI, exports, or copy; the planning/evidence disclaimer ships in every export (T7).
6. **Never** modify a test to force it to pass, skip/xfail a failing test, or delete a failing test (operating-protocol circuit breaker). Three consecutive failed fix attempts on one error, or any fix requiring an architecture change to this plan, stops execution: document the cause in `specs/04_progress_log.md` and report.
7. **Never** commit secrets, `.env` files, API keys, real audio, or `tmp/` corpora. Never force-push, amend, rebase, or otherwise rewrite Git history.
8. **Never** delete, clear, or overwrite `tmp/` reference files, existing spec files' approved content, or user files outside the task's named deliverables.
9. **Never** run destructive database or storage operations (drop/truncate/reset) against anything but a disposable local dev database created in Phase 5, and never against a provisioned production resource.
10. **Never** silently merge conflicting Waldorf corpora (C1–C5). Conflicts surface as labelled family choices with provenance, per D1–D4.
11. **Never** ship a generated illustration into practice use without the parent review gate passing (T5), and never remove the per-action AI-data disclosure (which service receives what, before it is sent).
12. **Never** provision paid infrastructure, purchase credits, or change billing on any account autonomously. If a probe or task needs spend beyond already-provisioned credits, stop and ask.

---

## 3. Phased Tasks & Verification

Conventions for all tasks: work is TypeScript (web monolith: UI + API in one codebase), PostgreSQL, object storage, server-rendered PDF, and a background job queue for every AI call (synthesis §3). Each task ends with its verification command(s) passing, an entry in `specs/04_progress_log.md`, and one Git commit (Phase 5 loop). A task is not done on a narrower or substitute check: the named command runs unmodified, full scope.

### Task 0 — Phase 4 pre-flight smoke (gate, no product code)

- **Do:** Run every check in §1.2–§1.3 live: tool versions, DB connectivity, object-storage read/write/delete of a throwaway object, and one minimal live call per AI capability (LLM: segment a short synthetic Vietnamese folktale paragraph; image: one low-cost watercolor prompt; STT: transcribe a short adult-recorded Vietnamese clip) on primary and, where provisioned, fallback. Record Vietnam reachability, latency, and Standard-tier data terms in the progress log. Probe inputs/outputs are kept verbatim (synthetic data only).
- **Definition of Done:** every check passes or is explicitly waived/descoped by the reviewer in writing; failures route Meta capabilities to their fallbacks before Task 1 proceeds.
- **Verification:** `git --version && node --version && pnpm --version && python3 --version && uv --version` plus the probe script `uv run --with pypdf python3 scripts/probe_providers.py` (created as a throwaway under `/tmp` if the reviewer prefers no probe code in the repo) exiting 0 with its report written to `specs/04_progress_log.md`.

### Task 1 — Scaffold and quality gates

- **Do:** Scaffold the monolith (app, API routes, job queue, env loading with fail-fast on missing keys), Postgres connection, object-storage client, health endpoint, and the standard scripts: `dev`, `build`, `test`, `lint`, `typecheck`, `test:e2e`. Add `.env.example` listing §1.3 variables with no values. Vietnamese-first i18n scaffolding; English message catalog present but secondary.
- **Definition of Done:** clean checkout builds and all gates run; health endpoint reports DB + storage status without leaking secrets.
- **Verification:** `pnpm install && pnpm build && pnpm lint && pnpm typecheck && pnpm test` and `curl -fsS http://localhost:3000/api/health`.

### Task 2 — Shared content model and invariants

- **Do:** Implement the synthesis §5 model: `Family` (teacher account) → `ChildProfile` (profile only, no login) → `Program` → `GradeProgram` → `AlignmentRow` → `YearPlan` → `TimetableSlot` → `JournalEntry`/`PeriodicReport`, plus the XuVi entities (`Story`, `Audience`, `StoryMap`, `SceneImage`, `Attempt`). Enforce invariants in the data layer, not by convention: hours stored natively per unit with `official_hours` vs `allocated_hours` split; block-week and timetable arithmetic validated on save; `Attempt` has no score/ranking column; every corpus- or MOET-derived field carries a provenance label.
- **Definition of Done:** migrations apply from empty; invariant tests cover negative cases (silent hour conversion rejected, unconfirmed alignment row unrenderable, score field absent).
- **Verification:** `pnpm test -- content-model` and `pnpm exec prisma migrate deploy` (or the stack's migration equivalent chosen in Task 1) against a disposable test database.

### Task 3 — Teacher auth, privacy, and audit

- **Do:** Teacher registration/login (single-family v1), child profiles owned by the teacher, private-by-default visibility, per-story and per-account export and delete, per-action AI disclosure record, and an audit log of every outbound AI payload (what left the device, to which provider, when). Document 6 data gets the strictest retention defaults. No child accounts exist at any layer.
- **Definition of Done:** export produces a complete archive; delete removes content and stored media; audit log shows provider, payload type, and timestamp for a staged AI action; an automated check proves no child-login route exists.
- **Verification:** `pnpm test -- auth privacy audit` and `pnpm test:e2e -- privacy-flow`.

### Task 4 — MOET reference dataset ingestion

- **Do:** Extract GDPT 2018 (TT32) from the local 1,555-page PDF into structured reference data at the resolved granularity: one row per verbatim *yêu cầu cần đạt* bullet with subject, grade, cấp, strand/topic, paired *nội dung*, source locator (program, printed/PDF page, §IV/V heading), and competency refs. Official hours attach only at tiết/năm/subject/grade (plus strand % where the subject program gives it). Internal IDs are generated and labelled product-generated in schema, UI, and exports. The TT32 currency caveat (U1) is stored as dataset metadata and shown wherever the dataset is presented.
- **Definition of Done:** ingestion is reproducible from the PDF; spot-checked rows match the PDF verbatim (including the Ngữ văn lớp 1 reading-speed bullet and Toán lớp 1 strands cited in the synthesis); zero invented codes.
- **Verification:** `uv run --with pypdf python3 scripts/ingest_moet.py --check` (row counts per subject, 0 hits for invented code patterns, verbatim diff on sampled pages) and `pnpm test -- moet-dataset`.

### Task 5 — Corpus-derived defaults with provenance (Documents 1, 2, 4 drafting)

- **Do:** Seed configurable defaults from the three Waldorf corpora with per-value provenance and caveat labels (T8): program philosophy/goals/competencies, grade programs, year rhythm and monthly themes. Rhythm, banding, foreign-language timing, and exam-vs-Waldorf precedence are family-chosen configuration (D1–D4), never hard-coded merges. LLM drafting (behind the provider interface) may propose narrative prose for Documents 1/2/4; every draft is parent-edited and explicitly locked before export. Flagged corpus rows follow D2.
- **Definition of Done:** a family can generate, edit, and lock Documents 1, 2, and 4; every corpus-derived value displays its source; switching a D1–D4 choice changes output without code changes.
- **Verification:** `pnpm test -- documents-124` and `pnpm test:e2e -- doc-generate-edit-lock`.

### Task 6 — Deterministic documents: alignment matrix (Doc 3) and timetable (Doc 5)

- **Do:** Document 3 renders only parent-confirmed `AlignmentRow`s over verbatim MOET text, with homeschool content, allocated time (never rendered as MOET-prescribed), VI.2 verification methods, and the product-taxonomy degree set (*đầy đủ / một phần / deferred + roadmap / tiếp cận khác / chưa bao phủ*) labelled as a product taxonomy. Document 5 renders the weekly timetable on the 08:00–15:00 Mon–Fri default template, distinguishing instructional time from routines/activities, with planned vs actual duration. All arithmetic is deterministic and validated; no LLM touches either document.
- **Definition of Done:** deferred outcomes record a later-attainment roadmap; hours arithmetic rejects over-allocation; an unconfirmed row cannot appear in export.
- **Verification:** `pnpm test -- alignment-matrix timetable` including golden-file renders of a seeded matrix and timetable.

### Task 7 — Teaching journal and assessment records (Doc 6)

- **Do:** Journal entries (date, content delivered, attendance, assessment notes, assignments, artifact references, progress notes) with continuous append and periodic narrative reports with teacher sign-off. Fields stay minimal and family-configurable (synthesis R4 gap: no Waldorf-prescribed schema is claimed). Observation/artifact/oral evidence types follow the corpus mechanisms.
- **Definition of Done:** a term of journal entries rolls up into a periodic report; entries are editable by the teacher only; export matches the master prompt's Document 6 minimum content.
- **Verification:** `pnpm test -- journal` and `pnpm test:e2e -- journal-to-report`.

### Task 8 — PDF/print export gate for all six documents

- **Do:** Server-rendered print/PDF for all six documents, with the two hard layouts prototyped first: the wide Document 3 matrix (pagination, verbatim text wrapping, provenance/degree labels) and the Document 5 timetable grid. Every export carries the T7 disclaimer and provenance labels. This task closes U8; if print fidelity fails, the layout approach is revised inside this task, not deferred.
- **Definition of Done:** all six exports render from the seeded family; matrix and timetable PDFs pass visual snapshot comparison; no export contains a score, an official-recognition claim, or an unlabelled internal ID.
- **Verification:** `pnpm test -- pdf-export` and `pnpm test:e2e -- pdf-snapshots` (rendered-page snapshots compared against approved baselines).

### Task 9 — XuVi Story core: upload, audience, story map

- **Do:** Story library accepting DOC/DOCX, PDF, HTML, Markdown, and plain text with in-app text review, per-story source + usage-rights metadata, and language handling (Vietnamese primary, English supported). Audience settings (age, language, context, practice goal) with age gating per D5. AI story-map proposal (chapters → scenes, characters, essential details) behind the provider interface; the parent edits and confirms the map. Long/chaptered stories keep chapters connected; the `Việt Huyền Sử Ký` mid-band chapters (4–8k chars) are the stress fixture, never ingested as one story. Age-band criteria (U9) are drafted here and shown to the reviewer before the test-story set is locked.
- **Definition of Done:** end-to-end upload → map → parent-confirmed map works on one short gentle chapter and one mid mythic chapter; segmentation preserves key events/relationships on the fixtures (human-checked checklist, recorded in the progress log — no accuracy overclaim, U11).
- **Verification:** `pnpm test -- xuvi-story-map` and `pnpm test:e2e -- story-upload-to-map`.

### Task 10 — XuVi Story visuals, practice, recording, and transcription

- **Do:** Per-scene illustration generation (wet-on-wet watercolor, wax crayon, colored pencil styles; English prompts, T-note R19) and parent upload/sketch replacement, behind the mandatory review gate (pending → approved/replaced; unapproved images cannot enter practice). Practice modes: with image prompts, fading prompts, free retelling. In-app recording and audio upload with replay; STT behind the provider interface; parent transcript correction; attempt labelling (with/without prompts; text/keyword assistance tracked separately). Delivery supplement: word-level timestamps plus audio energy/VAD analysis, since turn-level STT alone cannot judge pacing/pauses (T3).
- **Definition of Done:** a corrected transcript and labelled attempt persist end-to-end; an unapproved image is provably unusable in practice mode; delivery features (pause/pacing measures) are computed from audio, not transcript text alone.
- **Verification:** `pnpm test -- xuvi-practice recording transcription` and `pnpm test:e2e -- record-correct-retry`.

### Task 11 — XuVi Story feedback, history, and the evaluation harness

- **Do:** Comparative feedback against the selected story version + story map, distinguishing omissions from intentional adaptations, in the fixed output form: strengths, missing/altered essential details, exactly one practical next step, with excerpts or timestamps; fidelity, vivid language/coherence, age fit, and delivery (from audio features) as separate sections. No score or ranking field exists in schema, API, or UI. Practice history compares attempts under their labelled conditions, with the optional seven-day rhythm. The R13 two-story blinded comparison is implemented as an offline evaluation protocol whose results never surface in the product (T11).
- **Definition of Done:** feedback renders in the fixed form on a fixture retelling; an API/schema test proves no score can be stored or returned; history groups attempts by condition labels; evaluation results are file-only.
- **Verification:** `pnpm test -- xuvi-feedback history` and `pnpm test:e2e -- feedback-no-score`.

### Task 12 — Provider probes, cost/quotas, and release hardening

- **Do:** Hands-on Vietnamese quality probes (U4, U12): folktale segmentation + feedback drafting quality (diacritics, tone, children's vocabulary, folktale register), per-language STT error check on adult-recorded retellings, illustration style/cultural-accuracy review — Meta primary vs provisioned fallback, results recorded verbatim in the progress log. The provider left primary per capability is the probe winner, not the default assumption. Add per-family AI/storage quotas, job concurrency limits, audio/image retention policy, and cost instrumentation as formulas (calls × unit price; U7 stays formula-only until vendor pricing is final). Final hardening: full test suite, disclaimer/provenance sweep of every screen and export, and a fresh-clone runbook.
- **Definition of Done:** probe report names the primary provider per capability with evidence; quotas demonstrably stop over-limit jobs; the full suite passes from a clean checkout; no screen or export violates T1–T13.
- **Verification:** `pnpm build && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e` from a clean clone, plus the probe report present in `specs/04_progress_log.md`.

## 4. Phase 5 execution loop (restated from the operating protocol)

1. Execute Tasks 0–12 sequentially; no task starts while the previous task's verification is red.
2. After each task: run its verification → on pass, append status to `specs/04_progress_log.md` and create one Git commit → proceed. On fail: fix and re-run; never edit the test to force a pass.
3. Circuit breaker: more than 3 consecutive failed fix attempts on one error, or any fix requiring a change to this plan's architecture, stops execution. Document the exact cause in `specs/04_progress_log.md` and report to the reviewer.
4. Unresolved items U1–U12 from the synthesis stay open until their named task closes them (U8 → Task 8, U9 → Task 9, U4/U12 → Task 12, U1/U2 → disclaimers ship regardless; U3 → Task 0/12). Nothing is silently dropped.

---

*End of Phase 3 deliverable. Awaiting `APPROVE` (with any edits, especially D1–D6) before Phase 4 pre-flight begins.*

