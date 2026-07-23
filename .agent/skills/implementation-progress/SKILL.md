---
name: implementation-progress
description: Load for every implemented OpenSpec change to persist task progress, verification evidence, and archive readiness.
---

# Implementation Progress and Evidence

## When to Load

Load this skill for every OpenSpec change that writes implementation files or behavior artifacts. It is owned by the orchestrator, data/UI executors, and verifier according to their allowed roots.

## Source of Truth

- OpenSpec status is the only executable phase and change-state authority.
- tasks.md is the authority for task completion.
- apply-progress.md is cumulative context and evidence; it never replaces tasks.md.
- verify-report.md is the final verification evidence.

## apply-progress.md

Create openspec/changes/<change-id>/apply-progress.md before or with the first implementation edit. Keep prior entries and append meaningful updates.

Maintain one machine-readable current summary followed by durable narrative history:

~~~markdown
## Current Snapshot

```json
{
  "schemaVersion": 2,
  "status": "in-progress",
  "completedTaskIds": ["1.1"],
  "remainingTaskIds": ["1.2"],
  "filesChanged": ["modules/example/index.ts"],
  "approvalCheckpoint": {
    "schemaVersion": 1,
    "status": "approved",
    "approvedBy": "human-operator",
    "approvedAt": "2026-07-16",
    "approvalSource": "chat",
    "packetSummary": "Implementation Approval Packet reviewed and approved before edits.",
    "artifactsReviewed": ["proposal.md", "design.md", "tasks.md", "specs/example/spec.md"]
  },
  "delegationPlan": {
    "schemaVersion": 2,
    "requiredRoles": ["agent-data"],
    "roles": [
      {
        "role": "agent-data",
        "taskIds": ["1.1"],
        "allowedRoots": ["modules/example/lib/**"],
        "skills": [".agent/skills/data-layer/SKILL.md"],
        "skillResolution": "paths-injected",
        "executionMode": "subagent",
        "plannedMode": "subagent",
        "budgetClass": "implementation",
        "budgetMinutes": 20,
        "expectedMilestones": [
          "started",
          "context-loaded",
          "artifact-written",
          "completed"
        ],
        "exclusiveArtifacts": ["modules/example/lib/example.services.ts"],
        "fallbackReason": "",
        "recoveryEvidence": ""
      }
    ]
  },
  "skillsLoaded": [".agent/skills/data-layer/SKILL.md"]
}
```
~~~

- `status` is `in-progress`, `blocked`, `ready-for-verification`, or `ready-for-archive`.
- The Current Snapshot uses schema version 2. `approvalCheckpoint` and the
  terminal Evidence Snapshot remain independently versioned schema-1 records.
- Task IDs SHALL exactly match the numbered checkbox IDs in `tasks.md`.
- `filesChanged` SHALL contain sorted repository-relative source/artifact paths covered by verification; omit generated outputs and deleted paths.
- `approvalCheckpoint` SHALL exist once implementation starts. It uses schema version 1, status `approved`, identifies the human operator, records the approval source, includes a concise packet summary, and lists the reviewed planning artifacts. It is evidence that the Implementation Approval Packet was presented and approved; the validator checks record shape, not cryptographic proof of the chat event.
- `delegationPlan` SHALL exist when tasks.md contains owner-tagged tasks. It
  uses schema version 2 and gives each role task IDs, allowed roots, exact
  skills, `skillResolution` (`paths-injected` or `none`), `executionMode`
  (`inline`, `subagent`, or `runtime-fallback`), original `plannedMode`, budget
  class/minutes, expected milestones, exclusive artifacts, and
  fallback/recovery evidence.
- Planned `inline` work uses `plannedMode: inline`, empty fallback/recovery
  strings, and requires no failure story.
- `runtime-fallback` requires `plannedMode: subagent`, a concrete
  `fallbackReason`, and `recoveryEvidence` that includes the bounded recovery
  attempt and confirmation that the previous writer stopped.
- Default minimum observation budgets are 10 minutes for planning/curation, 20
  minutes for implementation, and 15 minutes for verification. A task may
  override them. They are not shell timeouts or polling intervals.
- Expected and observed milestones come from `started`, `context-loaded`,
  `recommendation-ready`, `artifact-written`, `completed`, and `blocked`.
- `exclusiveArtifacts` records one-writer ownership. Two concurrently
  executable entries SHALL NOT claim the same artifact.
- Preserve `## Decisions and Deviations`, `## Problems`, and a cumulative `## Handoff History` after the snapshot.
- Every handoff entry records the complete phase-handoff output, including
  allowed roots, exact skill paths, skill resolution, execution mode, planned
  mode, lifecycle milestones, budget outcome, exclusive artifacts, and
  fallback/recovery evidence when applicable.
- Completed owner-tagged tasks SHALL be covered by `## Handoff History`.
- The validator verifies structured evidence and internal coherence. It does
  not prove real provider activity, elapsed time, or chat events.

When progress and tasks.md disagree, stop and reconcile the discrepancy before continuing.

## verify-report.md

Create or replace openspec/changes/<change-id>/verify-report.md after final verification. It SHALL include:

- conformance against proposal, specs, design, and tasks
- exact command, exit code, duration, and concise summary for specs/harness validation, unit/component tests, non-incremental typecheck, full lint, and build
- relevant warnings
- PASS or FAIL verdict
- invalidation rule: any subsequent implementation or change-artifact modification requires the final command and fresh report evidence again
- an `## Evidence Snapshot` fenced JSON block generated after finalizing tasks and progress with `node scripts/validate-harness.mjs --snapshot <change-id>`

The snapshot uses schema version 1, SHA-256, a complete sorted path set, and a combined digest. It covers all active change files except `verify-report.md`, linked requirement/index files, and every source/artifact path declared in progress.

## Archive Readiness

Before archive, verify all of the following:

- No unchecked tasks remain in tasks.md.
- apply-progress.md exists and is reconciled with tasks.md.
- approvalCheckpoint exists and is valid for started implementation.
- verify-report.md exists with PASS.
- Linked requirement brief and requirements index can be updated coherently, or the change explicitly records that no requirement applies.
- Native OpenSpec status has been checked.
- `node scripts/validate-harness.mjs --archive-ready <change-id>` exits 0 and proves the PASS snapshot is fresh.

Terminal order is fixed: finalize implementation and verification task definitions; run `pnpm verify`; finalize verification task checkboxes and set progress `ready-for-archive`; generate the report and snapshot; run status plus strict readiness; invoke native archive; update requirement/index; validate accepted specs.

Report creation, native archive movement, and post-archive requirement/index updates are close operations, not task checkboxes.

Do not create a custom phase tracker. In current OpenSpec versions, use instructions apply only for apply; use status as the native preflight for verify and archive.

## Handoff

Use .agent/contracts/phase-handoff.md. Report the skill-resolution method and the exact paths modified.
