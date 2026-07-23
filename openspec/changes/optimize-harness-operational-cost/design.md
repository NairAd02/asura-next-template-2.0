## Context

The accepted harness provides strong lifecycle and archive guarantees, but its
current representation makes the common path expensive:

- root bootstrap loads about 2,467 words across three files whose lifecycle
  guidance overlaps;
- a full UI executor can load about 6,759 words because domain skills embed
  long code examples already represented under `.agent/reference/widget/`;
- archived changes average about 378 lines across proposal, design, tasks,
  progress, and report, with progress alone averaging 163 lines;
- schema-v2 repeats role fields in the delegation plan and prose Handoff
  History, including for deliberately inline work;
- the final command normally costs 80-105 seconds, but reports that require
  per-gate timing have triggered a second diagnostic execution of all gates;
- native archive incompatibilities have been discovered only after final
  verification, invalidating otherwise successful evidence.

The operator accepted the preceding repository-grounded analysis and requested
all proposed optimizations. This is one technical-governance boundary: no
product behavior, data, API, dependency, UI, or i18n work applies. The change
uses assurance profile `standard-change` because it modifies accepted workflow
behavior but introduces no destructive, security, dependency, or product
boundary.

Applicable skills are:

- `.agent/skills/spec-driven-development/SKILL.md`
- `.agent/skills/implementation-progress/SKILL.md` during apply
- `.agent/skills/verification-harness/SKILL.md` during final verification

No requirement brief, curator, module architecture, data, UI, forms, filters,
SSR, i18n, or behavior-testing skill applies.

## Goals / Non-Goals

**Goals:**

- Make accepted-contract impact the primary routing decision.
- Preserve the complete fail-closed path for contract changes while making
  contract-preserving work genuinely lightweight.
- Remove duplicated normative context and duplicated execution evidence.
- Bind approval to deterministic planning content.
- Execute every final gate once while producing exact structured timing.
- Detect archive-contract incompatibility before expensive final gates.
- Preserve recoverability, one-writer ownership, exact skills/roots, SHA-256
  freshness, and native OpenSpec state.

**Non-Goals:**

- Selectively reuse a previous final PASS after covered content changes.
- Remove any final gate or make final typecheck/lint cache-dependent.
- Add another workflow database, background service, package dependency, CI
  platform, browser framework, or child Codex process.
- Change application code or accepted product capabilities.

## Decisions

### 1. Add three assurance profiles without adding another state engine

Classification becomes:

| Profile | Contract impact and risk | Required lifecycle |
|---|---|---|
| `no-change` | Restores accepted behavior or changes only internal implementation/documentation | `.agent` plus scoped command evidence; no OpenSpec progress/report/packet |
| `standard-change` | Bounded accepted-contract delta without critical boundaries | Full OpenSpec planning, approval, progress, final gates, snapshot, readiness, archive |
| `high-risk` | Auth/permissions, destructive migration, new dependency, multiple architectural boundaries, or operator override | Standard path plus applicable independent specialist and verifier boundaries |

A root decision must cite the accepted spec or internal scope for `no-change`.
Uncertainty selects the more rigorous profile. OpenSpec remains the only
executable state authority for the two change profiles.

Alternative: infer risk only from changed file count. Rejected because a
one-line permission change can be critical while a broad documentation cleanup
can be contract-preserving.

### 2. Keep the existing bootstrap paths but make each source single-purpose

The bootstrap order remains compatible:

1. SDD skill: authoritative lifecycle, assurance profiles, readiness, apply,
   verification, and archive rules.
2. Registry: exact skill-to-owner mapping only.
3. Orchestrator: role-specific classification/delegation decisions only.

`AGENTS.md` remains a concise router. Role files contain executor boundaries,
not root lifecycle copies. Human guides explain usage and link to the
authoritative source instead of restating every invariant.

Domain skills retain rules, decisions, naming, checklists, and exact lazy
reference paths. Long inline code samples move out of the loaded skill surface;
the existing reference widget remains the navigable implementation example.

The validator will enforce word-count ceilings chosen from the implemented
compact forms:

- root bootstrap aggregate: at most 1,800 words;
- full UI executor aggregate: at most 4,200 words;
- data executor aggregate: at most 3,000 words.

These ceilings apply to mutable active guidance, not archived evidence.

Alternative: introduce a fourth lifecycle-policy file. Rejected because it
would reduce duplication but add another mandatory read.

### 3. Bind approval to a deterministic planning digest

Extend the harness CLI with:

```text
node scripts/validate-harness.mjs --planning-digest <change-id>
```

The digest uses SHA-256 over a sorted path set containing proposal, all delta
specs, design, tasks, and the linked requirement when applicable. It uses a
distinct domain prefix from the final Evidence Snapshot.

The packet displays the digest. `approvalCheckpoint` advances to schema version
2 and records:

- operator/source/time/status;
- assurance profile;
- reviewed path set;
- packet summary;
- planning digest.

Apply recomputes the digest before implementation. A mismatch blocks reuse and
requires a refreshed packet. If the current conversation already contains the
matching approved packet, apply does not present it a second time. A recovered
or context-insufficient executor still reads the task-relevant context files;
digest reuse eliminates duplicate approval work, not implementation context.

Alternative: trust timestamps. Rejected because timestamps do not identify
content and can change independently of semantic planning.

### 4. Replace schema-v2 duplication with schema-v3 ownership and execution

`Current Snapshot` advances to schema version 3:

```json
{
  "schemaVersion": 3,
  "status": "in-progress",
  "assuranceProfile": "standard-change",
  "completedTaskIds": [],
  "remainingTaskIds": ["1.1"],
  "filesChanged": [],
  "skillsLoaded": [],
  "approvalCheckpoint": {
    "schemaVersion": 2,
    "status": "approved",
    "assuranceProfile": "standard-change",
    "planningDigest": "<sha256>",
    "artifactsReviewed": []
  },
  "ownershipPlan": {
    "schemaVersion": 3,
    "roles": [
      {
        "role": "orchestrator",
        "taskIds": ["1.1"],
        "allowedRoots": [".agent/**"],
        "skills": [".agent/skills/spec-driven-development/SKILL.md"],
        "skillResolution": "paths-injected",
        "plannedMode": "inline",
        "exclusiveArtifacts": [".agent/skills/spec-driven-development/SKILL.md"]
      }
    ]
  },
  "executionRecords": []
}
```

The phase-handoff output becomes one fenced JSON execution record that can be
persisted without transcription. Core fields are:

- role, task IDs, status, summary;
- execution mode, allowed roots, exact skills/skill resolution;
- files changed, verification, risks, exclusive artifacts.

`subagent` additionally records milestones, budget class/minutes/outcome.
`runtime-fallback` additionally records planned mode, fallback reason, bounded
recovery, and prior-writer terminal evidence. Planned `inline` deliberately
omits those subagent-only fields.

`## Handoff History` is removed as a required duplicated data store.
`## Decisions and Deviations` and `## Problems` remain concise human narrative
sections. Validator coverage moves from prose regexes to structured
`executionRecords`.

Archived schema-v1/v2 evidence is not migrated. Only active changes are
validated against schema v3 after the migration lands.

Alternative: keep schema v2 and shorten prose. Rejected because it retains two
authoritative representations that can diverge.

### 5. Make documentation reconciliation evidence-driven

Schema v3 adds optional `documentationImpact` and
`documentationReconciliation`.

For a linked product brief, planning records:

- maintained paths reviewed;
- planning digest at approval;
- whether documented scope predicts material documentation impact.

Before verification:

- if the planning digest still matches, implementation files do not touch
  maintained documentation, and planned impact is `none`, the orchestrator
  records `mode: unchanged-scope` with compared paths and digest;
- otherwise the existing bounded curator handoff runs and its structured
  execution record plus ledger result are persisted.

Requirementless changes record `not-applicable`. This keeps documentation
auditable without spawning a curator to restate an unchanged ledger.

Alternative: remove final reconciliation. Rejected because implementation can
discover material scope not visible during initial curation.

### 6. Run final gates once through a structured runner

Add `scripts/run-verification.mjs` with a static ordered gate definition:

1. `pnpm validate:specs`
2. `pnpm test:unit:run`
3. `pnpm typecheck`
4. `pnpm lint`
5. `pnpm build`

The runner:

- uses only Node built-ins and the platform-appropriate pnpm executable;
- streams child output for diagnosis;
- measures each child with a monotonic clock;
- captures a bounded output tail for the summary;
- stops after the first non-zero exit;
- emits a final `HARNESS_VERIFY_RESULT_V1` JSON object;
- writes the same JSON to ignored
  `.cache/harness/verification-result.json` for report construction;
- records aggregate duration and completed/skipped gates;
- exits non-zero when any gate fails.

`package.json` changes `verify` to invoke only this runner. The validator checks
the runner's exported gate definition and rejects missing, duplicated,
reordered, incremental/cached final gates. Reports copy this single result and
do not rerun individual commands.

Alternative: add a timing package or shell-specific wrapper. Rejected to keep
the harness portable and dependency-free.

### 7. Validate native archive compatibility before final gates

Extend continuous harness validation to parse active delta operations. For each
`MODIFIED` accepted requirement, it compares exact normalized requirement and
scenario headings with the accepted requirement block. Missing identities fail
with capability, requirement, and scenario details.

This compatibility check runs inside `pnpm validate:specs`, the first final
gate, and through focused provisional harness validation. It does not mutate
accepted specs or emulate archive; native OpenSpec still owns synchronization
and movement.

Alternative: run a real archive and restore it. Rejected because archive is
state-changing and restoration would be unsafe.

### 8. Make independent verification proportional

- `no-change`: owning root/role returns scoped command evidence.
- `standard-change`: `agent-verifier` ownership remains explicit, but execution
  may be planned `inline` when one writer and deterministic gates make a
  separate thread pure coordination overhead.
- `high-risk`: final verification uses an independent subagent when the runtime
  supports it; a runtime without that capability records the supported
  execution mode honestly and may require operator direction.

Verifier execution never repairs implementation. Full final gates, snapshot,
and strict readiness apply to every OpenSpec change profile.

Alternative: remove the verifier role from standard changes. Rejected because
role ownership remains useful for report and failure routing even when its
execution mechanism is inline.

## Interfaces

- `node scripts/validate-harness.mjs --planning-digest <change-id>` returns the
  planning path set and SHA-256 digest.
- `pnpm verify` invokes `node scripts/run-verification.mjs`.
- `.cache/harness/verification-result.json` is generated, ignored, and excluded
  from source evidence.
- `Current Snapshot.schemaVersion` becomes `3`.
- `approvalCheckpoint.schemaVersion` becomes `2`.
- `delegationPlan` is replaced by `ownershipPlan`.
- `executionRecords` replaces required prose `Handoff History`.
- Assurance profiles are `no-change`, `standard-change`, and `high-risk`.

## Responsibility Boundaries

- `orchestrator` inline: planning digest, governance consolidation, progress
  schema, handoff contract, roles, skills, local OpenSpec overlays, validator,
  runner, package scripts, documentation, and active change progress/tasks.
- `agent-verifier` planned inline for this `standard-change`: independent role
  ownership of final conformance, report, task/progress finalization, snapshot,
  and strict readiness. It does not repair source.

No curator, architect, data, or UI execution is required.

## Risks / Trade-offs

- [Over-aggressive `no-change` classification] -> Require an accepted-spec or
  internal-scope citation; uncertainty escalates the profile; validator tests
  guidance and examples.
- [Compact skills omit useful nuance] -> Preserve normative rules/checklists
  and exact lazy reference paths; validate reference typecheck/lint unchanged.
- [Planning digest is mistaken for human-proof] -> Document that it proves
  content consistency only, not the truth of the approval event.
- [Schema v3 breaks an active schema-v2 change] -> Confirm no other active
  change before apply; do not validate or rewrite archives as active evidence.
- [Runner JSON is lost after a failed tool session] -> Stream the result and
  write an ignored cache copy; exit status remains authoritative.
- [Runner implementation accidentally recurses through `pnpm verify`] ->
  Validate exact static gate definitions and add negative fixtures.
- [Archive compatibility parser diverges from OpenSpec] -> Keep it conservative:
  check only mechanically preserved requirement/scenario identities for
  `MODIFIED` blocks; native validation and archive remain authoritative.
- [Inline verification loses independence] -> Permit it only for standard
  changes; retain verifier ownership, deterministic gates, and operator
  override to high-risk.
- [Word ceilings become arbitrary] -> Set them from the completed compact
  content with headroom and validate behavior/reference paths, not brevity
  alone.

## Migration Plan

1. Create schema-v2 progress and approval evidence required by the current
   harness before the first implementation edit.
2. Implement the planning-digest primitive and verification runner with focused
   tests while the existing final command remains available.
3. Upgrade validator parsing/fixtures for assurance profiles, planning digest,
   schema-v3 ownership/execution records, skill budgets, and delta
   compatibility.
4. Atomically migrate this active change progress from schema v2 to v3 when the
   validator contract changes.
5. Consolidate governance, handoffs, roles, domain skills, local overlays, and
   runtime guidance.
6. Update package scripts and verification/report guidance to consume the
   single runner result.
7. Reconcile operator/developer documentation and accepted-contract examples.
8. Run focused syntax/tests, `pnpm validate:harness`, warm
   `pnpm verify:fast`, then exactly one authoritative `pnpm verify`.
9. Finalize schema-v3 tasks/progress, create PASS from the runner result,
   generate a fresh snapshot, and pass strict archive readiness.

Rollback reverts steps 2-7 together and restores schema-v2 active evidence
before running the old final verification path. No product or dependency
migration is involved.

## Verification Approach

- Strict OpenSpec validation and accepted/delta heading compatibility.
- Node fixtures for all three assurance profiles.
- Positive compact inline/subagent/runtime-fallback schema-v3 records.
- Negative fixtures for missing ownership, conditional lifecycle/recovery,
  duplicated evidence, stale planning digest, incomplete task coverage, and
  unsafe paths.
- Runner unit tests with injected stub processes for order, single execution,
  timing shape, fail-fast behavior, cache output, and exit propagation.
- Word-budget and lazy-reference checks for compact skills.
- Existing snapshot-staleness and archive-readiness negative fixtures.
- `pnpm validate:harness`, one warm `pnpm verify:fast`, and one final
  `pnpm verify`; no supplemental replay of individual final gates.

## Open Questions

None blocking.
