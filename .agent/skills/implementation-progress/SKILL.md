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
  "schemaVersion": 1,
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
    "schemaVersion": 1,
    "requiredRoles": ["agent-data"],
    "roles": [
      {
        "role": "agent-data",
        "taskIds": ["1.1"],
        "allowedRoots": ["modules/example/lib/**"],
        "skills": [".agent/skills/data-layer/SKILL.md"],
        "resolution": "paths-injected",
        "fallbackReason": ""
      }
    ]
  },
  "skillsLoaded": [".agent/skills/data-layer/SKILL.md"]
}
```
~~~

- `status` is `in-progress`, `blocked`, `ready-for-verification`, or `ready-for-archive`.
- Task IDs SHALL exactly match the numbered checkbox IDs in `tasks.md`.
- `filesChanged` SHALL contain sorted repository-relative source/artifact paths covered by verification; omit generated outputs and deleted paths.
- `approvalCheckpoint` SHALL exist once implementation starts. It uses schema version 1, status `approved`, identifies the human operator, records the approval source, includes a concise packet summary, and lists the reviewed planning artifacts. It is evidence that the Implementation Approval Packet was presented and approved; the validator checks record shape, not cryptographic proof of the chat event.
- `delegationPlan` SHALL exist when tasks.md contains owner-tagged tasks. It uses schema version 1, lists required roles, and gives each role task IDs, allowed roots, exact skills, resolution (`paths-injected` or `inline-fallback`), and a fallback reason when inline fallback is used.
- Preserve `## Decisions and Deviations`, `## Problems`, and a cumulative `## Handoff History` after the snapshot.
- Every handoff entry records the complete phase-handoff output, including allowed roots and exact skill paths.
- Completed owner-tagged tasks SHALL be covered by `## Handoff History`; inline fallback requires both `Skill resolution: inline-fallback` and a concrete fallback reason.

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
