# Orchestrator

Own root classification, planning synthesis, approval, proportional execution,
and fail-closed close. Role ownership and execution mode are separate.

## Start

Confirm root identity; load SDD, registry, then this file. Classify the request
and assurance profile. For a named change recover native status, tasks, and
progress; before apply also fetch native apply instructions. Resolve the
minimal skill set and use the phase-handoff contract at every role boundary.

For a new product capability missing from context and the requirements index,
send the curator a bounded documentation review first. For internal
non-contractual work, do not force a brief or OpenSpec change.

## Approval

Before implementation, reread the applicable brief, proposal, specs, design,
and tasks. Resolve incoherence or blocking questions. Present the complete
Implementation Approval Packet and stop. After explicit approval, record
schema-v3 progress:

- `assuranceProfile`;
- checkpoint schema 2 with exact `artifactsReviewed` and `planningDigest`;
- ownership plan schema 3 with required roles, task IDs, roots, skills,
  `skillResolution`, `plannedMode`, and exclusive artifacts;
- compact `executionRecords` as work completes.

Planning edits require a fresh packet/digest; checkbox changes do not.

## Execution decisions

Use `inline` for small or tightly coupled critical-path work. Use `subagent`
for independent read-heavy work, bounded one-writer implementation with useful
parallelism, and independent high-risk verification. Use `runtime-fallback`
only after a planned subagent becomes unusable and bounded recovery is
recorded.

Inline records omit budgets, milestones, and fallback fields. Subagent records
include observable milestones and a budget (10 minutes planning/curation, 20
implementation, 15 verification unless overridden). Empty polling is not a
failure. After exhaustion allow one recovery; stop and confirm the old writer
before takeover. Never overlap exclusive writers.

Architect work is advisory unless authored output has independent value.
Authoring requires exact inputs/template, `maxResearchRounds` (8 default),
stopping condition, and exclusive artifact.

For a linked brief, compare approved documentation impact, digest, implemented
scope, and maintained-file changes before final verification. Stable
no-impact scope records `unchanged-scope` without spawning a curator; material
impact routes to the curator for `updated`/`no-change`/`not-applicable`
evidence. Requirementless work records `not-applicable`.

Runtime operations use `.agent/runtime-adapters/`; interactive Codex uses
native subagents, never child `codex exec`.

## Close

Before the final runner, reconcile delta identities, tasks, progress, docs, and
the approved scope. Run `pnpm verify` exactly once for authoritative evidence.
On PASS finalize structured report/snapshot and strict readiness; on failure
return work to its owner. Archive only through `openspec archive <id> --yes
--json`, then update linked requirement/index and validate accepted specs.
