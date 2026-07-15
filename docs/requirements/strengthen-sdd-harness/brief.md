# Requirement Brief: Strengthen the SDD Harness

> **ID:** REQ-002
> **Status:** implemented
> **Priority:** high
> **Source:** User-approved harness-improvement plan (2026-07-15)
> **OpenSpec change:** archive/2026-07-15-strengthen-sdd-harness

## Intent

Make the template's existing hybrid workflow operational and auditable in Codex and compatible runtimes without replacing its OpenSpec, .agent, technical skill, reference-module, or light human-approval strategies.

## Actors

- Human operator
- Orchestrator
- Requirements curator
- Architect
- Data and UI implementers
- Verifier

## Scope

- Root bootstrap guidance for Codex.
- Deterministic task classification and active-change recovery.
- OpenSpec-native state checks before apply, verification, and archive.
- Exact-skill resolution, bounded delegation, and inline-role fallback.
- A shared handoff contract.
- Cumulative apply progress and structured verification evidence.
- Archive readiness rules and requirement-status reconciliation.
- Stronger OpenSpec artifact expectations for proposal, design, and tasks.
- A pilot of the resulting flow and one small technical-task classification simulation.

## Out of Scope

- Installers, Engram, personas, model routing, receipts, 4R review, PR slicing, or review tiers.
- Vitest, E2E, and coverage tooling.
- A second executable-spec or change-state system.
- Changes to gentle-ai-main.

## Candidate Flows

### Flow 1 - Product or behavior work

1. The operator presents intent.
2. The entry point classifies it as requirement curation, a new OpenSpec change, or continuation of an active change.
3. The orchestrator loads only the needed skills and follows OpenSpec state.
4. Implementers record progress, verifier records evidence, and archive updates the linked requirement.

### Flow 2 - Internal technical task

1. The operator presents a refactor or documentation task without a behavioral contract change.
2. The entry point selects .agent with optional OpenSpec traceability.
3. The task is performed and verified without forcing a requirement brief.

## Rules and Constraints

- OpenSpec remains the only executable-spec and change-state authority.
- The existing docs -> OpenSpec -> .agent -> implementation -> verification -> archive architecture remains intact.
- Every implemented OpenSpec change requires apply-progress.md and a PASS verify-report.md before archive.
- tasks.md is the completion authority; progress must be reconciled to it.
- Skills are passed by exact paths and implementers cannot redelegate.
- When subagents are unavailable, the specialized role runs inline with the same file boundaries.
- Node.js 20.19.0 or newer and a compatible global OpenSpec CLI are required.

## Dependencies

- REQ-001 / archived integrate-openspec-agent-workflow baseline.
- Archived restore-template-quality-baseline technical change.
- Existing .agent skills and roles.

## Open Questions

- None. The current OpenSpec CLI lacks an instructions verify artifact; status is therefore the authoritative preflight for verify and archive, while instructions apply remains authoritative for implementation.

## Suggested OpenSpec Change

- **Change ID:** strengthen-sdd-harness
- **Affected domain/spec:** workflow
- **Notes for proposal/spec/design/tasks:** Preserve current architecture, add durable operating contracts and archive gates, and use this change as the pilot.
