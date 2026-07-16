## 1. Planning and Readiness

- [x] 1.1 [orchestrator] Reread REQ-007, proposal, design, specs, tasks, native status, and apply instructions before implementation.
- [x] 1.2 [orchestrator] Create `apply-progress.md` with approval checkpoint, readiness summary, delegation plan, exact skills, editable roots, and handoff boundaries.

## 2. Data Layer

- [x] 2.1 [agent-data] Add task domain types, filter DTOs, URL converters, enum metadata, and sanitation helpers.
- [x] 2.2 [agent-data] Add shared task Zod schemas for create/edit validation and server boundary normalization.
- [x] 2.3 [agent-data] Add deterministic task seeds and process-local resettable mock store.
- [x] 2.4 [agent-data] Add task services for list/query, detail, create, edit, delete, and status change with duplicate-title and missing-record handling.
- [x] 2.5 [agent-data] Add server actions and client hooks for task create, edit, detail, delete, and status change.
- [x] 2.6 [agent-data] Add focused task behavior tests for validation, URL sanitation, query behavior, CRUD mutations, duplicates, missing records, status changes, and reset semantics.

## 3. UI and Localization

- [x] 3.1 [agent-ui] Add `/{locale}/tasks` route, metadata, `TasksContent`, and SSR filter handoff.
- [x] 3.2 [agent-ui] Add tasks path helper and Catalog sidebar navigation with a task-related Lucide icon.
- [x] 3.3 [agent-ui] Add localized English and Spanish namespaces for tasks, filters, forms, details, delete, status, actions, errors, and notifications.
- [x] 3.4 [agent-ui] Add task filters with URL-synchronized search, status/priority selects, sorting, active chips, reset behavior, and pagination controls.
- [x] 3.5 [agent-ui] Add responsive task list table and mobile cards with view, edit, status-change, and delete actions.
- [x] 3.6 [agent-ui] Add create and edit task modal forms using existing RHF components and shared schemas.
- [x] 3.7 [agent-ui] Add task detail, delete confirmation, and status-change modal containers.

## 4. Verification

- [x] 4.1 [agent-verifier] Run focused fast feedback for the task implementation and ensure failures are routed back to the owning role.
- [x] 4.2 [agent-verifier] Run `openspec validate add-task-management --strict`.
- [x] 4.3 [agent-verifier] Run `pnpm verify` and ensure specs, tests, typecheck, lint, and build gates pass without weakening checks.
- [x] 4.4 [agent-verifier] Reconcile `tasks.md` and `apply-progress.md` so completed implementation and verification evidence match.
