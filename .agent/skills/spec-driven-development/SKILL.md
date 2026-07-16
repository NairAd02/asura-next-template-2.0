---
name: spec-driven-development
description: Load first for every task. Defines the hybrid docs, OpenSpec, and .agent protocol.
---

# Hybrid Spec-Driven Development

## Principle

- docs/ is project knowledge and curated requirement intent.
- OpenSpec is the only executable change and accepted-behavior layer.
- .agent is technical governance: skills, roles, contracts, and reference patterns.

The durable path is:

docs -> OpenSpec -> .agent -> implementation -> verification -> archive

## Entry Classification

Read .agent/skill-registry.md after loading this skill.

| Incoming task | Required path |
|---|---|
| Broad, ambiguous, or product intent | Read project context and use requirements-curation before executable work. |
| Clear behavior change | Create or update an OpenSpec change. Use the linked brief when it exists. |
| Active change | Recover with OpenSpec status, tasks.md, and apply-progress.md. Do not create a duplicate change. |
| Refactor, documentation, or internal work without accepted-contract change | Use .agent and verification. OpenSpec is optional; do not force a requirement brief. |
| Close request | Verify, reconcile evidence, update the requirement when applicable, then archive. |

## Native State Preflights

OpenSpec owns state. Never create a custom phase tracker.

- Before apply: run openspec status --change <id> --json and openspec instructions apply --change <id> --json.
- Before verification: run openspec status --change <id> --json.
- Before archive: run openspec status --change <id> --json.
- Current OpenSpec 1.6 exposes no instructions verify or archive artifact. Do not emulate those unsupported phases; status remains the native authority.

## Research and Readiness

Before approving implementation:

1. Read the linked requirement brief when one applies.
2. Read proposal, delta specs, design, and tasks.
3. Check that required artifacts exist.
4. Check scope coherence across artifacts.
5. Check referenced paths are valid or explicitly planned.
6. Resolve blocking questions before apply.
7. Select only exact skills from the registry.

A requirement brief is needed for broad product intent, business rules, permissions, flows, or behavior changes. It is not mandatory for an internal technical task with no contract change.

## Implementation

- Follow tasks.md; update its checkboxes as tasks complete.
- Load the implementation-progress skill for every implemented change.
- Create and update apply-progress.md cumulatively.
- Keep tasks.md as the completion authority.
- Load behavior-testing when deterministic behavior changes and make the owning executor create the smallest valuable tests with the implementation.
- Use `pnpm verify:fast` only as provisional feedback while implementation is changing.
- Update proposal, specs, design, or tasks before continuing when implementation discovers a scope or behavior change.
- Use shared components and existing dependencies before creating new abstractions.
- Preserve strict TypeScript and existing module conventions.

## Delegation and Inline Fallback

Use .agent/contracts/phase-handoff.md for every specialized role.

- Pass role, bounded task, change ID, native status, allowed roots, exact skill paths, and relevant requirement context.
- Executors cannot redelegate.
- In a runtime without subagents, execute the specialist role inline with the same responsibilities and allowed roots.
- A role reports status, summary, artifacts, files, completed tasks, risks, next phase, and skill-resolution method.

## Verification and Archive

- Use the verification-harness and implementation-progress skills at close, plus behavior-testing when deterministic behavior changes.
- Run `pnpm verify` for specs/harness validation, unit/component tests, non-incremental typecheck, full lint, and build.
- Persist verify-report.md with PASS or FAIL.
- Any later implementation or change-artifact modification invalidates the report and requires the final command and fresh evidence again.
- Continuous harness validation permits a reconciled in-progress change without final evidence. Strict `--archive-ready` validation requires all tasks complete, progress `ready-for-archive`, and a fresh PASS snapshot.
- Archive only after tasks, progress, report, and linked requirement close data are coherent. No pre-existing failure or confirmation can override PASS.
- Use only `openspec archive <change-id> --yes --json`; never move a change directory manually.

For `no-change` internal work, run applicable checks and return their evidence in the handoff/final response without change status, progress, or report artifacts.

Terminal order: finalize implementation and verification task definitions, run `pnpm verify`, finalize verification task IDs, generate PASS report plus SHA-256 snapshot, run status and strict archive readiness, archive natively, update requirement/index, then validate accepted specs.

## Reference Material

- .agent/reference/widget/ is a code-pattern reference only.
- .agent/reference/spec-example/ is a requirement-quality reference only.
- Executable specifications live only in openspec/specs and active changes.
