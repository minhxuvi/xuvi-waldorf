# WORKFLOW OPERATING PROTOCOL (SPEC-DRIVEN AGENT)

You operate under a strict 5-Phase Spec-Driven Development protocol managed through local Markdown artifacts (`00` to `04`). The filesystem is the single source of truth. Never skip phases, assume unverified requirements, or proceed past a gate without explicit user approval.

---

## 0. Bootstrap & State Detection (Run on Session Start)
Before taking any action in a new or resumed session, inspect the workspace for existing workflow files (`00_master_prompt.md` through `04_progress_log.md`):
- Determine the current active phase based on existing files and their `Status: [DRAFT | APPROVED | IN_PROGRESS | COMPLETED]` header.
- If `04_progress_log.md` exists, read it first to identify the last completed task, recent git commits, and any unresolved blockers, then resume seamlessly from that exact point.

---

## 1. File Interaction & Co-Editing Rules
- **Disk-First Rule:** Always re-read a spec file from disk immediately before editing or reviewing it. Never rely on cached conversation history for file contents.
- **Direct User Edits:** Treat any manual changes made by the user to a file as authoritative design overrides. When asked to review a user-edited file:
  1. Diff/analyze the user's changes against the rest of the document.
  2. Flag any logical contradictions, missing dependencies, security risks, or technical infeasibilities.
  3. Update dependent sections surgically without overwriting user-authored constraints.
  4. If the file is coherent and feasible, confirm readiness and await `APPROVE`.
- **Inline `@AI:` Directives:** Scan files for `@AI: <instruction/question>`. Resolve each directive directly in the relevant section of the file, and remove the `@AI:` tag only after its resolution is written into the document.
- **Document Header:** Every generated spec file (`01`, `02`, `03`) must begin with the metadata line:
  `> Status: DRAFT | Last Updated: YYYY-MM-DD`
  Update `Status` to `APPROVED` only when the user explicitly approves that phase.

---

## 2. Mandatory 5-Phase Execution Lifecycle

### Phase 1: Research Planning (`01_research_plan.md`)
- **Trigger:** Presence of `00_master_prompt.md`.
- **Action:** Analyze `00_master_prompt.md` and generate `01_research_plan.md` containing:
  1. **Assumptions & Open Questions:** Implicit assumptions that require user confirmation and ambiguities that could alter scope.
  2. **Investigation Scope:** Specific codebases, APIs, libraries, edge cases, and constraints to examine.
  3. **Sources & Tooling:** Documentation, local directories, or external tools to query.
- **Gate 1:** **STOP.** Ask the user to review/edit `01_research_plan.md`. Do not execute research until the user replies `APPROVE` (or sets `Status: APPROVED`).

### Phase 2: Research Execution & Synthesis (`02_research_synthesis.md`)
- **Trigger:** `01_research_plan.md` is `APPROVED`.
- **Action:** Execute the approved research plan. Distill all findings into a concise, high-signal `02_research_synthesis.md` containing:
  1. **Key Technical Findings & Constraints:** Verified facts, environment realities, and hard limits.
  2. **Architecture & Trade-off Analysis:** Recommended approach vs. viable alternatives.
  3. **Resolved Decisions:** Clear answers to the open questions from Phase 1.
- **Gate 2 (Conditional):**
  - If research uncovers **critical blockers** or **major architectural trade-offs** requiring a human decision, **STOP** and ask the user to review `02_research_synthesis.md`.
  - Otherwise, immediately proceed to Phase 3 (or recommend a context reset before Phase 3 if context usage is heavy).

### Phase 3: Implementation Planning (`03_implementation_plan.md`)
- **Trigger:** Completion/Approval of `02_research_synthesis.md`.
- **Action:** Using `02_research_synthesis.md` as the primary reference, generate `03_implementation_plan.md` containing:
  1. **Pre-flight Requirements & Permissions:** Exhaustive checklist of required CLI tools, file/directory permissions, network access, API keys, `.env` variables, and background services needed for uninterrupted autonomous execution.
  2. **Safety Guardrails (Denylist):** Destructive commands, protected directories/branches, or external mutations strictly off-limits during execution.
  3. **Phased Atomic Tasks & Verification (Definition of Done):** Ordered, bite-sized implementation tasks. Every single task MUST specify an exact, automated verification command (unit test, integration test, build check, or CLI assertion) that proves completion.
- **Gate 3:** **STOP.** Wait for the user to review/edit `03_implementation_plan.md` and explicitly reply `APPROVE`.

### Phase 4: Pre-flight Verification & Dry Run
- **Trigger:** `03_implementation_plan.md` is `APPROVED`.
- **Action:**
  1. Guide the user step-by-step to grant the permissions, secrets, and environment setups listed in **Pre-flight Requirements**.
  2. Once the user confirms setup is complete, run automated **Pre-flight Smoke Tests** (non-destructive dry runs verifying tool versions, read/write permissions, test runner execution, and API/DB connectivity).
- **Gate 4:** Only transition to Phase 5 when **100% of Pre-flight Smoke Tests pass**. If any check fails, halt and help the user resolve the environment issue first.

### Phase 5: Autonomous Execution Loop & Progress Tracking (`04_progress_log.md`)
- **Trigger:** 100% Pre-flight pass.
- **Action:** Initialize `04_progress_log.md` if it does not exist, then execute tasks sequentially from `03_implementation_plan.md`:
  1. **Scope Isolation:** Implement only what is specified in the current active task. Do not perform unrequested refactoring or touch unrelated files.
  2. **Verify & Regress:** Run the task's specific verification command PLUS existing test suites to ensure zero regressions.
  3. **Checkpoint:** When verification passes:
     - Mark the task `[x]` in `03_implementation_plan.md` and log completion details in `04_progress_log.md`.
     - Create an atomic Git commit (if inside a Git repository) with a clear commit message referencing the task ID.
     - Advance immediately to the next task without waiting for user input.

---

## 3. Circuit Breaker & Anti-Gaming Rules (Strictly Enforced)
- **Zero Test Manipulation:** Never weaken, delete, mock away core logic, or hardcode return values just to make a failing test pass. Tests must validate real behavior defined in `03_implementation_plan.md`.
- **3-Strike Circuit Breaker:** If a task fails verification **3 consecutive times** after attempted fixes, OR if fixing the issue requires deviating from the approved architecture in `03_implementation_plan.md`:
  1. **HALT** autonomous execution immediately.
  2. Revert uncommitted broken changes to keep the working tree clean (or stash them clearly).
  3. Log the exact error output, the 3 attempted hypotheses, and the root-cause analysis in `04_progress_log.md`.
  4. Report the blocker clearly to the user and propose options before taking further action.
