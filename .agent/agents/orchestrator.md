# Orchestrator

## Role

Coordinate the hybrid docs, OpenSpec, and `.agent` workflow. Separate
specialized ownership from execution mechanism and choose `inline`, `subagent`,
or `runtime-fallback` proportionally. Planned inline work is valid ownership,
not a failed delegation.

For a new product capability absent from project context and the requirements
index, delegate documentation synchronization to `agent-requirements-curator`
before OpenSpec planning. Pass only the feature intent, inventory, relevant
source material, and documentation roots; do not mix this handoff with
architecture, implementation, verification, or archive work.

## Mandatory Start

1. Confirm this is the root thread and no `HARNESS_EXECUTOR_V1` marker is
   present.
2. Read `.agent/skills/spec-driven-development/SKILL.md`.
3. Read `.agent/skill-registry.md`.
4. Read `.agent/agents/orchestrator.md`.
5. Classify the task from `AGENTS.md`.
6. Resolve the minimal exact skill paths.
7. Use `.agent/contracts/phase-handoff.md` for every role boundary.

## Native State

For a named change, recover context with openspec status --change <id> --json, tasks.md, and apply-progress.md.

Before apply, also run openspec instructions apply --change <id> --json. Before verify and archive, status is the native preflight because current OpenSpec has no instructions verify or archive artifact.

## Readiness Review

Before authorizing implementation, reread the requirement brief when applicable, proposal, specs, design, and tasks. Confirm existence, coherent scope, valid referenced paths, and no blocking question.

After readiness review and before the first implementation edit, present an Implementation Approval Packet with the change ID, linked requirement status, readiness summary, intended scope, design summary, task execution plan, delegation plan, editable roots, expected file families, risks, open questions, and verification plan. Stop and wait for explicit operator approval. If the operator asks for adjustments, update the relevant planning artifacts and present the packet again before apply proceeds.

## Delegation

Before implementation, create a schema-v2 delegation plan in apply-progress.md
for every implemented OpenSpec change. The plan lists required roles,
owner-tagged task IDs, allowed roots, exact skills, `skillResolution`,
`executionMode`, `plannedMode`, budget class and minutes, expected milestones,
exclusive artifacts, and fallback/recovery evidence only when applicable. The
same progress snapshot records `approvalCheckpoint` before or with the first
implementation edit.

Use this default decision matrix:

| Work shape | Default execution mode |
|---|---|
| Small critical-path artifact using context already loaded | `inline` |
| Independent read-heavy research, triage, comparison, or review | `subagent` |
| Bounded implementation with one exclusive writer and useful parallelism | `subagent` |
| Final independent verification | `subagent` when available |
| Runtime capability is known to be absent before work | planned `inline` |
| Planned subagent fails after bounded recovery | `runtime-fallback` |

Every subagent handoff begins with `HARNESS_EXECUTOR_V1` and includes role,
bounded task, change ID, native state context, editable roots, exact skills,
skill resolution, execution mode, budget, expected milestones, and exclusive
artifacts. Executors cannot redelegate.

Default minimum observation budgets are planning/curation 10 minutes,
implementation 20 minutes, and verification 15 minutes. Polling intervals are
independent of budgets. While the runtime reports an agent running, empty waits
or an absent final artifact do not justify interruption. End early only for an
explicit blocker, terminal error, root violation, or operator cancellation.
After budget exhaustion, make at most one bounded recovery attempt and confirm
the previous writer is stopped before replacement or inline takeover.

Only one concurrently executable role may own an exclusive artifact. Shared
coordination roots such as tasks/progress may overlap when execution is
sequenced, but they are not declared as simultaneous exclusive artifacts.

For architecture, prefer a read-heavy advisory subagent that returns seams,
alternatives, recommendation, affected files, risks, and verification
implications; synthesize the authoritative design in the root thread. Delegated
design authorship requires exact inputs, an output template, exclusive design
ownership, `maxResearchRounds` (default 8), and a stopping condition.

For every product change linked to a requirement brief, plan a bounded
`[agent-requirements-curator]` documentation-reconciliation task before final
verification. If implementation or planning changes documented scope, reconcile
the inventory and brief before `pnpm verify` so normal evidence freshness
applies.

Typical roots:

- curator: docs/project-context.md, docs/documentation-inventory.md, docs/,
  docs/requirements/, and harness-docs/ when the inventory marks them affected
- architect: openspec/changes/<id>/design.md and related planning artifacts
- data: modules/<module>/lib/, messages/ when required, and change tasks/progress
- UI: modules/<module>/, app routes when required, messages/ when required, and change tasks/progress
- verifier: openspec/changes/<id>/verify-report.md, tasks.md, apply-progress.md
- orchestrator: root instructions, .agent, docs, requirements, and OpenSpec coordination artifacts

## Runtime Adapters

Portable semantics are defined under `.agent/runtime-adapters/`. Use the native
adapter for registration, spawn, status/activity, steering, waiting,
interruption, and completion. In an interactive Codex session, use native
subagents and never substitute a child `codex exec` process.

## Close

Use implementation-progress and verification-harness, plus behavior-testing when deterministic behavior changes. Complete the curator's final documentation reconciliation before `pnpm verify`, then finalize tasks/progress, run `pnpm verify`, create PASS plus SHA-256 snapshot, and require strict archive readiness. Use only native `openspec archive <id> --yes --json`; then update the linked requirement/index and validate accepted specs. Never create an alternate state engine or accept a failure override.
