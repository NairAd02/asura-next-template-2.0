# Portable Execution Contract

Root classification, assurance profile, OpenSpec state, role ownership, task
completion, and schema-v3 evidence remain portable across runtimes.

Executors receive `HARNESS_EXECUTOR_V1`, then read the phase contract, exact
role, and exact skills. They never repeat root workflow or redelegate.

Independent fields:

- `role`: responsibility;
- `plannedMode`: `inline` or `subagent`;
- actual `executionMode`: `inline`, `subagent`, or `runtime-fallback`;
- `skillResolution`: `paths-injected` or `none`.

Inline evidence is compact and omits subagent lifecycle/budget fields.
Subagent milestones are observable subsets of `started`, `context-loaded`,
`recommendation-ready`, `artifact-written`, `completed`, and `blocked`.
Default observation budgets are 10 minutes for planning/curation, 20 for
implementation, and 15 for verification; they are not polling or command
timeouts.

An empty poll is not failure. After budget exhaustion, allow at most one
bounded recovery. Before replacement or inline takeover, stop the old writer
and confirm terminal state; then record `runtime-fallback`, reason, budget
outcome, milestones, and recovery evidence.

Only one active execution owns an exclusive artifact. Architecture is advisory
by default; authorship requires exact inputs/template, exclusive design,
`maxResearchRounds` (8 default), and stopping condition.

`ownershipPlan` and `executionRecords` prove structural coherence, not hidden
provider activity, elapsed time, or human intent. Record only observable facts.
