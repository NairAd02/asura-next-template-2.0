# Phase Handoff Contract

Use this contract whenever work passes between the orchestrator and a
specialized role, including a deliberately inline role boundary.

Every non-root assignment starts with:

```text
HARNESS_EXECUTOR_V1
```

## Input

- Role: exact role name.
- Task: one bounded outcome.
- Change ID: OpenSpec change ID, or no-change for internal technical work.
- State context: current openspec status output, task state, and relevant progress facts.
- Allowed editable roots: explicit paths or path patterns.
- Skills: only exact SKILL.md paths required for this task.
- Requirement context: linked brief path when applicable.
- Constraints: non-goals, decisions, and blockers already known.
- Execution mode: `inline`, `subagent`, or `runtime-fallback`.
- Planned mode: `inline` or `subagent`.
- Budget: class, minutes, and any task-specific override rationale.
- Expected milestones: applicable values from `started`, `context-loaded`,
  `recommendation-ready`, `artifact-written`, `completed`, and `blocked`.
- Exclusive artifacts: authoritative artifacts owned by this execution.
- Delegation plan entry: task IDs, owner tag, skill resolution, execution mode,
  budget, milestones, exclusive artifacts, and fallback/recovery evidence when
  `runtime-fallback` is used.
- Architecture bounds when applicable: advisory or authoring mode, exact input
  paths, output template, `maxResearchRounds` (default 8), stopping condition,
  and exclusive design artifact for authoring.

## Output

- Status: success, partial, or blocked.
- Summary: concise result against the task.
- Artifacts: created or updated paths.
- Files changed: all modified paths.
- Completed tasks: task IDs checked in tasks.md, if any.
- Verification: exact commands/checks and results, or explicitly not run.
- Risks: unresolved risks, deviations, or none.
- Next phase: recommended owner and action.
- Allowed editable roots: the roots actually used.
- Skills: exact paths loaded.
- Skill resolution: `paths-injected` or `none`.
- Execution mode: `inline`, `subagent`, or `runtime-fallback`.
- Planned mode: original planned execution.
- Lifecycle milestones: observable milestones reached.
- Budget class and outcome: assigned budget plus completion/exhaustion result.
- Exclusive artifacts: artifacts owned during execution.
- Fallback reason: concrete trigger, required only for `runtime-fallback`.
- Recovery evidence: prior writer status and bounded recovery, required only
  for `runtime-fallback`.

For an implemented OpenSpec change, append this complete output to `apply-progress.md` under `## Handoff History`; chat output alone is not durable evidence.

## Rules

- An executor SHALL NOT redelegate work.
- An executor SHALL NOT repeat root classification, requirements curation,
  change creation, orchestrator bootstrap, or the Implementation Approval
  Packet.
- An executor SHALL remain inside its allowed roots plus the change tasks.md and apply-progress.md when task progress must be recorded.
- Owner-tagged completed tasks SHALL have matching handoff history with
  execution mode and lifecycle outcome.
- Planned `inline` execution requires no fallback reason.
- `runtime-fallback` SHALL record planned mode `subagent`, the triggering
  condition, recovery evidence, and confirmation that the previous writer
  stopped before takeover.
- An empty poll, elapsed polling interval, or absent final artifact SHALL NOT by
  itself be treated as a blocker.
- One active writer SHALL own each exclusive artifact.
- A blocked handoff SHALL state the exact missing decision, artifact, path, or external condition.
- The orchestrator SHALL reconcile the output with tasks.md and apply-progress.md before forwarding or closing work.
- Free-form commentary may add context but does not replace the required fields.
