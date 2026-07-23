# Generic Runtime Adapter

Another agent runtime can use this harness without copying Codex tool names.
Its adapter documents how native capabilities map to the portable contract.

## Required Mapping

Document the runtime's equivalents, or explicit absence, for:

- root versus executor identity;
- role registration/selection;
- bounded spawn;
- activity/status inspection;
- steering/follow-up;
- waiting without treating a poll as a deadline;
- interruption plus terminal confirmation;
- completion and final handoff capture;
- permission/sandbox inheritance;
- exclusive-writer enforcement.

Every executor still receives `HARNESS_EXECUTOR_V1`, the exact role profile,
skills, roots, execution mode, budget, milestones, and exclusive artifacts.

## Capability Choices

- If native subagents are available, use `subagent` for independent work and
  map observable events to portable milestones.
- If the runtime is known not to support subagents before planning, select
  `inline`; this is not a fallback failure.
- If a planned subagent becomes unusable, use `runtime-fallback` only after the
  task budget, at most one bounded recovery, and terminal confirmation of the
  previous writer.
- If the runtime cannot expose intermediate activity, record final handoff
  milestones only. Never fabricate heartbeat events.

The adapter may add vendor-specific commands or UI instructions. Those details
are informative for that runtime and do not redefine OpenSpec state, owner
tags, task completion, or the portable handoff.
