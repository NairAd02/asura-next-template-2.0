## Context

The current workflow already defines specialized roles, exact skill paths, and
phase handoffs, but the mandatory bootstrap only loads the SDD skill and skill
registry. The stronger orchestrator rule that product code should not be
implemented inline while specialized roles are available lives in
`.agent/agents/orchestrator.md`, which is not part of the mandatory start path.

The retrospective on `add-vehicle-management` showed the practical gap: the
design correctly identified data, UI, and verifier ownership, but several large
phases were completed as inline fallback. Inline fallback remains necessary when
a runtime lacks subagents, but it must become explicit evidence instead of a
silent convenience.

## Goals / Non-Goals

**Goals:**

- Make the orchestrator profile mandatory at harness bootstrap.
- Require a delegation plan before implementation starts for OpenSpec changes.
- Define objective triggers that require specialized role handoffs or explicit
  inline fallback evidence.
- Let tasks carry owner tags such as `[agent-data]`, `[agent-ui]`, and
  `[agent-verifier]`.
- Extend `apply-progress.md` with a durable delegation plan.
- Extend dependency-free harness validation to reject owner-tagged tasks that
  lack matching handoff coverage after implementation starts.

**Non-Goals:**

- Prove that a runtime truly did or did not expose subagent tools.
- Force subagents for `no-change` work, tiny single-role tasks, or read-only
  discussion.
- Add dependencies, a second state engine, or runtime integration with Codex
  tool availability.
- Rewrite historical archived changes.

## Decisions

### Promote orchestrator profile into mandatory bootstrap

`AGENTS.md` will require `.agent/agents/orchestrator.md` after the SDD skill and
registry. The SDD skill will mirror the rule so direct skill invocation still
sees the same requirement.

Alternative considered: copy all orchestrator guidance into `AGENTS.md`.
Rejected because duplicating the full role profile makes drift more likely. The
bootstrap should load the source of truth instead.

### Add a pre-implementation delegation gate

Before apply, the orchestrator will classify the remaining tasks against the
registry. A specialized role is required when the change:

- touches more than one registry phase or specialized owner;
- includes both data/lib and UI/app/message roots;
- creates or updates a module with route/list/form/filter/modal behavior;
- changes visible text plus implementation behavior;
- reaches final verification/archive readiness.

The gate produces a role plan with role, task scope, allowed roots, exact skill
paths, resolution method, and fallback reason when inline execution is used.

Alternative considered: a numeric file-count threshold. Rejected because early
planning knows intent and task ownership more reliably than final file counts.

### Use owner tags as the mechanical anchor

Task lines may include exactly one owner tag, e.g. `[agent-data]`. The validator
will parse checked and unchecked task lines for owner tags. Owner tags provide a
low-tech, reviewable link between `tasks.md`, `apply-progress.md`, and handoff
history.

Alternative considered: a separate YAML manifest. Rejected because the project
already treats `tasks.md` as the completion authority and `apply-progress.md` as
the durable progress record.

### Persist delegation plans in `apply-progress.md`

The current snapshot will gain `delegationPlan`, with required roles, per-role
resolution, allowed roots, task IDs, and fallback reasons. `Handoff History`
remains the detailed evidence. Inline fallback is allowed only when represented
as a role handoff with `Skill resolution: inline-fallback` plus a reason.

Alternative considered: rely on chat transcripts. Rejected because archive
readiness and resumed work use repository artifacts, not transient chat.

### Validate only observable delegation invariants

`validate:harness` will not try to detect actual Codex tool availability.
Instead, once an active change has started implementation, it will require:

- owner-tagged tasks to have a delegation plan;
- every owner-tagged role with completed tasks to have matching handoff history;
- inline fallback roles to record a non-empty fallback reason;
- handoff entries to use known skill-resolution values.

This keeps validation deterministic and dependency-free.

## Risks / Trade-offs

- [Overhead for small work] -> Keep owner-tag enforcement tied to implemented
  OpenSpec changes and specialized owner tags; `no-change` and single-role work
  stay lightweight.
- [Markdown parsing is brittle] -> Use stable headings and simple owner tags;
  return actionable errors when expected sections are missing.
- [Agents may omit tags] -> The readiness gate and spec text require tags when
  tasks map to specialized registry roles; reviewers can catch missing tags
  before implementation.
- [Runtime availability cannot be proven] -> Validate fallback evidence instead
  of pretending to inspect unavailable tool state.

## Migration Plan

1. Add the workflow delta and owner-tagged implementation tasks.
2. Update root and `.agent` governance so the delegation gate is mandatory.
3. Extend implementation progress guidance with `delegationPlan`.
4. Extend harness validation and negative tests for missing plan, missing
   handoff coverage, and missing inline fallback reason.
5. Run targeted harness tests, `openspec validate`, `pnpm verify:fast`, and
   final `pnpm verify`.

Rollback is a source revert of the governance text, validator/test changes, and
this OpenSpec change. No runtime data or dependency migration is involved.

## Open Questions

None.
