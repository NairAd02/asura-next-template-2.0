# Requirement Brief: Manage Tasks

> **ID:** REQ-007  
> **Status:** in-openspec  
> **Priority:** high  
> **Source:** `docs/project-context.md#client-pilot-task-management`  
> **OpenSpec change:** `add-task-management`

## Intent

Deliver a lightweight task management module in the admin panel so an operator
can exercise a complete mock CRUD workflow while validating the AI development
harness without adding persistence, authentication, or an unnecessarily complex
domain model.

## Actors

- Admin operator managing simple tasks
- Human operator validating the harness
- Requirements curator, architect, data executor, UI executor, and verifier

## Scope

- Add an independent `tasks` module without changing suppliers, vehicles, items,
  users, or authentication behavior.
- Model a simple task with title, optional description, status, priority,
  optional due date, and audit timestamps.
- Provide deterministic mock seeds and process-local mutable CRUD state that
  survives refreshes while the server process remains alive and resets after
  restart.
- Implement list, create, detail, edit, delete, and status-change flows.
- Provide URL-synchronized search, status and priority filters, sorting,
  pagination, parameter sanitization, desktop table, mobile cards, and empty
  state.
- Add a localized `/{locale}/tasks` route, Catalog sidebar entry, metadata,
  paths helper, and complete EN/ES namespaces.
- Validate deterministic data, URL, validation, and component behavior through
  focused automated tests and repository verification.

## Out of Scope

- Database, external APIs, durable persistence, real authentication, real
  authorization, ownership permissions, assignments to real users,
  notifications, comments, files, subtasks, recurrence, reports, imports, or
  exports.
- Kanban boards, drag-and-drop, bulk actions, or advanced workflow automation.
- Changes to accepted suppliers, vehicles, items, users, or harness behavior.

## Candidate Flows

### Browse and filter

1. The operator navigates directly or through Catalog > Tasks.
2. The server renders sanitized URL state and paginated mock task results.
3. The operator searches by title or description.
4. The operator filters by status and priority, sorts, changes page size, or
   navigates pages.
5. Refresh preserves the same URL-backed view.

### Create and validate

1. The operator opens the create modal.
2. Client validation displays localized required, length, enum, and date
   messages.
3. The server boundary validates again and rejects invalid values.
4. A valid task is added to process-local state and appears after refresh.

### Inspect, edit, status change, and delete

1. Row or card actions open detail, edit, status-change, or delete modals.
2. Missing records return `NOT_FOUND` rather than nullable success.
3. Edits and status changes update audit state and survive refresh in the same
   process.
4. Physical delete removes the record and returns to a safe list page.

## Rules and Constraints

- Title is trimmed, required, 2-120 characters, and unique case-insensitively
  among non-deleted mock tasks.
- Description is optional and normalized to a nullable value.
- Status is required and limited to `todo`, `inProgress`, or `done`.
- Priority is required and limited to `low`, `medium`, or `high`.
- Due date is optional but must be a valid date when provided.
- New tasks default to `todo` status and `medium` priority unless the form
  submits explicit values.
- Create and edit inputs are validated at both client and server boundaries.
- Filters are shareable and persist through refresh because the URL is the
  state authority.
- Fallible detail and mutation responses use the project's existing API
  response codes and patterns.
- Visible text must be localized in English and Spanish.

## Dependencies

- `.agent/reference/widget` as the reusable implementation pattern.
- REQ-004 accepted suppliers CRUD pilot and REQ-006 vehicles pilot as domain
  precedents where their implementations match the shared reference pattern.
- Existing shared table, modal, form, filter, pagination, sidebar, toast, and
  localization conventions.
- Process-local mock store helpers.

## Open Questions

- None blocking. The task domain is intentionally simple for this harness
  validation iteration.

## Suggested OpenSpec Change

- **Change ID:** `add-task-management`
- **Affected domain/spec:** `tasks`
- **Notes for proposal/spec/design/tasks:** Reuse the `.agent/reference/widget`
  module structure while keeping tasks independent, mock-backed, localized,
  URL-filterable, modal-driven, and covered by focused behavior tests.
