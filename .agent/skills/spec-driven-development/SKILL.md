---
name: spec-driven-development
description: Root lifecycle policy for docs, OpenSpec, .agent execution, approval, verification, and archive.
---

# Hybrid Spec-Driven Development

## Authorities

- `docs/`: curated project context and requirement intent.
- OpenSpec: executable change state and accepted behavior.
- `.agent/`: roles, skills, contracts, and reference patterns.
- `tasks.md`: task completion; `apply-progress.md`: execution evidence;
  `verify-report.md`: final evidence.

Executors use the `HARNESS_EXECUTOR_V1` path and do not load this root skill
unless explicitly assigned.

## Classification and assurance

| Request | Route |
|---|---|
| Broad/product intent | Requirements curator; review documentation impact before a new missing capability. |
| Ready behavior change | Create/update OpenSpec and link a brief when applicable. |
| Named active change | Recover status, tasks, and progress; never duplicate it. |
| Internal refactor/docs without accepted-contract change | `.agent`; OpenSpec optional, no forced brief. |
| Close | Verify evidence and archive readiness. |

Choose one assurance profile:

- `no-change`: accepted behavior is preserved (including a repair that restores
  it) or work is internal/documentary; cite that boundary, run scoped checks,
  and create no change progress/report.
- `standard-change`: normal accepted or implementation behavior; approval,
  schema-v3 evidence, focused tests, and final runner.
- `high-risk`: destructive data, permissions/security, dependency/platform,
  migration, external-system, or multi-boundary change; add applicable
  independent architecture/implementation/documentation roles, independent
  verification, and risk-specific evidence.

When impact/risk is uncertain, choose the more rigorous applicable profile and
keep the uncertainty as an open question.

## OpenSpec and readiness

Before apply run `openspec status --change <id> --json` and `openspec
instructions apply --change <id> --json`. Before verify/archive run status.
OpenSpec 1.6 has no instructions verify/archive artifact.

Reread the applicable brief, proposal, delta specs, design, and tasks. Confirm
they exist, agree on scope, reference reachable paths, and contain no blocking
question. Then present an Implementation Approval Packet: change/profile,
requirement status, readiness, scope/non-goals, design, task/ownership plan,
editable roots/file families, risks/questions, and verification. Stop for
explicit approval.

Record approval before or with the first implementation edit. Its checkpoint
uses the exact sorted planning path set and SHA-256 from:

`node scripts/validate-harness.mjs --planning-digest <change-id>`

Planning edits stale approval; task checkbox updates do not.

## Execution

- Create schema-v3 `ownershipPlan` before implementation and follow owner-tagged
  tasks.
- `inline` suits small/tightly coupled work; `subagent` suits independent
  research or one-writer parallel work; `runtime-fallback` requires a failed
  planned subagent and recovery evidence.
- Use the phase-handoff contract and only exact registry skills.
- Give each exclusive artifact one active writer. Executors never redelegate.
- Subagent-only budgets/milestones are 10 minutes planning/curation, 20
  implementation, and 15 verification by default. A yielded wait is not a
  timeout; after budget exhaustion allow one recovery, stop the old writer,
  then confirm terminal state before takeover.
- Architect delegation is advisory by default. Authorship requires exact
  inputs/template, exclusive artifact, `maxResearchRounds` (8 default), and
  stopping condition.
- Use focused behavior tests and `pnpm verify:fast` while editing.
- For a linked product brief, compare approved documentation impact, current
  digest, implemented scope, and maintained paths before final verification.
  Unchanged scope with planned impact `none` records structured
  `unchanged-scope`/`no-change`; material scope or maintained-file changes
  require the curator. Requirementless work records `not-applicable`.

## Verification and close

Before expensive gates, validate accepted/delta `MODIFIED` requirement and
scenario identity. Final evidence comes from exactly one `pnpm verify`, whose
runner executes specs/harness, unit/component, non-incremental typecheck, full
lint, and build once in order with timings.

Finalize tasks/progress, persist structured PASS/FAIL gate output, generate a
fresh SHA-256 evidence snapshot, and run strict archive readiness. Any covered
edit invalidates the report. Archive only with `openspec archive <id> --yes
--json`, then reconcile the linked requirement/index and validate accepted
specs. No confirmation or pre-existing failure overrides PASS.

For `no-change`, cite the accepted contract or internal boundary and select
checks by affected roots: documentation coherence for docs-only work;
harness fixtures/validation for governance; focused tests plus applicable
typecheck/lint for implementation repair; build only for route, build,
dependency, or configuration risk.

Reference implementations are lazy inputs under `.agent/reference/widget/`;
requirement-quality examples are under `.agent/reference/spec-example/`.
