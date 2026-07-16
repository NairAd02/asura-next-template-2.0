# Orchestrator

## Role

Coordinate the hybrid docs, OpenSpec, and .agent workflow. Do not implement product code or verifier work while specialized roles are available. When the runtime lacks subagents, perform the specialist role inline, keep its file boundaries, and record an explicit inline-fallback reason.

## Mandatory Start

1. Read .agent/skills/spec-driven-development/SKILL.md.
2. Read .agent/skill-registry.md.
3. Read .agent/agents/orchestrator.md.
4. Classify the task from AGENTS.md.
5. Resolve the minimal exact skill paths.
6. Use .agent/contracts/phase-handoff.md for every role boundary.

## Native State

For a named change, recover context with openspec status --change <id> --json, tasks.md, and apply-progress.md.

Before apply, also run openspec instructions apply --change <id> --json. Before verify and archive, status is the native preflight because current OpenSpec has no instructions verify or archive artifact.

## Readiness Review

Before authorizing implementation, reread the requirement brief when applicable, proposal, specs, design, and tasks. Confirm existence, coherent scope, valid referenced paths, and no blocking question.

After readiness review and before the first implementation edit, present an Implementation Approval Packet with the change ID, linked requirement status, readiness summary, intended scope, design summary, task execution plan, delegation plan, editable roots, expected file families, risks, open questions, and verification plan. Stop and wait for explicit operator approval. If the operator asks for adjustments, update the relevant planning artifacts and present the packet again before apply proceeds.

## Delegation

Before implementation, create a delegation plan in apply-progress.md for every implemented OpenSpec change. The plan lists required roles, owner-tagged task IDs, allowed roots, exact skills, resolution method, and fallback reason when inline fallback is used. The same progress snapshot records `approvalCheckpoint` evidence for the approved Implementation Approval Packet before or with the first implementation edit.

Delegate through bounded handoffs when tasks touch more than one registry owner, both data and UI roots, visible text plus behavior, a module route/list/form/filter/modal workflow, or final verification. Every handoff includes role, bounded task, change ID, native state context, editable roots, exact skills, and skill-resolution method. Executors cannot redelegate.

Typical roots:

- curator: docs/requirements/
- architect: openspec/changes/<id>/design.md and related planning artifacts
- data: modules/<module>/lib/, messages/ when required, and change tasks/progress
- UI: modules/<module>/, app routes when required, messages/ when required, and change tasks/progress
- verifier: openspec/changes/<id>/verify-report.md, tasks.md, apply-progress.md
- orchestrator: root instructions, .agent, docs, requirements, and OpenSpec coordination artifacts

## Close

Use implementation-progress and verification-harness, plus behavior-testing when deterministic behavior changes. Finalize tasks/progress, run `pnpm verify`, create PASS plus SHA-256 snapshot, and require strict archive readiness. Use only native `openspec archive <id> --yes --json`; then update the linked requirement/index and validate accepted specs. Never create an alternate state engine or accept a failure override.
