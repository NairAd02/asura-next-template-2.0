## Why

The hybrid workflow is documented but not operationally enforced at the repository entry point. A change can lose context, delegate without a durable contract, or reach archive without progress and evidence that a later operator can inspect. REQ-002 turns the existing strategy into a lightweight, auditable harness while preserving OpenSpec as the only executable change-state authority.

## Intent

Activate the current docs -> OpenSpec -> .agent -> implementation -> verification -> archive architecture in Codex and compatible runtimes, using the project skills and specialized roles already present.

## What Changes

- Add a small root AGENTS.md bootstrap that loads the SDD skill and skill registry before classifying work.
- Define task classification for broad intent, ready behavior changes, active changes, internal non-contractual work, and closure.
- Require OpenSpec status as the native authority before apply, verification, and archive; use instructions apply for implementation because the installed OpenSpec schema has no verify or archive instruction artifact.
- Add exact-path skill resolution, non-redelegating executors, and inline specialized-role fallback when subagents are unavailable.
- Add a common handoff contract and an implementation-readiness review.
- Require cumulative apply-progress.md and structured verify-report.md for implemented changes.
- Define archive readiness checks and requirement-status reconciliation.
- Strengthen OpenSpec configuration and the live workflow specification with success criteria, rollback, design decisions, task traceability, progress, and evidence expectations.
- Update operator, agent, registry, and harness documentation, and use this change as the pilot.

## Scope

The change covers root instructions, .agent contracts, skills, roles, registry, OpenSpec configuration and workflow spec, requirement documentation, operator guidance, and the active change artifacts.

## Non-goals

- Replacing OpenSpec, adding a second state engine, or moving executable specs outside OpenSpec.
- Adding installer infrastructure, Engram, personas, model routing, receipts, 4R review, PR slicing, or review tiers.
- Adding Vitest, E2E, or coverage tooling.
- Modifying gentle-ai-main.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- workflow: Adds explicit entry classification, state recovery, bounded handoffs, persistent progress/evidence, and archive-readiness behavior to the existing hybrid workflow.

## Dependencies

- docs/requirements/strengthen-sdd-harness/brief.md (REQ-002).
- Existing .agent skills, agents, and reference modules.
- OpenSpec CLI with status, instructions apply, validation, doctor, and archive support.
- Node.js 20.19.0 or newer and pnpm 10.30.2.

## Success Criteria

- The root entry point, role definitions, registry, and operator guide describe one coherent workflow.
- An active change can be resumed from status, tasks, and apply-progress without an alternate state file.
- Missing planning artifacts block implementation readiness.
- Pending tasks, missing progress, non-PASS evidence, or incoherent requirement updates block archive readiness.
- The harness can classify a small internal technical task without requiring a requirement brief.
- OpenSpec doctor and pnpm verify exit with code 0.

## Rollback

Revert this change as a unit. It changes repository instructions and artifacts only; no runtime data migration, dependency, or deployment rollback is required.

## Open Questions

- The installed OpenSpec schema exposes instructions apply but not instructions verify or archive. The harness will use status as the authoritative native preflight for those two phases rather than emulate unsupported phases.
- Whether a future OpenSpec release adds verify or archive instructions can be evaluated during routine tool-version preflight.

## Impact

Affected files are AGENTS.md, .agent, docs, docs/requirements, openspec/config.yaml, openspec/specs/workflow/spec.md through its delta, and this active change. Product runtime source and dependencies are unaffected.
