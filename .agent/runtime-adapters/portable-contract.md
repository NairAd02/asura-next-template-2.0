# Portable Subagent Contract

This file defines runtime-neutral orchestration semantics. Role responsibility,
task completion, and OpenSpec state remain portable even when native agent
mechanisms differ.

## Bootstrap

- The root orchestrator reads the SDD skill, skill registry, and orchestrator
  role before classification.
- Every executor assignment begins with `HARNESS_EXECUTOR_V1`.
- An executor reads `.agent/contracts/phase-handoff.md`, its exact role profile,
  and only the exact skills in the handoff.
- Executors do not repeat root classification, requirement curation, change
  creation, orchestrator bootstrap, or the Implementation Approval Packet.

## Independent Dimensions

`role` identifies responsibility. `executionMode` identifies how the role runs.
`skillResolution` identifies how skill paths were supplied. These fields are
never aliases for one another.

Execution modes:

- `inline`: deliberate root-thread execution under the named role boundary.
- `subagent`: a separate native agent thread or equivalent execution unit.
- `runtime-fallback`: takeover after a planned subagent becomes unusable.

Skill resolution:

- `paths-injected`: the handoff supplies exact skill paths.
- `none`: the bounded task needs no skill.

## Lifecycle

Portable milestones are:

```text
started
  -> context-loaded
  -> recommendation-ready
  -> artifact-written
  -> completed

any stage -> blocked
```

Not every task uses every milestone. Advisory work may omit
`artifact-written`; implementation may omit `recommendation-ready`. Record only
observable milestones. Do not invent a heartbeat or provider event.

## Budgets and Recovery

Default minimum observation budgets:

- planning and curation: 10 minutes;
- implementation: 20 minutes;
- verification: 15 minutes.

A handoff may override its budget. The budget is the minimum window before a
silence-based recovery decision. It is not a command timeout and is independent
of how frequently the orchestrator polls.

An empty poll, a missing final response, or an artifact that has not appeared
does not prove a running agent is hung. Early interruption is permitted for an
explicit `blocked` result, terminal runtime error, allowed-root violation, or
operator cancellation.

After budget exhaustion, perform at most one bounded recovery attempt. Before
replacement or inline takeover, interrupt the previous writer and confirm its
terminal state. Persist the trigger, recovery attempt, terminal confirmation,
and fallback reason.

## One Writer

Only one active execution owns an authoritative artifact. Allowed roots may
overlap for sequenced coordination files such as tasks/progress, but
`exclusiveArtifacts` must not overlap among concurrently executable roles.

## Architecture

Architecture delegation is advisory by default. A bounded advisor receives
exact input paths, `maxResearchRounds` (default 8), a recommendation template,
and a stopping condition, then returns seams, alternatives, recommendation,
affected files, risks, and verification implications. The root synthesizes the
authoritative design.

Delegated authorship is reserved for work with independent value. It also
requires exclusive ownership of the design artifact and an exact authoring
template. Insufficient evidence at the research bound produces `blocked`.

## Evidence Boundary

`apply-progress.md` and handoff history prove that the required structured
fields are present and internally coherent. Mechanical validation does not
prove real provider activity, elapsed time, tool calls, or the truth of a human
chat event.
