## Context

REQ-007 introduces a simulated task management CRUD module for the admin panel.
The module is intentionally lightweight: it exists to exercise the harness on a
visible, localized module workflow without adding real persistence,
authentication, assignment permissions, comments, subtasks, or reporting.

The current codebase already has accepted `suppliers` and `vehicles` pilots
that establish process-local mock data, SSR URL filter sanitation, responsive
list views, modal CRUD actions, and focused Vitest evidence. The
`.agent/reference/widget` module remains the pattern reference, while the
current CRUD modules show the repo's active file placement, including shared
Zod schemas under `modules/<module>/lib/schemas`.

## Goals / Non-Goals

**Goals:**

- Add a complete `tasks` module with list, filters, create, detail, edit,
  delete, and status-change workflows.
- Keep the domain model simple: title, optional description, status, priority,
  optional due date, and audit timestamps.
- Use deterministic mock seeds and process-local mutable state that survives
  refreshes while the server process remains alive.
- Keep the URL as the list state authority for search, status, priority,
  sorting, page, and limit.
- Localize all visible text in English and Spanish.
- Add focused automated coverage for deterministic validation, URL, query, and
  mutation behavior.

**Non-Goals:**

- No database, durable persistence, API routes, real authentication,
  authorization, user assignment, comments, subtasks, recurrence, notifications,
  files, reports, imports, exports, drag-and-drop, kanban board, bulk actions,
  or new dependencies.
- No changes to accepted suppliers, vehicles, items, users, or harness
  behavior.
- No UI claim that mock state is durable beyond the running server process.

## Decisions

### Add an independent `tasks` module

Tasks will live under `modules/tasks/**` with `tasks-content.tsx`, `list`,
`filters`, `form`, `details`, `delete`, `status`, and `lib` subfolders for
actions, services, hooks, mock data, schemas, and types. The route will be
`app/[locale]/(protected)/tasks/page.tsx`, with `paths.tasks` and a Catalog
sidebar entry using a task-oriented Lucide icon such as `ListTodo`.

Alternative considered: add tasks to an existing dashboard or catalog module.
That would reduce files but would not exercise module ownership, route wiring,
localized navigation, and handoff boundaries.

### Use a small task domain contract

`Task` will include `id`, `title`, `description`, `status`, `priority`,
`dueDate`, `createdAt`, and `updatedAt`. Status values will be `todo`,
`inProgress`, and `done`; priority values will be `low`, `medium`, and `high`.
Title will be trimmed, required, 2-120 characters, and unique
case-insensitively. Description and due date are optional.

Alternative considered: add assignments, comments, labels, attachments, or
subtasks. Those fields would make the pilot feel more like a workflow product,
but REQ-007 explicitly asks to avoid model complexity.

### Share validation through `lib/schemas`

Task create and edit schemas will live under `modules/tasks/lib/schemas` so
server actions and client forms can share normalization and validation shape,
matching the current `suppliers` and `vehicles` modules. Client forms will use
React Hook Form and existing RHF components; server actions will validate again
before service mutation.

Alternative considered: place create-only schemas under `form/create/schemas`
as the older module anatomy allows. That is valid in the abstract, but the
current repo pattern favors reusable schemas under `lib/schemas` for CRUD
modules.

### Keep mutations process-local

The service layer will seed deterministic tasks and mutate a module-local
in-memory collection. Mutations survive refresh in the same server process and
reset after restart. Tests may use a module reset helper through imports only;
no API route or test-only browser endpoint is added.

Alternative considered: browser storage or file-backed JSON persistence. That
would blur server/client ownership or introduce persistence outside the
mock-only scope.

### Make URL filters explicit and shareable

Task filters will sanitize `search`, `status`, `priority`, `page`, `limit`,
`sortBy`, and `sortOrder`. Search will match title and description. Sorting
will support title, status, priority, due date, and creation date. Valid limits
will follow existing module convention: 5, 10, 20, and 30.

Alternative considered: client-only filtering. The existing module pattern uses
SSR with sanitized URL state, and preserving that contract gives refreshable
views and deterministic behavior tests.

### Split roles by ownership

The data executor owns task types, schemas, mock data, services, actions, hooks,
and focused data tests. The UI executor owns route, navigation, messages,
content, filters, list, forms, details, delete/status containers, and UI-facing
tests when needed. The verifier owns final gates and evidence only.

Alternative considered: one broad executor. The harness requires bounded
handoffs for this module workflow, and the data/UI split keeps write scopes
clear.

## Risks / Trade-offs

- [Mock state resets after restart] -> Document the limitation in behavior and
  avoid UI language that implies durable persistence.
- [Task scope can grow quickly] -> Keep assignments, comments, subtasks,
  recurrence, kanban, and notifications out of this change.
- [Date formatting can be locale-sensitive] -> Store optional due date as ISO
  `yyyy-MM-dd` and render through existing localized presentation patterns.
- [Schema placement differs from the older anatomy] -> Use `lib/schemas`
  because it matches the active suppliers/vehicles modules and supports shared
  client/server validation.

## Migration Plan

1. Add the `tasks` OpenSpec capability and implementation module.
2. Add route, navigation, path helper, and localization entries.
3. Add deterministic task tests and run fast feedback during implementation.
4. Run final `pnpm verify`, persist PASS evidence, and prepare archive
   readiness.

Rollback removes the additive task route, module, messages, tests, and spec
delta. No data migration is required.

## Open Questions

None blocking. REQ-007 intentionally keeps the task model simple for this
harness validation iteration.
