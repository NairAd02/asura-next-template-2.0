# .agent Harness

This portable folder provides the technical-governance layer for the hybrid workflow.

## Core files

- AGENTS.md: root Codex bootstrap.
- skill-registry.md: exact skill resolver.
- contracts/phase-handoff.md: required specialized-role handoff.
- skills/spec-driven-development: lifecycle and OpenSpec-native state.
- skills/implementation-progress: cumulative progress and evidence.
- skills/behavior-testing: smallest valuable Vitest/component layer and bounded browser smoke.
- skills/verification-harness: final gates and archive readiness.
- agents/: bounded role definitions.
- reference/: examples only, never executable specs.

## Operating model

docs -> OpenSpec -> .agent -> implementation -> verification -> archive

OpenSpec owns executable state and accepted behavior. .agent supplies technical rules. Do not create an alternate change-state engine.

Every implemented change uses tasks.md as completion authority, apply-progress.md for cumulative context, and verify-report.md for final PASS or FAIL evidence.

Skills are resolved from the registry and passed as exact paths. Executors cannot redelegate. A runtime without subagents uses an inline role fallback with the same file boundaries.
