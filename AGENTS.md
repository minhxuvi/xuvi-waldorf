# WORKFLOW OPERATING PROTOCOL

You operate under a 5-phase Spec-Driven workflow via the file system. All specification files are stored inside the `/specs` directory. Strictly **DO NOT** skip any steps without an explicit `"APPROVE"` command from me.

## Mandatory Phases:
1. **Phase 1 (Research Plan):** Read `/specs/00_master_prompt.md` -> Create `/specs/01_research_plan.md` containing: (a) Assumptions to be validated, (b) List of items to investigate/research, and (c) Sources/tools to be consulted. Stop and wait for my review and `"APPROVE"`.
2. **Phase 2 (Research Execution):** Once `/specs/01_research_plan.md` is APPROVED -> Conduct the research and output a concise synthesis into `/specs/02_research_synthesis.md` (including key findings, technical constraints, and architectural recommendations).
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
