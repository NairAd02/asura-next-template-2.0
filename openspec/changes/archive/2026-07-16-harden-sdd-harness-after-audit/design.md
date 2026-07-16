## Context

REQ-003 follows a successful static verification pilot but found gaps between the repository entry contract, generated OpenSpec skills, maintained code references, and archived evidence. OpenSpec validates artifact shape, not cross-document semantics; TypeScript and ESLint currently exclude the reference agents are told to copy; and the local archive skill can bypass the repository's own readiness rules.

## Goals / Non-Goals

**Goals:**

- Make propose/apply/archive obey one repository lifecycle and fail closed.
- Mechanically validate the invariants that can be checked from files and hashes.
- Keep reference code under the same type/lint standards as production code.
- Retain four top-level gates and add no package dependency.
- Produce durable, resumable handoff and verification evidence.

**Non-Goals:**

- Prove semantic quality, truthful reporting, or runtime enforcement of agent roots.
- Rewrite historical archives or introduce a second OpenSpec state engine.
- Add browser-test packages, a database, or the suppliers pilot.

## Decisions

### Repository overlays harden generated OpenSpec skills

The local propose, apply, sync, and archive skills receive a stable `LOCAL_HARNESS_INTEGRATION_V1` marker and repository-specific preflight sections. Archive hard-blocks on invalid readiness and calls `openspec archive <id> --yes --json` rather than moving directories.

- **Rationale:** These skills are executable entry points and must not contradict root policy.
- **Alternative:** Rely only on AGENTS.md precedence. Rejected because explicit skill invocation can still guide an agent toward unsafe steps.
- **Upgrade behavior:** `validate:harness` fails when the marker or required native-archive language disappears, forcing deliberate review after `openspec update`.

### One dependency-free validator owns mechanical invariants

`scripts/harness-validation.mjs` exposes pure validation helpers. `scripts/validate-harness.mjs` checks the repository, while `scripts/harness-validation.test.mjs` uses `node:test` and temporary fixtures for negative cases.

The validator checks:

- exact OpenSpec CLI version 1.6.0;
- local skill integration and prohibited archive bypass language;
- unsupported `instructions verify/archive` guidance and obsolete archive exceptions;
- every active change whose implementation has started: tasks, current progress, PASS evidence, and snapshot freshness;
- a PASS report only when every task is checked and progress is `ready-for-archive` with no remaining task IDs.

It does not inspect archived changes, preserving historical evidence.

### Verification reports contain a reproducible SHA-256 snapshot

The verifier records a fenced `json` snapshot with version, algorithm, sorted paths, and a combined digest. The set includes the active change's planning/tasks/progress files, linked requirement/index, and implementation files listed in progress. `verify-report.md` itself is excluded. Archive preflight recalculates the digest.

- **Rationale:** This makes the documented invalidation rule mechanically checkable without Git state or a second evidence file.
- **Alternative:** File timestamps. Rejected because they are unstable across copies and checkouts.

### Close operations are outside implementation tasks

`tasks.md` contains implementation and commands that can be completed before the report. The final order is:

1. Complete implementation tasks and browser checks.
2. Run the four gates.
3. Mark verification tasks complete and set progress to `ready-for-archive`.
4. Write the report and snapshot.
5. Re-run status plus archive readiness validation.
6. Run native archive.
7. Update the requirement/index and validate accepted specs.

Creating the report and moving/archive-syncing the change are expected close operations, not task checkboxes and not snapshot inputs.

### `no-change` has no invented OpenSpec artifacts

For internal non-contract work, the verifier runs only relevant project checks and returns results in the handoff/final response. It does not call change status or create progress/report files unless the operator explicitly chose an OpenSpec technical change.

### The widget reference gets separate compilation but shared gates

`tsconfig.reference.json` extends the application config and overrides the `.agent` exclusion for `.agent/reference/widget`. `typecheck` runs application then reference checks; `lint` runs the normal tree then an explicit `--no-ignore` reference pass. The reference receives complete table/card views, server-boundary Zod parsing, NOT_FOUND semantics, and localizable schema factories.

### Reproducibility avoids new dependencies

The existing lockfile becomes tracked. OpenSpec remains a global prerequisite but the validator enforces 1.6.0. Google font imports are replaced with system font stacks, removing build-time network access.

## Interfaces

### Package scripts

- `validate:harness`: Node tests followed by repository validation.
- `validate:specs`: OpenSpec validation plus `validate:harness`.
- `typecheck:app`, `typecheck:reference`, `typecheck`: explicit non-incremental checks.
- `lint`: application lint plus explicit reference lint.
- `verify`: unchanged four-gate aggregate order.

### Progress handoffs

`apply-progress.md` gains a current snapshot plus cumulative handoff log. Each handoff records role, bounded task, status, roots, exact skills, files, completed task IDs, risks, and next phase.

### Reference server validation

Widget create/edit actions use shared schema factories at the server boundary. Invalid data returns `ServiceResponse` with `VALIDATION_ERROR`; services receive normalized DTOs and retain business rules.

## Skills and Responsibility Boundaries

- Orchestrator: `.codex/skills`, `.agent`, docs, scripts/configuration, OpenSpec artifacts.
- Architect: proposal/design/delta specs/tasks only.
- Verifier: read-only checks plus report/tasks/progress within the active change.
- Exact skills: spec-driven-development, implementation-progress, verification-harness; module-architecture, data-layer, client-views-modals, forms-rhf-zod, and i18n-conventions only for the widget reference.

## Migration Plan

1. Add validator/tests and safe local skill overlays.
2. Align governance, guides, live deltas, and close ordering.
3. Repair and gate the widget reference.
4. Track the lockfile and remove remote font loading.
5. Exercise negative fixtures, run final gates, create fresh evidence, and archive natively.

Rollback is a source revert. No dependency or runtime-data migration exists.

## Verification Approach

- Run `node --test scripts/harness-validation.test.mjs` and require every negative fixture to be rejected for the intended reason.
- Run the repository validator against this active change before and after PASS evidence.
- Run explicit reference typecheck/lint and the aggregate `pnpm verify`.
- Inspect package/build output to ensure no Google Fonts fetch occurs.
- Use native OpenSpec status before verification/archive and native archive for closure.

## Risks / Trade-offs

- [Generated skills may be overwritten] -> marker validation fails immediately after regeneration.
- [Markdown parsing is intentionally narrow] -> require stable headings and machine-readable snapshot JSON; return actionable errors instead of guessing.
- [Historical archives remain inconsistent] -> exclude them from enforcement and document them in the audit report.
- [System fonts change typography slightly] -> preserve semantic font families and accept the visual trade-off for offline builds.
- [Four gates still do not prove UI behavior] -> suppliers pilot adds browser acceptance evidence without changing this harness change's dependency scope.

## Open Questions

None.
