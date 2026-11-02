# 04. Progress Log: Waldorf-Inspired Homeschooling Product

> Phase 5 loop log. One entry per completed task, appended after its verification passes.
> Protocol: [WORKFLOW OPERATING PROTOCOL](/Users/moc/Projects/xuvi-waldorf/AGENTS.md) — circuit breaker: >3 consecutive failed fix attempts or an architecture change stops execution and is reported here.

## Phase 4 — Pre-flight Check (2026-11-03)

Reviewer reply: `GRANTED`, with `WAIVE S3, hosting, image, STT` (local/stub media mode; `localhost:3000` dev only).
Plan locked: [03 Implementation Plan](/Users/moc/Projects/xuvi-waldorf/specs/03_implementation_plan.md) (`APPROVE`, defaults D1–D6 apply).

| # | Check | Result |
|---|---|---|
| P1 | CLI tools: git 2.54, node v26.7, pnpm 10.15, python3 3.14, uv 0.12, Playwright Chromium cached | PASS |
| P2 | `.env` exists, git-ignored (`check-ignore` OK), keys present: `DATABASE_URL`, `AUTH_SECRET`, `META_API_KEY` | PASS |
| P3 | Meta Model API live probe `GET /v1/models` (read-only, no spend) | PASS — `http=200`; lists `muse-wonder-1.0`, `muse-spark-1.3`, `muse-spark-1.3-contributor`, `muse-voice-transcribe-1.0`, `sam-3.1` (+truncated). Vietnam reachability confirmed from this machine |
| P4 | `DATABASE_URL` authenticated `SELECT version()` via ephemeral `psycopg` | **FAIL — `failed to resolve host 'db.yjwzpruhlgltaiuzvtre.supabase.co'`**. Control hosts (`supabase.co`, `registry.npmjs.org`) resolve and HTTPS works, so this is a wrong hostname, not a network block. Fix: copy the exact connection string from Supabase dashboard → Project Settings → Database (direct `db.<ref>.supabase.co:5432` or pooler `6543`), replacing only the password |
| P5 | `AUTH_SECRET` strength | **FAIL — 8 chars, too short**. Fix: regenerate ≥32 random chars (e.g. `openssl rand -hex 32`), local dev still OK but must be fixed before any shared/test-with-others use |

**Phase 4 verdict: NOT 100% — Phase 5 blocked on P4 + P5.** Waived items (S3, hosting, image/STT providers) are recorded as descoped to local/stub mode per reviewer; they do not block Phase 5. No product code written yet. Awaiting reviewer fix, then re-run of P4/P5 only.

### Phase 4 — Re-run after reviewer fix (2026-11-03, reply `GRANTED`)

| # | Check | Result |
|---|---|---|
| P4r | `DATABASE_URL` now pooler `aws-1-eu-central-1.pooler.supabase.com:6543`, resolves to IP, authenticated `SELECT version()` | PASS — `PostgreSQL 17.11` |
| P5r | `AUTH_SECRET` length | PASS — 64 chars |

**Phase 4 verdict: 100% PASS — Phase 5 authorized.** Scope: waived items stay in local/stub mode; all other tasks run autonomously per the plan.

## Task 0 — Phase 4 pre-flight smoke (gate, no product code)

- Ran: tool versions, DB authenticated query, Meta `GET /v1/models` read-only probe, `.env` git-ignore check.
- Report: see Phase 4 table above (P1–P3 PASS, P4r/P5r PASS after one fix round).
- Status: DONE (verification: Phase 4 table 100% PASS).

## Task 1 — Scaffold and quality gates

- Built: TypeScript web monolith (`src/server.ts` with `GET /api/health` reporting db/storage/AI modes, no secrets leaked), `src/env.ts` (fail-fast on missing `DATABASE_URL`/`AUTH_SECRET`; S3/image/STT optional → stub mode), `src/i18n.ts` (vi-first catalog), `tests/health.test.ts` (5 tests), `scripts/e2e-health.mjs` (boots real server, asserts health shape), `.env.example`, eslint + vitest configs.
- Verification (all green, real run): `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (5 passed), `pnpm test:e2e` → `E2E PASS: /api/health {"ok":true,"db":"up","storage":"local-stub","ai":{"llm":"meta","image":"meta","stt":"meta"}}` against live Supabase.
- Minor deviation from plan: typecheck runs `tsc --noEmit -p tsconfig.check.json` (src+tests+scripts) while build uses `tsconfig.json` (src only) — fixes `rootDir` conflict; the `pnpm typecheck` command itself is unchanged.
- Fixes during task (2, within circuit-breaker budget): `rootDir`/include split + stray emit cleanup; `as const` on ternary → typed variable; stripped TS annotations from `.mjs` e2e script.
- Status: DONE.

## Task 2 — Shared content model and invariants

- Built: `db/migrations/001_core.sql` (15 tables: families → child_profiles (no logins, T10) → programs → grade_programs → alignment_rows → year_plans → timetable_slots → journal_entries/periodic_reports; stories → audiences → story_maps → scene_images → attempts with NO score column, T9), `scripts/migrate.mjs` (`pnpm db:migrate`, tracked in `schema_migrations`, per-file transactions), `src/model/validation.ts` (hours-split T2, day arithmetic ≤420 min, render gate T1, no-score guard T9, image gate T5).
- Verification (all green, real run): `pnpm test -- content-model` (12 passed incl. negative cases); `pnpm db:migrate` → `applied 001_core.sql` against live Supabase; live `information_schema` check: 15 tables present, `attempts` has no score/ranking column; `pnpm lint` + `pnpm typecheck` clean.
- Fixes during task (1): `scripts/migrate.mjs` now loads `.env` via dotenv (was missing `DATABASE_URL`).
- Status: DONE.

## Task 3 — Teacher auth, privacy, and audit

- Built: `db/migrations/002_auth.sql` (teachers with case-insensitive unique email, scrypt password hashes, sessions with sha256 token hashes + 30-day expiry, audit_log with provider/payload_type); `src/auth.ts` (register/login/logout/authenticate, timing-safe verify); `src/privacy.ts` (exportFamily archive with secret-stripping, deleteFamily cascade); `src/db.ts` (pool singleton); routes `POST /api/teachers/*`, `GET /api/export`, `GET /api/audit`, `DELETE /api/account` with Bearer auth; `ROUTES` table asserting no child-login routes (T10).
- Verification (all green, real run): `pnpm test -- auth privacy audit` within full suite (16 passed); `pnpm test:e2e` → health PASS + `E2E PASS: privacy-flow` (live register → wrong-password 401 → login → export with zero `password_hash`/`token_hash` → audit contains register/login/export with provider+payload_type → unauthenticated export 401 → delete → re-login 401); `pnpm lint` + `typecheck` + `build` clean.
- Fixes during task (1): `logAudit` import moved from `privacy.js` to `auth.js`.
- Status: DONE.

## Task 4 — MOET reference dataset ingestion

- Built: `scripts/ingest_moet.py` (extract `--out`, `--check`, `--seed`), `db/migrations/003_moet.sql` (`moet_outcomes` with `product_generated_id` per row, T1), `data/moet_outcomes.json` (11,003 verbatim rows, 21 subjects: NGỮ VĂN 936, TOÁN 903, TIẾNG ANH 1117, KHTN 821, SINH 565, VẬT LÍ 257, ...), `tests/moet-dataset.test.ts` (5 tests).
- Extraction fixes during task (4): un-double-escaped bullet regex; heading-anchored YCCD gate (body text no longer toggles); exact ALL-CAPS subject headers (prose "môn Vật lí." no longer flips subject; same-subject headers don't reset gate); both table-header orders + U+F02D/U+F0B7 bullets; line-wrap continuation join. Method + residual risks recorded in JSON meta and here: some Nội dung-column dash cells captured as rows; merged-column fragments may mis-pair — all rows page-cited so parents confirm before Doc 3 use.
- Verification (all green, real run): `ingest_moet.py --check` → `CHECK OK` (11,003 rows, 0 invented codes, verbatim page cross-check 389/400); `pnpm test -- moet-dataset` within full suite (21 passed); `003_moet.sql` applied live. Note: `--seed` (11k upserts) was still running at commit time; seed is outside Task 4's verification commands and is confirmed separately before Task 6.
- Status: DONE.

## Task 5 — Corpus-derived defaults with provenance (Documents 1, 2, 4 drafting)

- Built: `scripts/extract_corpus.py` → `data/corpus_defaults.json` (classical 12 + cambridge 12 + ntn 17 grade blocks with source path/SHA + per-corpus caveats, conflicts C1–C5 left unresolved for family choice); `db/migrations/004_program_config.sql` (programs.config / year_plans.config for D1–D4 explicit choices); `src/ai.ts` (meta → fallback → honestly-labelled stub provider interface, per-call audit); `src/documents.ts` (program/grade/year-plan create-edit-lock with config validation, locked-edit rejection); routes `POST/PATCH /api/programs*`, `POST /api/draft`; `scripts/e2e-docs.mjs`; `tests/documents.test.ts` (4 tests).
- Verification (all green, real run): full suite 25 passed; `pnpm test:e2e` → health + privacy-flow + `E2E PASS: doc-generate-edit-lock` (live: bad rhythm 400 → create → grade → year plan → stub draft → edit → lock → locked-edit rejected → audit contains program.create/update/lock + ai.draft); lint/typecheck/build clean.
- Fixes during task (1): widened 400-error mapping (`unknown|required|locked|not found`) so validation errors no longer surface as 500.
- Status: DONE.

## Task 6 — Deterministic documents: alignment matrix (Doc 3) and timetable (Doc 5)

- Built: `src/alignment.ts` (create/confirm per parent, `renderMatrix` confirmed-only with provenance labels, deferred-requires-roadmap); `src/timetable.ts` (day/week validation, `renderWeek` with per-day totals); routes `POST/PATCH /api/grades|alignments|matrix`, `POST/GET /api/year-plans/:id/slots|timetable`, `GET /api/moet/search` (reference lookup over seeded MOET rows); `scripts/e2e-matrix.mjs`; `tests/alignment-timetable.test.ts` + snapshot (3 tests).
- Verification (all green, real run): full suite 28 passed; `E2E PASS: matrix-timetable` (live: empty verbatim 400 → create unconfirmed → matrix empty → confirm → matrix renders 1 row with all provenance labels → over-allocation 400 → valid slots → Tuesday total 150/instructional 120).
- Fixes during task (1): widened 400-error mapping again (`over-allocates|positive|must be|after start`).
- Status: DONE.

## Task 7 — Teaching journal and assessment records (Doc 6)

- Built: `src/journal.ts` (child profiles, journal append with YYYY-MM-DD rule, deterministic report rollup, create + single sign-off); routes `POST/GET /api/children*`, `POST /api/reports/:id/signoff`; `scripts/e2e-journal.mjs`; `tests/journal.test.ts`.
- Verification (all green, real run): full suite 29 passed; `E2E PASS: journal-to-report` (live: bad date 400 → 2 entries → list → draft rollup counts 2 → report → sign-off → double sign-off 400); lint/typecheck/build clean.
- Fixes during task (2): e2e double-signoff assertion was inverted; narrowed the T10 route-table test to forbid child auth (login/session/password/token) while allowing teacher-managed profiles.
- Status: DONE.

## Task 8 — PDF/print export gate for all six documents

- Built: `src/export.ts` (6 HTML renderers with print CSS, T7 disclaimer, T8 provenance labels, no scores), `src/pdf.ts` (headless-shell `--print-to-pdf`, no new npm deps), `GET /api/docs/:kind/:id?format=html|pdf`; `scripts/e2e-export.mjs`; `tests/export.test.ts` (2 tests).
- Verification (all green, real run): full suite 31 passed; `E2E PASS: pdf-export` (all 6 docs HTML+PDF, disclaimer present, no score text, unknown kind 404); pypdf fidelity check on real PDFs — matrix + timetable render extractable Vietnamese text with disclaimer + provenance labels, zero score leaks; lint/typecheck/build clean.
- Fixes during task (4): disclaimer test asserted negated wording correctly; e2e header-merge spread bug; jsonb objects vs strings in `kv()`/`subjects`; pg `Date` objects in `esc()` — all renderers now coerce.
- Status: DONE.

## Task 9 — XuVi Story core: upload, audience, story map

- Built: `scripts/extract_upload.py` (.txt/.md/.html/.pdf/.docx via uv+pypdf+python-docx; legacy .doc rejected with guidance), `src/xuvi.ts` (allowlist, multipart parser, `flagSensitive` age-gating rules war/death/dark/grief with min ages, stub paragraph-chunker proposer, parent edit/confirm), routes `POST/GET /api/stories*`, `POST/GET /api/audiences/:id/story-map*`, `PUT/POST /api/story-maps/:id*`; `scripts/e2e-story.mjs`; `tests/xuvi-story.test.ts` (3 tests). Age-band criteria (U9): keyword rules + mandatory parental acknowledgement mechanism at practice time (Task 10); criteria text recorded here for reviewer lock-in.
- Verification (all green, real run): full suite 34 passed; `E2E PASS: story-upload-to-map` (live: multipart .txt → gentle unflagged → war text flagged war/minAge 9 → audience → stub propose → edit adds character → confirm → confirmed-edit 400 → .exe 400 with file cleaned from disk); lint/typecheck/build clean.
- Fixes during task (3): test built multipart body in latin1 (use utf8); widened 400 mapping (`unsupported|too long`); rejected uploads now deleted from disk.
- Status: DONE.

---
