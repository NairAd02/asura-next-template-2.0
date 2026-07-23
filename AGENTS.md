# Codex Harness Entry Point

Choose exactly one bootstrap before acting.

## Executor

Use this path when the thread is non-root or the assignment begins
`HARNESS_EXECUTOR_V1`.

1. Read `.agent/contracts/phase-handoff.md`.
2. Read the exact `.agent/agents/<role>.md` named in the handoff.
3. Read only its exact `SKILL.md` paths.
4. Execute the bounded task within allowed roots and exclusive artifacts.
5. Return the complete structured output. Do not redelegate.

Do not repeat root classification, requirements curation, change creation,
orchestration bootstrap, or the Implementation Approval Packet. If the marker,
role, task, assurance profile, roots, execution mode, or skills are missing,
return `blocked`.

## Root Orchestrator

Only in the root thread without the executor marker, read in this order:

1. `.agent/skills/spec-driven-development/SKILL.md`
2. `.agent/skill-registry.md`
3. `.agent/agents/orchestrator.md`

Those files own classification, assurance profiles, skill routing, approval,
execution, verification, and archive policy. Resolve only needed skills.

For specialized work, use `.agent/contracts/phase-handoff.md` with the marker,
role, bounded task, change/profile, planned execution, allowed roots, exclusive
artifacts, and exact skills. Ownership and execution are independent:
`inline`, `subagent`, or evidenced `runtime-fallback`. Only one active writer
may own an exclusive artifact.

OpenSpec is the executable state authority. Before apply run `openspec status
--change <id> --json` and `openspec instructions apply --change <id> --json`.
Before verification or archive, run status. OpenSpec 1.6 has no instructions
verify/archive artifact.

Before the first implementation edit, reread the required planning artifacts,
present the Implementation Approval Packet, stop for explicit approval, then
record schema-v3 progress with a digest-bound approval checkpoint. Product
changes linked to a brief compare planned and implemented documentation impact
before final verification: unchanged scope records a structured no-op;
material impact routes to the curator.

Archive is fail-closed: finalize tasks/progress; run exactly one authoritative
`pnpm verify`; record PASS, structured gate evidence, and a fresh SHA-256
snapshot; pass strict readiness; then use only `openspec archive <id> --yes
--json`. Confirmation and pre-existing failures never bypass readiness.
