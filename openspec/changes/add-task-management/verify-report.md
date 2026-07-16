# Verification Report: add-task-management

## Verdict

PASS

## Conformance Summary

The `add-task-management` change conforms to REQ-007, the proposal, design,
delta spec, and tasks. The focused task behavior target passed, strict
OpenSpec validation passed, and final repository verification passed without
weakening checks. Tasks 4.1-4.4 are complete and `apply-progress.md` is
reconciled to `ready-for-archive`.

## Command Evidence

| Command | Exit code | Duration | Summary |
|---|---:|---:|---|
| `openspec status --change add-task-management --json` | 0 | 3.1s | Native preflight succeeded; proposal, design, specs, and tasks artifacts are present. |
| `pnpm test:unit:run -- modules/tasks/lib` | 0 | 3.6s | Focused task feedback passed: 1 test file and 6 tests. |
| `openspec validate add-task-management --strict` | 0 | 3.8s | Change `add-task-management` is valid. |
| `pnpm verify` | 0 | 117.9s | Aggregate gate passed: specs/harness validation, unit tests, typecheck, lint, and build. |
| `node scripts/validate-harness.mjs --snapshot add-task-management` | 0 | 0.6s | Generated fresh SHA-256 evidence snapshot after tasks/progress reconciliation. |

## Final Gate Detail

- `pnpm validate:specs`: passed; OpenSpec validated 1 active change and 4
  accepted specs, then harness validation passed 16 node tests and active
  progress reconciliation.
- `pnpm test:unit:run`: passed; 4 test files and 19 tests.
- `pnpm typecheck`: passed; app and reference projects used
  `tsc --noEmit --incremental false`.
- `pnpm lint`: passed; repository ESLint and `.agent/reference/widget`
  linting completed.
- `pnpm build`: passed; Next.js production build compiled successfully and
  generated the localized `/[locale]/tasks` route.

## Warnings

- Next.js build emitted existing metadata warnings: `metadataBase` is not set
  for resolving social Open Graph or Twitter images and defaults to
  `http://localhost:3000`.
- No product/source code was edited by verifier.

## Invalidation Rule

Any subsequent implementation or change-artifact modification requires rerunning
the final verification command and replacing this report with fresh evidence.

## Evidence Snapshot

```json
{
  "schemaVersion": 1,
  "algorithm": "sha256",
  "paths": [
    "app/[locale]/(protected)/tasks/page.tsx",
    "docs/project-context.md",
    "docs/requirements/index.md",
    "docs/requirements/manage-tasks/brief.md",
    "messages/en.json",
    "messages/es.json",
    "modules/tasks/delete/delete-task-container.tsx",
    "modules/tasks/details/task-details-container.tsx",
    "modules/tasks/details/task-details-presentational.tsx",
    "modules/tasks/filters/hooks/use-tasks-filters.tsx",
    "modules/tasks/filters/tasks-active-filters.tsx",
    "modules/tasks/filters/tasks-filters-container.tsx",
    "modules/tasks/filters/tasks-filters-presentational.tsx",
    "modules/tasks/form/create/create-task-form-container.tsx",
    "modules/tasks/form/create/create-task-trigger.tsx",
    "modules/tasks/form/edit/edit-task-container.tsx",
    "modules/tasks/form/edit/edit-task-form-container.tsx",
    "modules/tasks/form/task-form.tsx",
    "modules/tasks/lib/actions/task.actions.ts",
    "modules/tasks/lib/hooks/use-change-task-status.tsx",
    "modules/tasks/lib/hooks/use-create-task.tsx",
    "modules/tasks/lib/hooks/use-delete-task.tsx",
    "modules/tasks/lib/hooks/use-edit-task.tsx",
    "modules/tasks/lib/hooks/use-task.tsx",
    "modules/tasks/lib/mock/tasks.data.ts",
    "modules/tasks/lib/schemas/task.schemas.ts",
    "modules/tasks/lib/services/task.services.ts",
    "modules/tasks/lib/task.test.ts",
    "modules/tasks/lib/types/task.types.ts",
    "modules/tasks/list/hooks/index.ts",
    "modules/tasks/list/tasks-list-cards-view.tsx",
    "modules/tasks/list/tasks-list-container.tsx",
    "modules/tasks/list/tasks-list-loading-skeleton.tsx",
    "modules/tasks/list/tasks-list-presentational.tsx",
    "modules/tasks/list/tasks-list-table-view.tsx",
    "modules/tasks/status/change-task-status-container.tsx",
    "modules/tasks/tasks-content.tsx",
    "openspec/changes/add-task-management/apply-progress.md",
    "openspec/changes/add-task-management/design.md",
    "openspec/changes/add-task-management/proposal.md",
    "openspec/changes/add-task-management/specs/tasks/spec.md",
    "openspec/changes/add-task-management/tasks.md",
    "routes/groups-routes/groups-routes.tsx",
    "routes/paths.tsx"
  ],
  "digest": "f6c07527f735e5cbf589bef3077563773043ad01bd4aed851315c1eec3007003"
}
```
