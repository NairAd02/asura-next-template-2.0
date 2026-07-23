# Codex Harness Entry Point

Before any task action, choose exactly one bootstrap path.

## Executor Bootstrap

Use the executor path when the runtime identifies this thread as non-root or the
assignment contains `HARNESS_EXECUTOR_V1`.

1. Read `.agent/contracts/phase-handoff.md`.
2. Read the exact `.agent/agents/<role>.md` path named by the handoff.
3. Read only the exact `SKILL.md` paths named by the handoff.
4. Execute only the bounded task inside its allowed roots and exclusive
   artifacts.
5. Return the complete phase-handoff output. Executors do not redelegate.

An executor does not repeat root task classification, requirements curation,
change creation, the orchestrator bootstrap, or the Implementation Approval
Packet. If its marker, role, task, roots, execution mode, budget, or skills are
missing, it reports `blocked` instead of reconstructing the root workflow.

## Root Orchestrator Bootstrap

Use the root path only when this is the root thread and no executor marker is
present. Read these exact files in order:

1. `.agent/skills/spec-driven-development/SKILL.md`
2. `.agent/skill-registry.md`
3. `.agent/agents/orchestrator.md`

Then classify the task:

- Broad, ambiguous, or product intent: use the requirements curator. If a new
  product capability is absent from project context and requirements, first
  delegate a bounded documentation review, update only material affected by the
  documented impact, then curate its brief.
- Ready behavior change: create or update an OpenSpec change.
- Named active change: recover from OpenSpec status, tasks.md, and apply-progress.md.
- Refactor, documentation, or internal work without an accepted-contract change: use .agent; OpenSpec is optional and no requirement brief is forced.
- Close request: verify evidence and archive readiness.

For an active change, treat OpenSpec as the only executable state authority:

- Before apply: run openspec status --change <id> --json and openspec instructions apply --change <id> --json.
- Before verify or archive: run openspec status --change <id> --json.
- OpenSpec 1.6 exposes no instructions verify or archive artifact. Do not invent a second state engine.
- For `no-change` work, run applicable checks without change status, apply-progress.md, or verify-report.md.

Resolve only the exact skill paths needed from `.agent/skill-registry.md`.
Every specialized handoff must use `.agent/contracts/phase-handoff.md`, begin
with `HARNESS_EXECUTOR_V1`, and name the role, bounded task, execution mode,
budget, allowed roots, exclusive artifacts, and exact skills.

Before implementation, create a schema-v2 delegation plan for every implemented
OpenSpec change. Role ownership and execution mode are separate:

- `inline`: a deliberate proportional choice for tightly coupled or small
  critical-path work;
- `subagent`: independent research, bounded implementation with one writer, or
  final independent verification when the runtime supports it;
- `runtime-fallback`: takeover only after a planned subagent cannot complete
  and bounded recovery evidence is recorded.

Default minimum observation budgets are 10 minutes for planning/curation, 20
minutes for implementation, and 15 minutes for verification. They are not
command timeouts or polling intervals and may be overridden per task. An empty
wait or a missing final artifact is not evidence that a running agent is hung.
After budget exhaustion, allow at most one bounded recovery attempt. Before a
replacement or inline takeover, stop the previous writer and confirm its
terminal state.

Only one active writer may own an exclusive artifact. Prefer subagents for
independent read-heavy investigation; keep synthesis of a critical-path
planning artifact inline unless delegated authorship has clear independent
value. Architect work must declare advisory or authoring mode, exact inputs,
an output template, `maxResearchRounds` (default 8), a stopping condition, and
an exclusive artifact when authoring.

For a product change linked to a requirement brief, tasks.md must include an
`[agent-requirements-curator]` documentation-reconciliation task before final
verification. It reviews `docs/documentation-inventory.md`, updates only
project documentation affected by the implemented scope, or records
`no-change`/`not-applicable` with a rationale, and returns the bounded handoff
before `pnpm verify`.

Do not apply until the required proposal, specs, design, tasks, and requirement brief when applicable have been reread and shown to be coherent, reachable, and free of blocking questions.

Before the first implementation edit for an OpenSpec change, present an Implementation Approval Packet that includes the change ID, linked requirement status, readiness summary, intended scope, design summary, task execution plan, delegation plan, editable roots, expected file families, risks, open questions, and verification plan. Stop after presenting it. Continue only after explicit operator approval for that packet, or update the planning artifacts when the operator requests adjustments. Record the approval as `approvalCheckpoint` in apply-progress.md before or with the first implementation edit.

Portable role and handoff semantics live under `.agent`. Runtime-specific
registration, spawning, activity, waiting, steering, interruption, and
completion mappings live under `.agent/runtime-adapters/` and native runtime
configuration. Do not invoke `codex exec` as a substitute for native Codex
subagents in an interactive Codex session.

Archive is fail-closed: finalize tasks/progress, run `pnpm verify`, create PASS evidence with a fresh SHA-256 snapshot, run strict readiness, invoke `openspec archive <id> --yes --json`, update the linked requirement/index, and validate accepted specs. Confirmation and pre-existing failures never bypass readiness.
