## 1. Planning and Progress

- [x] 1.1 [orchestrator] Reread proposal, design, specs, tasks, native status, and apply instructions before implementation.
- [x] 1.2 [orchestrator] Create cumulative `apply-progress.md` with a current delegation plan for orchestrator and verifier work.

## 2. Governance Rules

- [x] 2.1 [orchestrator] Update `AGENTS.md` and `.agent/skills/spec-driven-development/SKILL.md` so the orchestrator profile and delegation gate are mandatory before apply.
- [x] 2.2 [orchestrator] Update `.agent/skill-registry.md`, `.agent/contracts/phase-handoff.md`, `.agent/agents/orchestrator.md`, `.agent/skills/implementation-progress/SKILL.md`, `.agent/README.md`, and operator/developer guides with owner tags, delegation-plan, and inline-fallback evidence rules.

## 3. Mechanical Validation

- [x] 3.1 [agent-verifier] Extend `scripts/harness-validation.mjs` to parse owner-tagged tasks, delegation plans, handoff history, and inline-fallback reasons.
- [x] 3.2 [agent-verifier] Add negative fixtures in `scripts/harness-validation.test.mjs` for missing delegation plan, missing owner handoff coverage, and missing inline fallback reason.

## 4. Verification

- [x] 4.1 [agent-verifier] Run focused harness validation tests and fix failures without weakening checks.
- [x] 4.2 [agent-verifier] Run `openspec validate enforce-delegation-gate --strict`.
- [x] 4.3 [agent-verifier] Run `pnpm verify:fast` and fix failures.
- [x] 4.4 [agent-verifier] Run `pnpm verify` and fix failures.
- [x] 4.5 [agent-verifier] Reconcile `tasks.md` and `apply-progress.md` so implementation evidence matches completed tasks.
