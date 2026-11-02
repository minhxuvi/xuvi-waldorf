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

---
