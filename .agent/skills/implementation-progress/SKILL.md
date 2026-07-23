---
name: implementation-progress
description: Persist schema-v3 ownership, compact execution evidence, task reconciliation, and archive readiness for implemented OpenSpec changes.
---

# Implementation Progress

OpenSpec status owns phase state, `tasks.md` owns completion,
`apply-progress.md` owns cumulative execution evidence, and
`verify-report.md` owns final evidence. A `no-change` task creates neither
progress nor report; return scoped command evidence instead.

## Current Snapshot schema 3

Create `apply-progress.md` before or with the first implementation edit:

```json
{
  "schemaVersion": 3,
  "status": "in-progress",
  "assuranceProfile": "standard-change",
  "completedTaskIds": ["1.1"],
  "remainingTaskIds": ["1.2"],
  "filesChanged": ["modules/example/example.ts"],
  "skillsLoaded": [".agent/skills/example/SKILL.md"],
  "approvalCheckpoint": {
    "schemaVersion": 2,
    "status": "approved",
    "assuranceProfile": "standard-change",
    "approvedBy": "human-operator",
    "approvedAt": "YYYY-MM-DD",
    "approvalSource": "chat",
    "packetSummary": "Approved bounded packet.",
    "artifactsReviewed": ["openspec/changes/id/design.md"],
    "planningDigest": "<sha256>"
  },
  "ownershipPlan": {
    "schemaVersion": 3,
    "assuranceProfile": "standard-change",
    "requiredRoles": ["orchestrator"],
    "roles": [{
      "role": "orchestrator",
      "taskIds": ["1.1", "1.2"],
      "allowedRoots": ["modules/example/**"],
      "skills": [".agent/skills/example/SKILL.md"],
      "skillResolution": "paths-injected",
      "plannedMode": "inline",
      "exclusiveArtifacts": ["modules/example/example.ts"]
    }]
  },
  "executionRecords": []
}
```

`status` is `in-progress`, `blocked`, `ready-for-verification`, or
`ready-for-archive`. Task arrays must exactly match numbered checkboxes.
`filesChanged` contains existing repository-relative covered artifacts, never
caches/generated outputs.

Generate the exact approval path set/digest with:

`node scripts/validate-harness.mjs --planning-digest <change-id>`

Any planning content/path change stales approval. Checkbox and volatile linked
brief status/synchronization updates are normalized.

The ownership plan records responsibility, not runtime execution. Exact owner
tags, task coverage, safe roots, skills, planned mode, and one-writer exclusive
artifacts are required.

## Compact execution records

Every completed owner-tagged task needs a successful record matching its role
and task ID. Common fields are role/task IDs, status, summary, actual mode,
roots, skills/resolution, files, verification `{command, exitCode, summary}`,
risks, and exclusive artifacts.

- `inline`: omit milestones, budget, plannedMode, and fallback fields.
- `subagent`: include observable milestones and
  `budget: {class, minutes, outcome}`.
- `runtime-fallback`: include the subagent fields plus `plannedMode:
  subagent`, reason, retry evidence, and terminal confirmation.

Keep `## Decisions and Deviations` and `## Problems`. A prose handoff history
may be added for useful narrative but is not required or mechanically parsed.
Never claim provider activity or elapsed time that was not observed.

## Documentation evidence

Before `ready-for-verification`:

- requirementless work records `documentationReconciliation` mode/result
  `not-applicable` plus rationale;
- linked product work plans `documentationImpact` with brief, exact maintained
  paths, and `plannedImpact` (`none` or `material`);
- unchanged digest/scope with impact `none` and no maintained-path edit records
  reconciliation mode `unchanged-scope`, result `no-change`, current digest,
  and every compared path;
- otherwise mode `curator` requires its successful execution record and
  `updated`, `no-change`, or `not-applicable` result.

## Final report and archive

The verifier records conformance, warnings, PASS/FAIL, and the complete JSON
result emitted by the single timed `pnpm verify` runner under `## Verification
Run`. It must contain all five gates exactly once in order with command, exit
code, duration, status, and summary.

After all task checkboxes and progress are final, set `ready-for-archive`,
generate `node scripts/validate-harness.mjs --snapshot <change-id>`, and add its
JSON under `## Evidence Snapshot`. The snapshot covers active change files
except the report, linked requirement/index, and `filesChanged`. Any covered
edit stales it.

Before native archive run status and:

`node scripts/validate-harness.mjs --archive-ready <change-id>`

Only fresh PASS may proceed to `openspec archive <id> --yes --json`.
