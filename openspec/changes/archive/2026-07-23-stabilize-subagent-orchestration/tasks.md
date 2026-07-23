## 1. Apply Readiness and Progress

- [x] 1.1 [orchestrator] Run native apply preflights, reread all planning artifacts, and create `apply-progress.md` schema v2 with the approved checkpoint, proportional execution plan, budgets, milestones, exact skills, and exclusive artifacts.

## 2. Portable Harness Governance

- [x] 2.1 [orchestrator] Split root and executor bootstrap behavior across `AGENTS.md`, the SDD skill, registry, and orchestrator guidance using the `HARNESS_EXECUTOR_V1` marker and without changing product lifecycle or archive guarantees.
- [x] 2.2 [orchestrator] Upgrade the phase-handoff and implementation-progress contracts to separate execution mode from skill resolution, add lifecycle/budget/recovery evidence, and permit planned inline execution without a fallback reason.
- [x] 2.3 [orchestrator] Update every specialized role profile, including bounded consultative/authoring modes for the architect, exact executor inputs, one-writer ownership, and no root reclassification or redelegation.
- [x] 2.4 [orchestrator] Add portable, Codex-native, and generic runtime-adapter documentation and reconcile `.agent/README.md` with the adapter boundary and proportional execution matrix.

## 3. Native Codex Adapter

- [x] 3.1 [orchestrator] Add `.codex/config.toml` with bounded multi-agent settings and five project-scoped `.codex/agents/*.toml` adapters that reference the portable role profiles and apply role-appropriate reasoning defaults.
- [x] 3.2 [orchestrator] Validate the Codex adapter structure and document how native spawn, activity, steering, waiting, interruption, and completion map to portable lifecycle semantics without invoking `codex exec`.

## 4. Mechanical Validation

- [x] 4.1 [orchestrator] Upgrade `scripts/harness-validation.mjs` to validate delegation-plan schema v2, execution modes, budgets, milestones, fallback evidence, completed handoffs, exclusive-writer ownership, bootstrap separation, and native Codex agent references.
- [x] 4.2 [orchestrator] Extend `scripts/harness-validation.test.mjs` with coherent inline/subagent/runtime-fallback fixtures and negative cases for missing fields, false fallback, duplicate writers, malformed recovery, bootstrap regression, and missing or invalid Codex adapters.
- [x] 4.3 [orchestrator] Run focused Node harness tests and `pnpm validate:harness`, reconcile any failures, and record the provisional results in progress evidence.

## 5. Operator and Developer Guidance

- [x] 5.1 [orchestrator] Update `harness-docs/` guides with the root/executor split, execution decision matrix, lifecycle milestones, default budgets, one-recovery rule, single-writer rule, architect consultation pattern, and runtime-adapter responsibilities.
- [x] 5.2 [orchestrator] Reconcile all examples and terminology so `inline`, `subagent`, `runtime-fallback`, and `paths-injected` are used consistently and obsolete `inline-fallback` guidance remains only in immutable archive history.

## 6. Final Verification

- [x] 6.1 [agent-verifier] Review conformance against proposal, delta spec, design, tasks, and progress; run `pnpm verify`; and return PASS/FAIL plus exact command evidence without repairing implementation.
