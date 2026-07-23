# Phase Handoff Contract

Every non-root assignment starts `HARNESS_EXECUTOR_V1`. Use this contract for
subagents and deliberately inline role boundaries.

## Input

Required:

- role; bounded task; change ID or `no-change`; assurance profile;
- native state/task context and requirement path when applicable;
- allowed editable roots and exclusive artifacts;
- exact `SKILL.md` paths plus `skillResolution`;
- constraints/non-goals and planned mode (`inline` or `subagent`);
- owner-tagged task IDs.

For planned subagents also provide budget class/minutes and expected observable
milestones. Architecture additionally declares advisory/authoring mode, exact
inputs, output template, `maxResearchRounds` (8 default), stopping condition,
and an exclusive artifact for authorship.

Missing required bounds means `blocked`; executors do not reconstruct root
workflow.

## Output / execution record

Return exactly one fenced JSON object suitable for direct insertion into
`executionRecords`, containing:

- `role`, `taskIds`, `status` (`success`, `partial`, `blocked`), and summary;
- actual `executionMode` (`inline`, `subagent`, `runtime-fallback`);
- roots used, exact skills, `skillResolution`, files changed, and exclusive
  artifacts;
- verification records `{command, exitCode, summary}`;
- risks/deviations and recommended next phase.

Inline output omits milestones, budget, `plannedMode`, fallback, and recovery.
Subagent output adds observable milestones and
`budget: {class, minutes, outcome}`. Runtime fallback also records
`plannedMode: subagent`, concrete `fallbackReason`, and `recoveryEvidence`
including the bounded retry and confirmed terminal prior writer.

The orchestrator merges output into schema-v3 `executionRecords`; prose chat or
handoff history is optional context, not the durable contract.

## Invariants

- Executors do not redelegate, reclassify, curate requirements, create changes,
  load root bootstrap, or present approval packets.
- Stay inside allowed roots; update tasks/progress only when assigned.
- One active writer owns an exclusive artifact.
- Completed owner-tagged tasks require a matching successful execution record.
- An empty poll, elapsed polling interval, or absent artifact alone is not a
  blocker.
- Runtime fallback requires a planned subagent, at most one recovery attempt,
  and confirmation that the old writer stopped.
- A blocked result names the exact missing decision, artifact, path, or
  external condition.
