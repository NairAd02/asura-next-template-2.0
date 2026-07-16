# Phase Handoff Contract

Use this contract whenever work passes between the orchestrator and a specialized role, including an inline role fallback.

## Input

- Role: exact role name.
- Task: one bounded outcome.
- Change ID: OpenSpec change ID, or no-change for internal technical work.
- State context: current openspec status output, task state, and relevant progress facts.
- Allowed editable roots: explicit paths or path patterns.
- Skills: only exact SKILL.md paths required for this task.
- Requirement context: linked brief path when applicable.
- Constraints: non-goals, decisions, and blockers already known.
- Delegation plan entry: task IDs, owner tag, resolution method, and fallback reason when inline fallback is used.

## Output

- Status: success, partial, or blocked.
- Summary: concise result against the task.
- Artifacts: created or updated paths.
- Files changed: all modified paths.
- Completed tasks: task IDs checked in tasks.md, if any.
- Verification: exact commands/checks and results, or explicitly not run.
- Risks: unresolved risks, deviations, or none.
- Next phase: recommended owner and action.
- Skill resolution: paths-injected, inline-fallback, or none.
- Fallback reason: required when Skill resolution is inline-fallback.

For an implemented OpenSpec change, append this complete output to `apply-progress.md` under `## Handoff History`; chat output alone is not durable evidence.

## Rules

- An executor SHALL NOT redelegate work.
- An executor SHALL remain inside its allowed roots plus the change tasks.md and apply-progress.md when task progress must be recorded.
- Owner-tagged completed tasks SHALL have matching handoff history or explicit inline-fallback evidence.
- Inline fallback SHALL NOT be silent; it requires a concrete fallback reason in the delegation plan and handoff.
- A blocked handoff SHALL state the exact missing decision, artifact, path, or external condition.
- The orchestrator SHALL reconcile the output with tasks.md and apply-progress.md before forwarding or closing work.
- Free-form commentary may add context but does not replace the required fields.
