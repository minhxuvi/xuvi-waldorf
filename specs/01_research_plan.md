# 01. Research Plan: A Product for Waldorf-Inspired Homeschooling in Vietnam

> Status: DRAFT — awaiting review and explicit `APPROVE` before Phase 2 (Research Execution).
> Source of truth for intent: [Master Prompt: A Product for Waldorf-Inspired Homeschooling in Vietnam](/Users/moc/Projects/xuvi-waldorf/specs/00_master_prompt.md).
> Workflow: [WORKFLOW OPERATING PROTOCOL](/Users/moc/Projects/xuvi-waldorf/AGENTS.md).
> This document is a plan only. It takes no final product, pedagogy, legal, or architecture decisions. Preliminary technology leanings in §5 are hypotheses to be tested in Phase 2, not conclusions.

## 0. What Phase 1 Must Settle

The master prompt asks for a product for Waldorf-inspired homeschooling in Vietnam with two deliverable families:

1. **XuVi Story (mandatory feature)** — helps a parent practice telling folktales: upload a story, divide it into memorable scenes, generate age-appropriate watercolor or crayon illustrations per scene, record a retelling, and receive comparative feedback.
2. **On-demand generation of six education documents** — (1) Overall education program, (2) Detailed education program by grade/age, (3) Alignment matrix with the Ministry of Education and Training (MOET) General Education Curriculum, (4) Academic-year education plan, (5) Timetable and weekly lesson plan (08:00–15:00, Mon–Fri), and (6) Teaching journal and student assessment records.

The master prompt also imposes a technology decision: choose the tech stack and decide which of nine named Meta products **should** be used — Wonder, Spark, Image, Voice Transcribe, SAM 3.1, Spark Open, Glimmer, Baseten, Modal, Fireworks — without requiring all of them, with the reasoning recorded in the research plan.

Local reference material exists in `tmp/` (git-ignored, machine-local) and is listed as a source in §6. Phase 2 must treat that material as candidate input whose provenance, licensing, and authority still need validation (see A13–A15), not as ground truth.

Phase 2 will produce [02 Research Synthesis](/Users/moc/Projects/xuvi-waldorf/specs/02_research_synthesis.md) with key findings, technical constraints, and architectural recommendations. Phase 3 will turn that synthesis into [03 Implementation Plan](/Users/moc/Projects/xuvi-waldorf/specs/03_implementation_plan.md). Nothing in this plan pre-empts those two approvals.

---

## 1. Assumptions to Be Validated (a)

Each assumption is falsifiable in Phase 2. "If false" states the consequence that Phase 2 must then design for.

### Users and context

- **A1 — Primary user is the parent-as-teacher.** The person uploading stories, practicing retellings, and generating documents is a homeschooling parent, not a school-employed Waldorf teacher. *If false:* multi-teacher roles, classroom cohorts, and school administration become in-scope.
- **A2 — Children are not direct app users.** Consistent with the XuVi Story note that images support the teacher's preparation and children do not need the app, the child-facing surface is screen-free. *If false:* child accounts, child-safe UI, and in-app child interaction must be researched.
- **A3 — Homeschooling is practiced as family-based education that still needs to evidence alignment with MOET outcomes.** Parents want Waldorf pedagogy *and* a defensible mapping to the official curriculum. *If false* (e.g., purely enrichment use, or a formal school filing use): the compliance bar for the six documents changes materially.
- **A4 — Vietnamese is the primary language** of stories, UI, feedback, and generated documents, with possible English (and per Waldorf sources, Chinese) as foreign-language subjects. *If false:* bilingual UI and feedback become required scope.

### Pedagogy and curriculum

- **A5 — Waldorf developmental staging drives structure.** Age/grade bands (early childhood through grade 12), main-lesson blocks, rhythm, storytelling, form drawing, handwork, and festivals in the local references reflect the pedagogy the product should encode. *If false:* the product needs a different (or plural) pedagogical model selector.
- **A6 — Folktales are the canonical storytelling corpus.** Vietnamese folktales plus Waldorf-typical tales (e.g., Grimm) are the stories parents practice. *If false:* XuVi Story must support arbitrary narrative non-fiction, original stories, or curriculum texts with different scene logic.
- **A7 — Retelling quality is judged by the criteria already drafted locally** — Waldorf-informed storytelling, story fidelity, age appropriateness, delivery, and useful feedback with *no overall score or ranking*. *If false:* scoring/rubric design must be reopened with the reviewer.

### Product and documents

- **A8 — Documents are generated per family/child and per grade/age,** then edited by the parent, not auto-filed with any authority. *If false:* official templates, signatures, submission formats, and audit requirements apply.
- **A9 — The six documents share structured source data.** One curriculum/content model can render all six (program → grade detail → alignment matrix → year plan → timetable → journal/records) without six separate generators. *If false:* document generators decouple and Phase 3 tasking grows.
- **A10 — Generation means drafting assistance, not authoritative authorship.** AI-generated program text requires parent review before use. *If false:* human-in-the-loop editing can be thinner.
- **A11 — XuVi Story's scene division is semi-automatic.** An AI proposes scenes/characters/essential details; the parent edits them (story map). *If false* (fully manual or fully automatic): the interaction and the AI contract both change.

### Technology

- **A12 — The nine named "Meta products" are evaluable as real, accessible offerings** (API, model weights, or hosted inference) with discoverable pricing, data terms, and Vietnamese-language capability. *If false for any item* (research preview, waitlist, no API, no Vietnamese): Phase 2 must record it as unavailable and name the fallback, rather than assuming it.
- **A13 — Cloud AI is acceptable for story text, generated images, and voice.** Parents will consent to sending story text and retelling audio to AI services, provided privacy controls (private by default, export/delete, disclosure of when data leaves the device) exist. *If false:* on-device or self-hosted inference becomes a hard requirement.
- **A14 — Vietnamese speech-to-text of sufficient quality exists** for retelling transcription, including correction of the transcript by the parent. *If false:* feedback must degrade gracefully to transcript-free or audio-only comparison.
- **A15 — Reference corpora in `tmp/` may be used as product seed/reference content.** The three Waldorf curriculum compilations, the Vietnamese story text, and the MOET PDF are usable beyond private research. *If false:* they inform research only, and product content must be authored or licensed separately.
- **A16 — A single-family, single-parent deployment is the initial scale.** No multi-school tenancy, high concurrency, or offline-first operation is required for v1. *If false:* architecture and cost research must cover tenancy, sync, and offline.

---

## 2. Items to Investigate / Research (b)

Phase 2 must answer every item below or explicitly mark it unresolved with the blocking reason. Items are grouped; IDs (R#) will be cited in the synthesis so coverage is auditable.

### 2.1 Domain: Waldorf pedagogy for homeschooling

- **R1 — Waldorf structure to encode.** Developmental stages, main-lesson block rhythm, subject set, instructional hours, teaching methods, and assessment principles in the local Waldorf references; what is distinctive vs. generic homeschooling.
- **R2 — Grade/age coverage.** Whether the product spans mầm non (ages 2–7) through lớp 12, and how banding differs across the three local corpora (classical Waldorf, Waldorf–Cambridge, Nhà Thuận Nhiên).
- **R3 — Vietnamese Waldorf practice.** How Vietnamese folktales, festivals, language (29-letter Vietnamese alphabet), and handwork localize the imported Waldorf canon.
- **R4 — Assessment without conventional testing.** How Waldorf assessment (observation, artifacts, periodic narrative reports) maps onto the "teaching journal and student assessment records" document.

### 2.2 Official curriculum and alignment

- **R5 — MOET General Education Curriculum (GDPT 2018, TT32) structure.** Subjects, required outcomes (yêu cầu cần đạt) by grade, instructional hours, and competency/quality framework — extracted from the local 1,555-page PDF and cross-checked against official MOET sources.
- **R6 — Alignment method.** How to build the alignment matrix (official outcome ↔ homeschool content ↔ allocated time ↔ verification method ↔ degree of alignment) so a parent can evidence coverage without misrepresenting Waldorf sequencing (e.g., delayed formal academics).
- **R7 — Legal/regulatory context of homeschooling in Vietnam.** What is recognized, what documentation families actually need, and what claims the product must *not* make. (Research must flag uncertainty here rather than assert legality.)

### 2.3 XuVi Story (deep dive)

- **R8 — End-to-end practice loop.** Upload/extraction (DOC/DOCX, PDF, HTML, Markdown, plain text) → audience settings (age, language, context, practice goal) → story map (scenes, characters, essential details) → visual recall → practice modes (with prompts, fading prompts, free retelling) → recording → feedback and retry → practice history (including the optional seven-day rhythm).
- **R9 — Scene segmentation.** How an AI divides a folktale into memorable scenes while preserving key events, relationships, causes, and culturally meaningful details; edit model for the story map; handling of long/chaptered stories.
- **R10 — Illustration generation.** Wet-on-wet watercolor, wax crayon, colored pencil and related Waldorf styles; age-appropriateness and cultural-accuracy review; replacement by keywords or the parent's own sketches/uploads.
- **R11 — Retelling capture and transcription.** In-app recording vs. upload, transcript correction, labeling of attempts (with/without image prompts, text/keyword assistance tracked separately), and replay.
- **R12 — Comparative feedback.** How a retelling is compared to the selected story version and story map: fidelity (omissions vs. intentional adaptations), vivid language/coherence/imagination space, age appropriateness, and delivery (pacing, pauses, vocal expression from audio, not transcript alone). Output form: strengths, missing/altered details, one practical next step, with excerpts or timestamps; no overall score.
- **R13 — Evaluation validity.** The exploratory A/B comparison already sketched (two matched unfamiliar stories, equal prep time, blinded independent teacher review); what it can and cannot claim.

### 2.4 The six generated documents

- **R14 — Shared content model.** Entities and fields that let one source render all six documents (subjects, objectives, outcomes, hours, methods, materials, themes/projects, timetable slots, journal entries, artifacts, reports).
- **R15 — Per-document requirements.** For each of the six: minimum content from the master prompt, natural owner inputs, export formats (print/PDF at minimum), and edit/review workflow.
- **R16 — Generation strategy.** Template + structured-data rendering vs. free LLM drafting per document; where AI drafting helps (narrative program text) and where deterministic rendering is safer (timetable, alignment matrix, hours arithmetic).

### 2.5 Meta products and tech stack

- **R17 — Identity and availability of each named product.** For Wonder, Spark, Image, Voice Transcribe, SAM 3.1, Spark Open, Glimmer, Baseten, Modal, and Fireworks: what it actually is (model, API, hosting platform, or research artifact), who offers it, access path (API key, cloud account, weights download), pricing model, data-processing terms, and regional availability from Vietnam.
- **R18 — Capability fit per product need.** Map each product need — (i) story understanding/scene segmentation, (ii) Vietnamese text generation for documents/feedback, (iii) Waldorf-style illustration generation/editing, (iv) Vietnamese speech-to-text, (v) audio delivery analysis (prosody/pause), (vi) image segmentation/understanding if needed for uploaded sketches/photos — to candidate Meta products and to non-Meta alternatives.
- **R19 — Vietnamese language quality.** Benchmark evidence or documented support for Vietnamese in the LLM/STT/image-prompt paths; failure modes (diacritics, tone, children's vocabulary, folktale register).
- **R20 — Reference stack.** Web app framework, auth, storage (files/audio/images), database, document/PDF export, background jobs for AI calls, and hosting — sized for a single-family v1 with a path to more families.

### 2.6 Cross-cutting

- **R21 — Privacy, safety, and rights.** Child-adjacent data minimization, private-by-default stories/recordings, export/delete, disclosure when data goes to AI services, story copyright/usage-rights metadata, and content safety for generated illustrations.
- **R22 — Cost and operations.** Per-story and per-document AI cost envelopes, storage growth from audio/images, free-tier limits, and what breaks first at 10× families.
- **R23 — Content provenance of `tmp/`.** Authorship, source repos, licenses, and internal caveats recorded in the three compilations (e.g., "not an official Waldorf/national standard", internal exam-status labels, `pending_confirmation` rows); what may seed the product vs. research-only.
- **R24 — Sample story corpus.** Whether [Việt Huyền Sử Ký](/Users/moc/Projects/xuvi-waldorf/tmp/Việt%20Huyền%20Sử%20Ký.md) is a usable end-to-end test story for XuVi Story (length, chaptering, age fit), alongside shorter folktales.

---

## 3. Preliminary Tech-Stack and Meta-Product Hypotheses (to be validated, not decided)

The master prompt asks for choices with reasoning recorded in the research plan. The table below records the *starting leanings* and the exact Phase 2 test that would confirm or overturn each. Final selection belongs to [02 Research Synthesis](/Users/moc/Projects/xuvi-waldorf/specs/02_research_synthesis.md).

| Need | Starting leaning | Phase 2 validation |
| --- | --- | --- |
| App stack | TypeScript web app (single codebase for UI + API), Postgres, object storage for audio/images, PDF export | R20: confirm against team/deployment constraints discovered in research; no mobile-native in v1 unless R8 shows recording needs it |
| Story understanding, scene segmentation, document drafting, feedback | One strong instruction-tuned LLM with Vietnamese support via API | R17–R19: test which of Wonder/Spark (and non-Meta LLMs) are real, accessible, and good at Vietnamese folktale register |
| Illustration generation (watercolor/crayon) | Dedicated image model with style control + parent review/replace step | R10, R17–R18: check Image (and alternatives) for Waldorf style fidelity, cultural accuracy, child-safety filters |
| Retelling transcription | Hosted Vietnamese STT with word timestamps | R14 path via Voice Transcribe if real/accessible; else benchmark alternatives (R19) |
| Delivery analysis (pacing/pauses) | Derive from STT timestamps + audio energy; no separate model initially | R12: verify timestamp granularity suffices before adding a prosody model |
| Image segmentation (SAM 3.1) | Only if a concrete need survives R18 (e.g., cutting out a parent's sketch or photo) | R17–R18: default is *not used* unless a named flow requires masks |
| Inference hosting (Baseten / Modal / Fireworks / Glimmer / Spark Open) | Prefer managed APIs; adopt a hosting platform only for a model that must be self-served | R17, R22: adopt only when an API gap (e.g., open weights, custom voice) forces self-hosting; compare cost/ops |

Explicit non-goal carried into Phase 2: the product is **not** required to use all nine named products. A product with no accessible API, no Vietnamese path, or no flow that needs it will be recorded as "evaluated, not used" with the reason — that is a valid Phase 2 outcome, not a gap.

---

## 4. Sources and Tools to Be Consulted (c)

### 4.1 Local sources (already in workspace)

| Source | What it is | Used for |
| --- | --- | --- |
| [Master Prompt: A Product for Waldorf-Inspired Homeschooling in Vietnam](/Users/moc/Projects/xuvi-waldorf/specs/00_master_prompt.md) | Product intent, XuVi Story mandate, six documents, Meta-product constraint | Scope (all R items) |
| [XuVi Story note (tmp/xuvistory)](/Users/moc/Projects/xuvi-waldorf/tmp/xuvistory.md) | XuVi Story features, evaluation criteria, demo/comparison sketch (31 lines) | R8–R13 |
| [Việt Huyền Sử Ký (tmp)](/Users/moc/Projects/xuvi-waldorf/tmp/Việt%20Huyền%20Sử%20Ký.md) | Long-form Vietnamese story text (~137k chars) | R24 sample corpus |
| [Waldorf cổ điển lớp 1–12 (tmp)](/Users/moc/Projects/xuvi-waldorf/tmp/01-Waldorf-co-dien-lop-1-12.md) | Classical Waldorf compilation, 12 grade docs, ~137k chars | R1–R3 |
| [Waldorf–Cambridge lớp 1–12 (tmp)](/Users/moc/Projects/xuvi-waldorf/tmp/02-Waldorf-Cambridge-lop-1-12.md) | Waldorf + Cambridge-milestone compilation, ~113k chars | R1–R2, R6 |
| [Nhà Thuận Nhiên mầm non–lớp 12 (tmp)](/Users/moc/Projects/xuvi-waldorf/tmp/03-Nha-Thuan-Nhien-mam-non-lop-12.md) | Thuận Nhiên workbook-derived compilation, 18 docs, ~325k chars | R1–R4 |
| [GDPT 2018 TT32 full PDF (tmp)](/Users/moc/Projects/xuvi-waldorf/tmp/01-GDPT2018-TT32-day-du-1555-trang-khong-watermark.pdf) | Official general education curriculum, 1,555 pages, ~15 MB | R5–R6 |

`tmp/` is git-ignored and machine-local; Phase 2 must extract and cite findings so the synthesis stands even where the raw files cannot be committed.

### 4.2 External sources (Phase 2, after APPROVE)

- **Official curriculum:** MOET publications for GDPT 2018 / Thông tư 32 and per-subject curriculum documents, to verify the local PDF's completeness and currency (R5–R7).
- **Homeschooling regulation:** Vietnamese education law/guidance on family-based education and any provincial practice, treated as uncertain until a primary source is found (R7).
- **Waldorf references:** Steiner/Waldorf curriculum and storytelling pedagogy sources beyond the local compilations, used only to triangulate R1–R4, never to override the family's chosen local corpus silently.
- **Meta product documentation:** Official product/model pages, API references, pricing, and data terms for Wonder, Spark, Image, Voice Transcribe, SAM 3.1, Spark Open, Glimmer, Baseten, Modal, Fireworks (R17–R19). Where a name maps to multiple or no real offerings, that ambiguity is itself a finding.
- **Alternative/complement vendors:** At least one non-Meta candidate per AI need (LLM, image, STT) so no Meta selection is made without a comparison baseline (R18–R19, R22).
- **Vietnamese STT/LLM benchmarks:** Published Vietnamese evaluations where they exist; otherwise a small hands-on probe with folktale text and recorded retelling audio in Phase 2 if tooling permits (R19).

### 4.3 Tools

- **File inspection:** local read/search over `specs/` and `tmp/`; structured extraction of the TT32 PDF (text extraction with page citations; the current shell lacks `pdfinfo`, so Phase 2 must pick and verify a PDF tool before relying on it).
- **Web research:** web search and page fetch for official MOET, Meta product, pricing, and benchmark sources, with URLs preserved in the synthesis.
- **Hands-on probes (only if Phase 2 scope allows):** throwaway scripts under `/tmp` for STT/LLM/image API trials and PDF extraction checks — never committed as product code, never using real child data.
- **Version control:** Git history of this repo to confirm which reference files are tracked vs. machine-local.

---

## 5. Phase 2 Method, Deliverable, and Decision Gates

**Method.** For each R item: consult the listed sources, record evidence with citations (page/section/URL), state the finding, state the constraint it imposes, and — where sources conflict (the three Waldorf corpora will conflict) — name the conflict instead of silently merging. Hands-on probes are time-boxed and reported with exact inputs/outputs, including failures.

**Deliverable.** [02 Research Synthesis](/Users/moc/Projects/xuvi-waldorf/specs/02_research_synthesis.md) containing, per the operating protocol: key findings, technical constraints, and architectural recommendations — plus (i) a verdict table for all nine Meta products (use / evaluate further / not used, with reason), (ii) a recommended stack, (iii) an explicit list of unresolved items, and (iv) the shared content model sketch for the six documents.

**Gates and circuit breakers.**

- Phase 2 starts only after the reviewer replies `APPROVE` on this plan (edits to assumptions or scope before approval are expected and cheap).
- If a named Meta product cannot be identified or accessed, Phase 2 records that and moves on with the fallback; it does not stall the whole synthesis.
- If homeschooling legality (R7) cannot be established from primary sources, the synthesis must say so and design the documents as family planning/evidence tools without legal claims.
- Any finding that would change the product's fundamental shape (e.g., children as direct users, mandatory offline) stops Phase 2 and is reported before the synthesis is finalized.

**Out of scope for Phase 2.** No product code, no UI build, no account/API-key provisioning, no document templates implemented, and no commits beyond the spec files themselves. Those belong to Phases 3–5.

**Questions the reviewer may wish to settle at APPROVE time** (defaults in brackets if unanswered): grade span for v1 [mầm non–lớp 12 as research span; v1 UI may narrow], first language of UI/documents [Vietnamese], and whether the XuVi Story exploratory comparison (R13) is part of the product or only of its evaluation [evaluation only].

---

## 6. Execution Topology, Tooling Readiness, and Reviewer Inputs

This section records how Phase 2 will actually be run, with what, and what it needs from the reviewer — so the `APPROVE` decision covers execution, not only research content. It is specific to the current executing session; if a different agent or session executes Phase 2, this section must be re-confirmed before starting.

### 6.1 Orchestration and models

- **Orchestrator:** the Muse session that launches Phase 2. It owns scope, workstream assignment, conflict resolution between sources, and the final synthesis in `02_research_synthesis.md`. It does not delegate the `APPROVE` gate or final verdicts. The orchestrator may itself run on the cheap default model (below); the judgment-heavy steps it supervises are explicitly escalated, so quality does not depend on the orchestrator's own tier.
- **Default worker model — `muse-spark-1.3-contributor`:** every research worker uses this model unless an escalation trigger below fires. Per the reviewer's price list it is roughly two orders of magnitude cheaper than `muse-wonder-1.0` ($0.002 / $0.10 / $0.20 vs. $0.2 / $4 / $20), so it carries all high-volume work: web search and page summarisation, local-corpus extraction, PDF text extraction and structuring, first-pass evidence tables, and draft mappings. Model choice is set explicitly on every workflow call; workers never silently inherit the parent session's model.
- **Escalation to `muse-wonder-1.0` — only for judgment, not volume:** (i) the adversarial critic, (ii) the final synthesis and all verdicts (including the nine-product verdict table), (iii) resolving conflicts between the three Waldorf corpora, (iv) legal interpretation under R7, and (v) a single retry of any worker that returns `complete: false`, thin evidence, or a critic flag. Everything else stays on the default.
- **Middle option — `muse-spark-1.3` (non-contributor):** used where the task is routine but the contributor tier's data-use terms are not acceptable for the material (see the caution below) and Wonder-level judgment is not needed.
- **Contributor data-use caution:** the contributor discount is tied to the listing note that submitted content, including inter-session messages, may be used by the provider. Before sending unpublished or third-party material (notably the `tmp/` corpora) to contributor workers in bulk, minimise verbatim excerpts, prefer local extraction tools to pre-digest content, and — unless the reviewer explicitly accepts those terms for that material — route that workstream to `muse-spark-1.3` or `muse-wonder-1.0` instead. This caution is the main limit on "as much as possible"; it does not block use for public sources (MOET publications, product documentation, benchmarks).
- **Workstreams (split by evidence surface, not by role name):**
  1. Waldorf pedagogy from the local corpora (R1–R4).
  2. MOET GDPT 2018 structure, alignment method, and homeschooling legal context (R5–R7).
  3. XuVi Story end-to-end (R8–R13).
  4. The six generated documents and their shared content model (R14–R16).
  5. The nine named Meta products, capability fit, and Vietnamese-language quality (R17–R19).
  6. Reference stack, cross-cutting concerns, cost, and `tmp/` provenance (R20–R24).
- **Evidence contract:** every worker returns a structured result — `complete`, `evidence[]`, `unresolved[]` — and must open and read every source body it cites (page, section, or URL). Search-result snippets locate candidates; they are not evidence. Notes and provenance references from each worker are carried into synthesis, and omitted scope is disclosed rather than silently dropped.
- **Verification:** after the six workstreams, one adversarial critic looks for concrete gaps and falsifiable weak claims; each surviving gap gets at most one focused follow-up. A final synthesis step then writes `02_research_synthesis.md` from the collected evidence only. Execution finishing is not treated as research completeness — unresolved items stay listed.
- **Effort estimate (indicative, not a cap):** roughly 8–9 agent runs in total (6 workers + critic + follow-up(s) + synthesis), each typically consuming on the order of tens of thousands of tokens, with the PDF-heavy workstream (R5–R7) the most expensive. Because all high-volume work runs on `muse-spark-1.3-contributor` and only the critic, synthesis, and any escalated retries use `muse-wonder-1.0`, cost is dominated by those few Wonder calls, not by token volume. Actual cost depends on how much of the 1,555-page TT32 PDF must be read at page level.

### 6.2 Search and research tools

- **Web discovery:** the session's built-in web search tool, used to find official MOET publications, Meta product/model documentation, pricing and data terms, and Vietnamese LLM/STT benchmarks (R5–R7, R17–R19).
- **Web reading:** the session's built-in page-fetch tool, used to read the full body of each source that will be cited; every cited URL is preserved in the synthesis.
- **Local inspection:** local file read and content search over `specs/` and `tmp/`, plus Git history to confirm which reference files are tracked vs. machine-local (R23).
- **No search API key is required.** Web search and page fetch are built into this session and need no key, account, or quota setup from the reviewer. If a source sits behind a login or paywall, it is recorded as unresolved with the blocking reason instead of being worked around.

### 6.3 Other tools and readiness

- **PDF extraction (known gap):** the TT32 PDF (1,555 pages) needs text extraction with page citations. This machine currently has no `pdfinfo`/`pdftotext` and no Python `pypdf`/`PyMuPDF` installed; `python3` and `uv` are available. Phase 2 will therefore first verify an extraction path (e.g., an ephemeral `uv run --with pypdf` environment) on a few pages before relying on it for R5–R6. This needs no reviewer action.
- **Hands-on probes (optional, time-boxed):** throwaway scripts under `/tmp` only — never committed, never using real child data — for small Vietnamese STT/LLM/image trials if Phase 2 scope allows (R19). Probe inputs and outputs, including failures, are reported verbatim.
- **Version control:** Git, for spec-file commits only during Phase 2.

### 6.4 What is needed from the reviewer

**Needed before Phase 2 can start:**

1. An explicit `APPROVE` of this plan (with any edits), per the operating protocol.
2. Confirmation or correction of the three defaults at the end of §5 (v1 grade span, Vietnamese as first UI/document language, R13 as evaluation-only).
3. Confirmation of assumptions A1–A3 (parent-as-teacher, children not direct app users, need to evidence MOET alignment). If any of these is wrong, the product shape changes and the plan must be revised before research starts.
4. Optional but helpful: any provenance or licensing information the reviewer already holds for the `tmp/` corpora (A15/R23). If none is provided, Phase 2 traces provenance itself and defaults those materials to research-only.

**Explicitly not needed for Phase 2 desk research:**

- No API keys, accounts, or billing setup — including no search API key (see §6.2).
- No product, cloud, or hosting accounts.

**Deferred to later phases:** API keys or accounts for any Meta product or alternative vendor (LLM, image, speech-to-text), and for any hosting platform (e.g., Baseten, Modal, Fireworks), are only needed if (a) the reviewer requests hands-on API probes during Phase 2 for a specific product, or (b) Phase 3's Pre-flight section lists them for implementation, to be verified in Phase 4. Phase 2 identifies which of the nine named products are real and accessible; it does not require accessing them.

---

*End of Phase 1 deliverable. Awaiting `APPROVE` (with any edits) before Phase 2 research execution begins.*
