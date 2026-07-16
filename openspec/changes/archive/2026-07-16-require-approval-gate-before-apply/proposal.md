## Why

The harness already expects a lightweight human review before implementation, but the operational rules do not make the pause explicit or auditable. This change makes the transition from planning to implementation require a displayed approval packet, an explicit operator approval, and durable progress evidence before code edits begin.

No requirement brief applies; this is requirementless technical governance work driven by the operator request on 2026-07-16.

## What Changes

- Require an Implementation Approval Gate before applying an OpenSpec change that will edit implementation or harness behavior.
- Require the agent to present an approval packet summarizing scope, design, tasks, delegation, editable roots, risks, open questions, and verification plan.
- Require the agent to stop and wait for explicit operator approval or requested adjustments before the first implementation edit.
- Persist an `approvalCheckpoint` in `apply-progress.md` before or with the first implementation edit.
- Extend harness validation so started OpenSpec changes fail when approval checkpoint evidence is missing or malformed.
- Update local OpenSpec skills and human/developer guidance so the rule is applied consistently.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workflow`: Add an explicit approval gate between readiness review and implementation, plus mechanical approval checkpoint validation for started changes.

## Impact

- Affected governance: `AGENTS.md`, `.agent/skills/spec-driven-development/SKILL.md`, `.agent/agents/orchestrator.md`, `.agent/skills/implementation-progress/SKILL.md`, `.codex/skills/openspec-propose/SKILL.md`, `.codex/skills/openspec-apply-change/SKILL.md`, and operator/developer docs.
- Affected validation: `scripts/harness-validation.mjs` and `scripts/harness-validation.test.mjs`.
- Affected specs: `openspec/specs/workflow/spec.md` through a delta spec in this change.
- No production UI, data, dependency, or runtime API changes.
- Success criteria: `pnpm validate:harness` rejects started changes without an approval checkpoint, existing coherent fixtures pass after adding checkpoint evidence, and final `pnpm verify` passes.
- Rollback strategy: revert this change's docs, skills, workflow delta, validator logic, and tests to restore the prior lightweight approval guidance.

