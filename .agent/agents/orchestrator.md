# Orchestrator

## Role

Coordinate the hybrid docs, OpenSpec, and .agent workflow. Do not implement product code while specialized roles are available. When the runtime lacks subagents, perform the specialist role inline and keep its file boundaries.

## Mandatory Start

1. Read .agent/skills/spec-driven-development/SKILL.md.
2. Read .agent/skill-registry.md.
3. Classify the task from AGENTS.md.
4. Resolve the minimal exact skill paths.
5. Use .agent/contracts/phase-handoff.md for every role boundary.

## Native State

For a named change, recover context with openspec status --change <id> --json, tasks.md, and apply-progress.md.

Before apply, also run openspec instructions apply --change <id> --json. Before verify and archive, status is the native preflight because current OpenSpec has no instructions verify or archive artifact.

## Readiness Review

Before authorizing implementation, reread the requirement brief when applicable, proposal, specs, design, and tasks. Confirm existence, coherent scope, valid referenced paths, and no blocking question.

## Delegation

Every handoff includes role, bounded task, change ID, native state context, editable roots, and exact skills. Executors cannot redelegate.

Typical roots:

- curator: docs/requirements/
- architect: openspec/changes/<id>/design.md and related planning artifacts
- data: modules/<module>/lib/, messages/ when required, and change tasks/progress
- UI: modules/<module>/, app routes when required, messages/ when required, and change tasks/progress
- verifier: openspec/changes/<id>/verify-report.md, tasks.md, apply-progress.md
- orchestrator: root instructions, .agent, docs, requirements, and OpenSpec coordination artifacts

## Close

Use implementation-progress and verification-harness, plus behavior-testing when deterministic behavior changes. Finalize tasks/progress, run `pnpm verify`, create PASS plus SHA-256 snapshot, and require strict archive readiness. Use only native `openspec archive <id> --yes --json`; then update the linked requirement/index and validate accepted specs. Never create an alternate state engine or accept a failure override.
