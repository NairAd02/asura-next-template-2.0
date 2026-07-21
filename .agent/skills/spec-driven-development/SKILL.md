---
name: spec-driven-development
description: Load first for every task. Defines the hybrid docs, OpenSpec, and .agent protocol.
---

# Hybrid Spec-Driven Development

## Principle

- docs/ is project knowledge and curated requirement intent. Its maintained
  documentation inventory makes review obligatory and limits edits to material
  affected by a new product capability or scope change.
- OpenSpec is the only executable change and accepted-behavior layer.
- .agent is technical governance: skills, roles, contracts, and reference patterns.

The durable path is:

docs -> OpenSpec -> .agent -> implementation -> verification -> archive

## Entry Classification

Read .agent/skill-registry.md and .agent/agents/orchestrator.md after loading this skill.

| Incoming task | Required path |
|---|---|
| Broad, ambiguous, or product intent | Read project context and use requirements-curation before executable work. When a new product capability is absent from project context and requirements, delegate mandatory documentation review first and update only impact-affected material. |
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
8. Create a delegation plan for implemented OpenSpec work before the first implementation edit.
9. Present an Implementation Approval Packet and stop until the operator explicitly approves it.

A requirement brief is needed for broad product intent, business rules, permissions, flows, or behavior changes. It is not mandatory for an internal technical task with no contract change.

For a new product capability absent from `docs/project-context.md` and the
requirements index, the orchestrator sends `agent-requirements-curator` a
bounded documentation-review handoff before OpenSpec planning. The curator
reviews `docs/documentation-inventory.md`, updates only source material
affected by the documented impact, and records `updated`, `no-change`, or
`not-applicable` outcomes with rationale in the brief.

The Implementation Approval Packet includes change ID, linked requirement status, readiness summary, intended scope and non-goals, design summary, task execution plan, delegation plan, editable roots, expected file families, risks, open questions, and verification plan. If the operator requests adjustments, update proposal, specs, design, or tasks first, then present the packet again.

## Implementation

- Follow tasks.md; update its checkboxes as tasks complete.
- Owner-tag tasks that map to specialized roles, using tags such as `[orchestrator]`, `[agent-data]`, `[agent-ui]`, `[agent-architect]`, or `[agent-verifier]`.
- Load the implementation-progress skill for every implemented change.
- Create and update apply-progress.md cumulatively. Before or with the first implementation edit, record `approvalCheckpoint` evidence for the approved Implementation Approval Packet.
- Keep tasks.md as the completion authority.
- Every product change linked to a requirement brief includes an
  `[agent-requirements-curator]` documentation-reconciliation task before final
  verification. The curator records the mandatory review, edits only
  impact-affected material, and persists its handoff in apply-progress.md
  before `pnpm verify`.
- Load behavior-testing when deterministic behavior changes and make the owning executor create the smallest valuable tests with the implementation.
- Use `pnpm verify:fast` only as provisional feedback while implementation is changing.
- Update proposal, specs, design, or tasks before continuing when implementation discovers a scope or behavior change.
- Use shared components and existing dependencies before creating new abstractions.
- Preserve strict TypeScript and existing module conventions.

## Delegation and Inline Fallback

Use .agent/contracts/phase-handoff.md for every specialized role. Do not implement product or verification work inline in the orchestrator thread while a specialized role is available.

- Before implementation, derive required roles from tasks, changed roots, and the registry.
- Require a bounded handoff when a change touches more than one registry owner, both data and UI roots, visible text plus behavior, a module route/list/form/filter/modal workflow, or final verification.
- Persist the delegation plan in apply-progress.md before or with the first implementation edit.
- Pass role, bounded task, change ID, native status, allowed roots, exact skill paths, and relevant requirement context.
- Executors cannot redelegate.
- In a runtime without subagents, execute the specialist role inline with the same responsibilities and allowed roots, record `Skill resolution: inline-fallback`, and include the concrete fallback reason in progress evidence.
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
