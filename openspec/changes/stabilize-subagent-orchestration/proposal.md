## Why

The harness currently treats specialized ownership as a near-mandatory
subagent boundary, gives every spawned executor the root orchestrator
bootstrap, and interprets missing final output after short polling windows as a
failed delegation. In a real Codex IDE run this caused two active architect
threads to be interrupted while they were still reading and synthesizing, even
though slower UI and verification agents later completed successfully.

This is requirementless technical-governance work: it changes the portable SDD
harness and runtime adapters, not product behavior, so no requirement brief
applies.

## What Changes

- Distinguish the root orchestrator bootstrap from the non-root executor
  bootstrap so specialized agents load only their role, handoff contract, and
  exact assigned skills.
- Separate role ownership from execution mode. A role may be planned as
  `inline`, `subagent`, or `runtime-fallback`; inline execution is no longer
  represented as a failure when it is the deliberate proportional choice.
- Prefer subagents for independent read-heavy investigation and let the
  orchestrator synthesize critical-path planning artifacts unless delegated
  authorship has clear value.
- Define portable lifecycle milestones (`started`, `context-loaded`,
  `recommendation-ready`, `artifact-written`, `completed`, `blocked`) and map
  them through runtime adapters instead of requiring time-based chat
  heartbeats.
- Add task-class budgets and evidence-based interruption/recovery rules.
  Polling without a final result is not itself evidence that an agent is hung.
- Bound architect work with exact inputs, a research-call budget, a design
  template, and an explicit stopping condition.
- Add project-scoped native Codex agent definitions under `.codex/agents/` that
  reuse the portable `.agent` role contracts and select role-appropriate
  reasoning defaults.
- Document the portable core/runtime-adapter boundary, including a Codex-native
  adapter and guidance for other agent runtimes without pretending their
  spawning, permission, or progress mechanisms are identical.
- Extend harness validation and negative fixtures for execution modes,
  lifecycle evidence, fallback reasons, duplicate writers, and root/executor
  bootstrap separation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow`: Change the accepted delegation, bootstrap, handoff, progress, and
  validation behavior for portable and Codex-native subagent orchestration.

## Impact

- Affected governance: `AGENTS.md`, `.agent/README.md`,
  `.agent/skill-registry.md`, `.agent/agents/`,
  `.agent/contracts/phase-handoff.md`, and applicable `.agent/skills/`.
- Affected Codex adapter: new project `.codex/config.toml` and
  `.codex/agents/*.toml` definitions.
- Affected validation: `scripts/harness-validation.mjs`,
  `scripts/harness-validation.test.mjs`, and active-change progress schemas.
- Affected operator/developer documentation: `harness-docs/`.
- No application runtime, API, UI, dependency, or product requirement changes.
- Dependency: current Codex clients that support project custom agents use the
  native adapter; runtimes without that feature continue through the portable
  inline/subagent/fallback contract.
- Success criteria:
  - executors do not repeat the orchestrator bootstrap;
  - planned inline work validates without a fabricated fallback reason;
  - a running agent is not interrupted solely because one or more polls return
    no final result;
  - only one writer owns an artifact at a time;
  - Codex can resolve named project agents from `.codex/agents/`;
  - positive and negative harness fixtures cover the new contract.
- Rollback: revert the adapter definitions and governance/validator changes
  together, restoring the prior `paths-injected`/`inline-fallback` schema.
- Open questions: none blocking. Runtime-specific milestone transport remains
  adapter-owned; the portable contract standardizes milestone meanings, not
  vendor tool names.
