# .agent Harness

This portable folder provides the runtime-neutral technical-governance layer
for the hybrid workflow.

## Core files

- `AGENTS.md`: root-orchestrator versus executor bootstrap.
- skill-registry.md: exact skill resolver.
- contracts/phase-handoff.md: required specialized-role handoff.
- skills/spec-driven-development: lifecycle and OpenSpec-native state.
- skills/implementation-progress: cumulative progress and evidence.
- skills/behavior-testing: smallest valuable deterministic Vitest/component layer.
- skills/verification-harness: final gates and archive readiness.
- agents/: bounded role definitions.
- runtime-adapters/: portable lifecycle semantics and runtime-specific mappings.
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

Every implemented change uses tasks.md as completion authority,
apply-progress.md for cumulative context, and verify-report.md for final PASS or
FAIL evidence.

The root reads SDD, registry, and orchestrator guidance. A non-root executor, or
any assignment marked `HARNESS_EXECUTOR_V1`, reads only the phase-handoff
contract, its exact role profile, and the exact skills in its assignment.

Skills are resolved from the registry and passed as exact paths. Implemented
OpenSpec work records a schema-v2 delegation plan before edits, owner-tags
specialized tasks, and reconciles completed owner work with handoff history.
Role ownership is separate from execution mode:

| Work shape | Default |
|---|---|
| Small, tightly coupled critical-path work | `inline` |
| Independent research/review or bounded one-writer work | `subagent` |
| Planned subagent cannot complete after bounded recovery | `runtime-fallback` |

Default minimum observation budgets are 10 minutes for planning/curation, 20
for implementation, and 15 for verification. Polling intervals are not
deadlines. Only one active writer owns each exclusive artifact, and recovery
stops the previous writer before reassignment.

Portable meanings live here; native registration and thread controls live in a
runtime adapter. Codex uses `.codex/config.toml` and `.codex/agents/*.toml`.
Other runtimes map their own mechanisms or deliberately plan `inline`.
