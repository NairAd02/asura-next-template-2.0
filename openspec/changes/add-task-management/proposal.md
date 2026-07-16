## Why

REQ-007 asks for a lightweight, mock-backed task management module in the admin
panel to validate the AI development harness with a realistic but intentionally
simple CRUD workflow. The change exercises the same docs -> OpenSpec -> .agent
path as prior pilots while keeping persistence, authentication, and advanced
workflow features out of scope.

## What Changes

- Add a localized `tasks` admin module with independent route, sidebar entry,
  metadata, list, filters, pagination, responsive table/cards, empty state, and
  modal create/detail/edit/delete/status workflows.
- Add a process-local task data layer with deterministic seeds, validation,
  duplicate-title detection, URL filter sanitation, sorting, pagination, and
  mutation helpers.
- Add English and Spanish messages for task navigation, filters, forms,
  details, confirmation dialogs, actions, statuses, priorities, errors, and
  notifications.
- Add focused automated behavior coverage for task schemas, server validation,
  URL state, query behavior, CRUD mutations, duplicate handling, missing
  records, and store reset semantics.

## Capabilities

### New Capabilities

- `tasks`: Defines the task domain contract, mock CRUD state, URL-backed
  querying, localized responsive admin experience, and focused verification
  evidence for the lightweight task management module.

### Modified Capabilities

- None.

## Impact

- **Requirement brief:** `docs/requirements/manage-tasks/brief.md`.
- **Application routes/navigation:** add `/{locale}/tasks`, `paths.tasks`, and a
  Catalog sidebar entry.
- **Application modules:** add `modules/tasks/**` following the project module
  conventions and current CRUD pilot patterns.
- **Localization:** update `messages/en.json` and `messages/es.json`.
- **Tests:** add focused Vitest coverage under the tasks module.
- **Dependencies/systems:** no new package dependency, API route, database,
  authentication, authorization, external service, import, export, notification,
  comment, subtask, recurrence, or reporting system is introduced.

## Success Criteria

- Operators can browse, search, filter, sort, paginate, create, inspect, edit,
  delete, and change status for mock tasks in English and Spanish.
- Task mutations survive refreshes in the same server process and reset to
  deterministic seeds after restart.
- Invalid inputs and duplicate task titles fail consistently at client and
  server boundaries.
- `pnpm verify` passes with focused task behavior tests included.

## Rollback

Remove the `tasks` route, module, navigation path/sidebar entry, localization
namespaces, tests, and OpenSpec `tasks` capability before archive. No data
migration or dependency rollback is required because the change is mock-only and
adds no external integration.
