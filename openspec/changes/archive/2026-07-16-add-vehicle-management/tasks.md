## 1. Planning and Readiness

- [x] 1.1 Link and reconcile REQ-006 with the active `add-vehicle-management` change artifacts.
- [x] 1.2 Reread proposal, design, specs, tasks, and the linked requirement brief before apply.
- [x] 1.3 Create cumulative `apply-progress.md` and record initial readiness, decisions, skills, and handoff boundaries.

## 2. Data Layer

- [x] 2.1 Add vehicle domain types, filter DTOs, URL converters, enum metadata, and sanitation helpers.
- [x] 2.2 Add shared vehicle Zod schemas for create/edit validation and server boundary normalization.
- [x] 2.3 Add deterministic vehicle seeds and process-local resettable mock store.
- [x] 2.4 Add vehicle services for list/query, detail, create, edit, delete, and status change with duplicate and missing-record handling.
- [x] 2.5 Add server actions and client hooks for vehicle create, edit, detail, delete, and status change.
- [x] 2.6 Add focused vehicle behavior tests for validation, URL sanitation, query behavior, CRUD mutations, duplicates, missing records, status changes, and reset semantics.

## 3. UI and Localization

- [x] 3.1 Add `/{locale}/vehicles` route, metadata, `VehiclesContent`, and SSR filter handoff.
- [x] 3.2 Add vehicles path helper and Catalog sidebar navigation with a fleet-related Lucide icon.
- [x] 3.3 Add localized English and Spanish namespaces for vehicles, filters, forms, details, delete, status, actions, errors, and notifications.
- [x] 3.4 Add vehicle filters with URL-synchronized search, status/type selects, sorting, and pagination controls.
- [x] 3.5 Add responsive vehicle list table and mobile cards with view, edit, status-change, and delete actions.
- [x] 3.6 Add create and edit vehicle modal forms using existing RHF components and shared schemas.
- [x] 3.7 Add vehicle detail, delete confirmation, and status-change modal containers.

## 4. Integration and Verification

- [x] 4.1 Run focused fast feedback for the vehicle implementation and fix failures.
- [x] 4.2 Run `openspec validate add-vehicle-management --strict`.
- [x] 4.3 Run `pnpm verify` and fix any failures without weakening gates.
- [x] 4.4 Reconcile `tasks.md` and `apply-progress.md` so completed implementation and verification evidence match.

## 5. Reference Pattern Corrections

- [x] 5.1 Correct supplier filters to match `.agent/reference/widget`: `FilterCard`, active filter chips, reset behavior, active-count memo, and `handleChangeFilters` prop shape.
- [x] 5.2 Correct vehicle filters to match `.agent/reference/widget`: `FilterCard`, active filter chips, reset behavior, active-count memo, and `handleChangeFilters` prop shape.
- [x] 5.3 Correct supplier and vehicle list presentational components to use module-specific reexports of the generic view/edit/delete list-action hooks.
- [x] 5.4 Rerun final verification, refresh PASS evidence, and restore strict archive readiness after the correction.
