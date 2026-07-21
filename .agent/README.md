# .agent Harness

This portable folder provides the technical-governance layer for the hybrid workflow.

## Core files

- AGENTS.md: root Codex bootstrap.
- skill-registry.md: exact skill resolver.
- contracts/phase-handoff.md: required specialized-role handoff.
- skills/spec-driven-development: lifecycle and OpenSpec-native state.
- skills/implementation-progress: cumulative progress and evidence.
- skills/behavior-testing: smallest valuable deterministic Vitest/component layer.
- skills/verification-harness: final gates and archive readiness.
- agents/: bounded role definitions.
- reference/: examples only, never executable specs.

## Operating model

docs -> OpenSpec -> .agent -> implementation -> verification -> archive

OpenSpec owns executable state and accepted behavior. .agent supplies technical rules. Do not create an alternate change-state engine.

For a new product capability absent from project context and requirements, the
orchestrator delegates a documentation-only synchronization handoff to
`agent-requirements-curator` before OpenSpec planning. The curator uses
`docs/documentation-inventory.md`, records the outcome in the brief, and later
reconciles documentation before final verification without receiving code or
verification work.

Every implemented change uses tasks.md as completion authority, apply-progress.md for cumulative context, and verify-report.md for final PASS or FAIL evidence.

Skills are resolved from the registry and passed as exact paths. Implemented OpenSpec work records a delegation plan before edits, owner-tags specialized tasks, and reconciles completed owner work with handoff history. Executors cannot redelegate. A runtime without subagents uses an inline role fallback with the same file boundaries and a recorded fallback reason.
