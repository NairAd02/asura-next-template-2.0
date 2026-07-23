## Context

The current harness has strong final handoff and archive evidence, but its
delegation mechanics conflate four different concerns:

1. the role that owns a task;
2. the runtime mechanism that executes it;
3. how exact skills are resolved;
4. whether a failed subagent requires fallback.

`AGENTS.md` also gives every agent the same root bootstrap. In a native Codex
subagent thread that causes a specialist to reread the SDD entry, registry, and
orchestrator role before loading its own assignment. The delegation plan then
uses `resolution` for both skill injection and inline fallback, so planned
inline work cannot be represented honestly.

The observed MISTRAL run provides the design constraint: a polling timeout is
not a completion timeout. The successful curator, UI executor, and verifier
took approximately 4, 13, and 7 minutes, while architect threads were
interrupted after approximately 3.5 minutes despite active tool work.

This change updates technical governance, the validator, and runtime adapters.
It does not modify application behavior and has no requirement brief.

Applicable skills are:

- `.agent/skills/spec-driven-development/SKILL.md`
- `.agent/skills/implementation-progress/SKILL.md`
- `.agent/skills/verification-harness/SKILL.md` for final evidence

Module, UI, data, forms, filters, and i18n skills do not apply.

## Goals / Non-Goals

**Goals:**

- Give root and executor threads distinct, mechanically recognizable entry
  paths.
- Represent role ownership, execution mode, skill resolution, budgets,
  milestones, and exclusive artifacts as separate fields.
- Make inline execution a valid proportional choice.
- Prefer delegated investigation over delegated critical-path authorship.
- Prevent retry storms and duplicate writers.
- Register the portable roles as native project agents in Codex.
- Keep non-Codex runtimes supported through an explicit adapter boundary.
- Validate the new contract with positive and negative fixtures.

**Non-Goals:**

- Implement a vendor-neutral process launcher.
- Poll or control Claude Code through Codex.
- Guarantee real-time model heartbeats while a provider is generating.
- Add a second executable state engine beside OpenSpec.
- Prove runtime activity cryptographically.
- Change application code, dependencies, product requirements, or final
  archive gates.

## Decisions

### 1. Use an explicit root/executor bootstrap split

`AGENTS.md` will begin with a routing condition:

- the root thread reads SDD, registry, and orchestrator in the current order;
- a non-root thread, or an assignment beginning with
  `HARNESS_EXECUTOR_V1`, reads the common handoff, its named role file, and
  only the exact skills in the assignment.

Every specialized handoff will carry the executor marker. Executors will be
explicitly prohibited from repeating task classification, requirement
curation, change creation, the orchestrator profile, or the Implementation
Approval Packet.

Alternative considered: rely only on runtime-provided `/root/<task>` identity.
Rejected because the portable harness must also work in runtimes that do not
use Codex canonical agent paths.

### 2. Separate execution mode from skill resolution

`delegationPlan` advances to schema version 2. Each role entry has this shape:

```json
{
  "role": "agent-architect",
  "taskIds": ["2.1"],
  "allowedRoots": ["openspec/changes/example/design.md"],
  "skills": [".agent/skills/spec-driven-development/SKILL.md"],
  "skillResolution": "paths-injected",
  "executionMode": "inline",
  "plannedMode": "inline",
  "budgetClass": "planning",
  "budgetMinutes": 10,
  "expectedMilestones": [
    "started",
    "context-loaded",
    "recommendation-ready",
    "completed"
  ],
  "exclusiveArtifacts": ["openspec/changes/example/design.md"],
  "fallbackReason": "",
  "recoveryEvidence": ""
}
```

Valid execution modes are:

- `inline`: deliberately performed by the orchestrator under the role boundary;
- `subagent`: performed in another agent thread or equivalent native unit;
- `runtime-fallback`: takeover after a planned subagent cannot complete.

`plannedMode` normally equals `executionMode`. For `runtime-fallback`,
`plannedMode` must be `subagent`, and fallback/recovery evidence is mandatory.

Valid skill resolution values remain `paths-injected` and `none`. The old
`inline-fallback` skill-resolution value is removed because it describes
execution rather than skill loading.

Alternative considered: retain schema version 1 and reinterpret `resolution`.
Rejected because it would preserve ambiguity and make old evidence appear to
have new semantics.

### 3. Select execution mode with a decision matrix

The orchestrator will use the following default:

| Work shape | Default mode |
|---|---|
| One small critical-path planning artifact using context already loaded | `inline` |
| Independent read-heavy research, triage, comparison, or review | `subagent` |
| Bounded implementation with one exclusive writer and useful parallelism | `subagent` |
| Final independent verification | `subagent` when available |
| Runtime lacks required capability | planned `inline` when known up front |
| Planned subagent fails after bounded recovery | `runtime-fallback` |

Role ownership is still required and owner tags remain authoritative. The
matrix changes only the execution mechanism.

Alternative considered: always delegate whenever a specialist exists.
Rejected because it makes coordination a mandatory cost and caused the
observed architecture retry loop.

### 4. Make architecture consultative by default

For existing modules and bounded workflow changes, an architect subagent
returns a recommendation containing:

- relevant seams;
- alternatives and recommendation;
- affected files;
- risks and verification implications.

The orchestrator authors `design.md` from that recommendation. Delegated
authorship remains available for a new module, cross-cutting architecture, or
another case where independent authorship adds value.

Any architect handoff must declare:

- exact input files;
- whether it is advisory or authoring;
- `maxResearchRounds`, default 8;
- an exact output template;
- a stopping condition;
- an exclusive artifact when authoring.

The architect reports `blocked` instead of silently exceeding the research
bound.

Alternative considered: require an early partial `design.md` as a heartbeat.
Rejected because interrupted partial authoritative artifacts create ambiguity.

### 5. Use semantic milestones and minimum observation budgets

The portable milestones are:

```text
started
  -> context-loaded
  -> recommendation-ready
  -> artifact-written
  -> completed

any stage -> blocked
```

Not every task uses every milestone. Advisory work omits `artifact-written`;
inline work may record milestones only in its final handoff.

Default observation budgets are:

- planning/curation: 10 minutes;
- implementation: 20 minutes;
- verification: 15 minutes.

These are minimum windows before a silence-based recovery decision, not command
timeouts and not polling intervals. Explicit `blocked`, terminal runtime error,
scope violation, or operator cancellation can end work earlier.

After budget exhaustion, the orchestrator may make one bounded recovery
attempt. It must stop and confirm the old writer before replacement or inline
takeover. Repeated 30/60-second waits never constitute failure evidence by
themselves.

Alternative considered: periodic 30-second heartbeat requirements. Rejected
because model generation and long tool calls do not guarantee a message
boundary at that cadence.

### 6. Keep the lifecycle portable and the transport adapter-owned

New documentation under `.agent/runtime-adapters/` will define:

- `portable-contract.md`: execution modes, milestones, budget and recovery
  semantics;
- `codex.md`: custom-agent registration and mapping to native spawn, status,
  steering, waiting, interruption, and completion behavior;
- `generic.md`: minimum mapping rules for another runtime, including planned
  inline behavior when no equivalent primitive exists.

The portable files SHALL NOT contain vendor command lines as normative
requirements. Runtime adapters may describe them.

Alternative considered: invoke `codex exec` or another vendor CLI from the
portable harness. Rejected because it replaces native orchestration with a
process supervisor and forces provider-specific permission, logging, and
session management into the core.

### 7. Register native Codex project agents as thin adapters

The project will add:

- `.codex/config.toml`
- `.codex/agents/agent-architect.toml`
- `.codex/agents/agent-data.toml`
- `.codex/agents/agent-ui.toml`
- `.codex/agents/agent-verifier.toml`
- `.codex/agents/agent-requirements-curator.toml`

Each file contains the native `name`, `description`, and
`developer_instructions` fields. Instructions identify the matching portable
role file and executor bootstrap. They do not duplicate the role contract.

Reasoning defaults will be proportional:

- curator and architect: `medium`;
- data, UI, and verifier: `high`.

Models inherit from the parent so the repository does not pin a potentially
stale model identifier. All writer roles use `workspace-write`; allowed roots
remain enforced by the handoff contract because native sandbox configuration
does not express per-subtree write ownership.

Project config enables agents and caps spawned threads at four. Increasing
concurrency is deliberately not used as a latency fix.

Alternative considered: replace `.agent/agents/*.md` with TOML. Rejected
because those Markdown contracts are the portable layer used by other
runtimes.

### 8. Extend validation without claiming runtime proof

`scripts/harness-validation.mjs` will:

- validate delegation-plan schema version 2;
- validate execution mode and skill resolution separately;
- require budget, milestones, and exclusive artifacts;
- require fallback/recovery evidence only for `runtime-fallback`;
- reject duplicated exclusive artifacts among roles that may run concurrently;
- require completed-role handoffs to include execution mode and lifecycle;
- validate the root/executor split in guidance;
- validate `.codex/config.toml` and the five custom-agent files contain the
  required portable-role references.

The validator will not attempt to prove actual elapsed time, agent activity, or
human messages. Negative fixtures will cover each mechanically observable
invariant.

Alternative considered: add a new runtime state database. Rejected because
OpenSpec and `apply-progress.md` already own the durable state needed for
archive.

## Responsibility Boundaries

- `orchestrator`: OpenSpec artifacts, `AGENTS.md`, `.agent` governance,
  runtime-adapter docs, `.codex` agent configuration, harness guides, and
  validator implementation.
- `agent-verifier`: final read-only conformance review, `pnpm verify`, report,
  evidence snapshot, and archive readiness. It does not repair implementation.

No product-role data or UI executor is required.

## Risks / Trade-offs

- [Runtime identity is not standardized] -> Every handoff carries
  `HARNESS_EXECUTOR_V1`; runtime identity is only an additional signal.
- [Budgets can still be too short for unusually large work] -> They are
  overridable per role and act only as minimum observation windows.
- [Native Codex agent schema may evolve] -> Keep adapter files thin, validate
  their required fields, and retain the portable contracts as authority.
- [Medium architect reasoning may miss hard edge cases] -> The handoff may
  override effort for genuinely demanding architecture; models remain
  parent-selected.
- [Overlapping allowed roots are common for tasks/progress] -> Duplicate-writer
  validation applies to `exclusiveArtifacts`, not coordination files.
- [New schema invalidates old active progress] -> There are no active changes
  at proposal time; archived evidence remains immutable and is not migrated.
- [Milestones may be unavailable in some runtimes] -> The adapter records only
  observable milestones and falls back to final handoff evidence without
  inventing events.

## Migration Plan

1. Update the accepted-contract delta and governance vocabulary.
2. Add the root/executor bootstrap split and executor marker.
3. Update role, handoff, SDD, registry, progress, and orchestrator guidance.
4. Add portable runtime-adapter documentation and native Codex agent files.
5. Upgrade validator and fixtures to delegation-plan schema version 2.
6. Update operator/developer guides and examples.
7. Create this change's `apply-progress.md` directly with schema version 2.
8. Run focused validator tests, `pnpm validate:harness`, and final
   `pnpm verify`.

Rollback requires reverting governance, adapter, validator, tests, and guides
together. No application migration or dependency rollback is needed.

## Verification Approach

- OpenSpec strict validation of the delta.
- Node test fixtures for positive inline/subagent/fallback plans and negative
  missing-budget, missing-milestone, duplicate-writer, malformed-fallback, and
  bootstrap/adapter cases.
- `pnpm validate:harness` against the real repository and active change.
- `pnpm verify` for full specs, harness tests, unit tests, typechecks, lint, and
  production build.
- Fresh SHA-256 evidence and strict archive readiness at close.

## Open Questions

None blocking.
