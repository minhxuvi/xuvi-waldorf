# WORKFLOW OPERATING PROTOCOL

You operate under a 5-phase Spec-Driven workflow via the file system. All specification files are stored inside the `/specs` directory. Strictly **DO NOT** skip any steps without an explicit `"APPROVE"` command from me.

## Mandatory Phases:
1. **Phase 1 (Research Plan):** Read `/specs/00_master_prompt.md` -> Create `/specs/01_research_plan.md` containing: (a) Assumptions to be validated, (b) List of items to investigate/research, (c) Sources/tools to be consulted, and (d) Execution & support requirements (see below). Stop and wait for my review and `"APPROVE"`.
2. **Phase 2 (Research Execution):** Once `/specs/01_research_plan.md` is APPROVED -> Conduct the research as described in its Execution & support requirements section (recording any deviation from the approved execution setup in the synthesis) and output a concise synthesis into `/specs/02_research_synthesis.md` (including key findings, technical constraints, and architectural recommendations).
3. **Phase 3 (Implementation Plan):** Based on `/specs/02_research_synthesis.md` -> Create `/specs/03_implementation_plan.md` containing:
   - **Pre-flight & Permissions**: List all access permissions, CLI tools, API keys, and environment variables required to run autonomously from start to finish without interruption.
   - **Guardrails**: Dangerous or destructive actions that must strictly never be performed autonomously.
   - **Phased Tasks & Verification**: Break the work down into step-by-step tasks; each step must clearly define a specific test/verification command (Definition of Done).
   Stop and wait for my review and `"APPROVE"`.
4. **Phase 4 (Pre-flight Check):** Guide me in granting the permissions listed in the Pre-flight section. As soon as I confirm they have been granted, run live verification commands (smoke test/dry-run) for all permissions and tools. Only proceed to Phase 5 when 100% of checks pass.
5. **Phase 5 (Autonomous Execution Loop):**
   - Sequentially execute each Task in `/specs/03_implementation_plan.md`.
   - After each Task: Run the verification test -> If Pass: update the status in `/specs/04_progress_log.md` and create a Git commit (if Git is available) -> Move to the next Task.
   - **Circuit Breaker Rule:** Strictly never modify a test just to force it to pass. If an error repeats for more than 3 consecutive fix attempts, or requires changing the architecture in `/specs/03_implementation_plan.md`, **STOP**, document the exact cause in `/specs/04_progress_log.md`, and report to me.

## Research Plan: Execution & Support Requirements

Every research plan created in Phase 1 must include a dedicated section describing how the research will be executed and what it needs from the reviewer, so the reviewer can approve the execution setup together with the research content. Keep this section generic enough to remain valid if a different agent, session, toolset, or model executes the next phase: describe roles, capabilities, and access methods rather than one vendor's product names, unless a name is itself a research subject. Where a concrete name is unavoidable, mark it as the current execution setup and require re-confirmation if the executor changes. The section must state:

- **Orchestration:** whether execution is single-agent or multi-agent; if multi-agent, the orchestrator/worker responsibilities, how work is split into workstreams, and how results are verified and synthesized (including how conflicting findings are handled).
- **Models:** the model or model tier for the orchestrator and for workers, if known at plan time; otherwise what must be confirmed before execution starts. Default to the cheapest model tier that is adequate for each task and state the explicit triggers for escalating to a stronger tier (for example final synthesis, adversarial review, conflict resolution, or retry after a failed result) instead of running everything on the strongest tier. Set the model explicitly where the tooling allows it rather than relying on silent inheritance. If a discounted tier carries different data-use terms (for example submitted content may be reused by the provider), state that constraint and which material it excludes before routing sensitive or unpublished content to that tier.
- **Search & discovery:** which search/discovery and source-reading tools or capabilities will be used, what each is used for, and how cited sources will be preserved.
- **Other tools & readiness:** any other tools the research depends on (for example file inspection, document/PDF processing, data analysis, or version control), their current availability if known, any known gap, and the fallback if a tool is unavailable.
- **Effort drivers:** the main drivers of time, cost, or usage (for example number of parallel workstreams or volume of material to read), as an indicative estimate rather than a guarantee.
- **Reviewer inputs:** every decision, approval, document, or piece of information needed from the reviewer, and at which phase each is needed.
- **Access & keys:** every API key, account, permission, or paid access the research depends on; if none is needed, state that explicitly. Distinguish what is needed for the research phase itself from what is deferred to later phases (for example implementation pre-flight).
