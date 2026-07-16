## Why

Recent harness trials showed that Codex can implement large multi-phase changes
without using available subagents because the current rules require handoff
format only after a specialized role is chosen. The workflow needs an explicit,
auditable delegation gate so large data/UI/verification work is split or the
inline fallback is justified.

No separate requirement brief applies; this change is direct internal harness
work requested from the vehicle-management retrospective.

## What Changes

- Require the orchestrator profile to be part of mandatory harness bootstrap.
- Add a delegation gate before implementation that identifies required roles,
  bounded ownership, resolution method, and any inline fallback reason.
- Require owner-tagged implementation and verification tasks when tasks map to
  specialized registry roles.
- Persist delegation decisions in `apply-progress.md` so inline fallback is
  durable evidence rather than chat-only explanation.
- Extend mechanical harness validation to reject started active changes whose
  owner-tagged tasks lack matching handoff coverage or a delegation plan.
- Keep `no-change` work and genuinely single-role/simple tasks lightweight.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow`: Defines mandatory delegation planning, owner-tagged task
  coverage, inline-fallback evidence, and validation of handoff coverage for
  active implemented changes.

## Impact

- **Root instructions:** `AGENTS.md`.
- **Agent governance:** `.agent/skills/spec-driven-development/SKILL.md`,
  `.agent/skill-registry.md`, `.agent/contracts/phase-handoff.md`,
  `.agent/agents/orchestrator.md`, `.agent/skills/implementation-progress/SKILL.md`,
  and `.agent/README.md`.
- **Guides:** `docs/developer-harness-guide.md` and
  `docs/human-operator-guide.md`.
- **OpenSpec:** active delta spec under `openspec/changes/enforce-delegation-gate`
  and accepted `workflow` behavior after archive.
- **Harness validation:** `scripts/harness-validation.mjs` and
  `scripts/harness-validation.test.mjs`.
- **Dependencies/systems:** no new package dependency, runtime service, app
  route, or external integration is introduced.

## Success Criteria

- Multi-role implemented changes must have a recorded delegation plan before
  work continues.
- Owner-tagged tasks must be covered by matching handoff history or explicit
  inline-fallback handoff evidence.
- A started active change with owner-tagged tasks but missing delegation
  evidence fails `pnpm validate:harness` with actionable errors.
- Single-role or `no-change` internal work remains possible without inventing
  unnecessary OpenSpec artifacts.
- `pnpm verify` passes after the harness and spec updates.

## Rollback

Revert the governance text, validator/test changes, and active OpenSpec change
as a unit. No runtime data, dependency, or application migration is involved.

## Open Questions

None blocking. The delegation gate should enforce observable planning and
handoff coverage, not attempt to prove that a runtime truly had or lacked
subagent support.
