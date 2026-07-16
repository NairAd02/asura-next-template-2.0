## ADDED Requirements

### Requirement: Task Domain and Validation

The system SHALL represent a task with identity, title, optional description,
status, priority, optional due date, and audit timestamps, and SHALL validate
create and edit inputs at both client and server boundaries.

#### Scenario: Valid task is created

- **WHEN** a user submits a unique title, optional description, supported
  status, supported priority, and optional valid due date
- **THEN** the system SHALL create a task with generated identity and audit
  timestamps
- **AND** title SHALL be trimmed for storage and duplicate comparison.

#### Scenario: Defaults are applied during create

- **WHEN** a create request omits status or priority
- **THEN** the system SHALL create the task with `todo` status and `medium`
  priority.

#### Scenario: Invalid input reaches server boundary

- **WHEN** a create or edit action receives a missing title, title outside
  2-120 characters, unsupported status, unsupported priority, invalid due date,
  or invalid field type
- **THEN** it SHALL return `VALIDATION_ERROR`
- **AND** it SHALL NOT mutate task state.

#### Scenario: Duplicate title differs only by case

- **GIVEN** an existing task has a normalized title
- **WHEN** create or edit submits the same title with different casing or
  surrounding whitespace
- **THEN** the operation SHALL return `ALREADY_EXISTS`
- **AND** edit SHALL exclude its own record from duplicate comparison.

### Requirement: Process-Local Task CRUD

The system SHALL seed deterministic tasks and SHALL support detail, create,
edit, physical delete, and status-change operations in mutable state scoped to
the running server process.

#### Scenario: Task detail exists

- **WHEN** detail is requested for an existing task ID
- **THEN** the system SHALL return `ServiceResponse<TaskDetails>` success with
  all domain and audit fields.

#### Scenario: Task does not exist

- **WHEN** detail, edit, delete, or status change targets an unknown task ID
- **THEN** the system SHALL return failure code `NOT_FOUND`
- **AND** it SHALL never return successful nullable detail data.

#### Scenario: Task is edited or status is changed

- **WHEN** a valid edit or status change succeeds
- **THEN** the existing task SHALL be updated in place
- **AND** update audit fields SHALL reflect the mutation.

#### Scenario: Task is physically deleted

- **WHEN** delete succeeds for an existing task
- **THEN** the task SHALL be removed from the process-local collection.

#### Scenario: Mutation survives refresh

- **WHEN** a successful mutation is followed by a browser refresh while the same
  server process remains alive
- **THEN** the mutated task state SHALL remain observable.

#### Scenario: Server process restarts

- **WHEN** the application server process is stopped and started again
- **THEN** task state SHALL return to the deterministic seeds
- **AND** the UI SHALL make no claim of durable persistence.

### Requirement: Task Query and URL State

The tasks list SHALL sanitize URL filters and return server-rendered paginated
results searchable by title or description, filterable by status and priority,
and sortable by approved task fields.

#### Scenario: Status filter is shared

- **WHEN** the URL contains a supported task status
- **THEN** only tasks with that status SHALL be returned
- **AND** refresh SHALL preserve the status filter and URL value.

#### Scenario: Priority filter is shared

- **WHEN** the URL contains a supported task priority
- **THEN** only tasks with that priority SHALL be returned
- **AND** refresh SHALL preserve the priority filter and URL value.

#### Scenario: Search matches supported task fields

- **WHEN** search text matches a task title or description case-insensitively
- **THEN** that task SHALL be included in the filtered result.

#### Scenario: Query parameters are sanitized

- **WHEN** page, limit, sortBy, sortOrder, status, or priority contains an
  unsupported value
- **THEN** the system SHALL use safe canonical defaults
- **AND** valid values SHALL preserve page, limits 5/10/20/30, approved sort
  fields, sort direction, status, and priority.

#### Scenario: Second seeded page is requested

- **WHEN** the list uses a limit smaller than the seeded task count and page 2
  is requested
- **THEN** the response SHALL contain the corresponding second-page rows and
  accurate pagination metadata.

#### Scenario: Deletion invalidates the current page

- **WHEN** a task is deleted from a filtered or later-page view
- **THEN** the client SHALL navigate safely to page 1 before refreshing results.

### Requirement: Localized Responsive Task Experience

The application SHALL expose an independently navigable localized tasks screen
with Catalog sidebar navigation, metadata, responsive list views, empty state,
and modal create, edit, detail, delete, and status-change flows.

#### Scenario: Task route is entered directly

- **WHEN** a user opens `/en/tasks` or `/es/tasks` without an authentication
  session
- **THEN** the tasks page SHALL render because the `(protected)` group is
  organizational rather than an authentication guarantee.

#### Scenario: Catalog navigation is rendered

- **WHEN** the application sidebar is displayed
- **THEN** Catalog SHALL include a localized Tasks link using a task-related
  Lucide icon and `paths.tasks`.

#### Scenario: Desktop and mobile lists render

- **WHEN** the viewport is desktop width
- **THEN** tasks SHALL render in a complete action-enabled table
- **AND WHEN** the viewport is mobile width
- **THEN** tasks SHALL render as complete action-enabled cards.

#### Scenario: Task forms display localized validation

- **WHEN** create or edit input is invalid in English or Spanish
- **THEN** validation text, labels, actions, notifications, detail text, and
  errors SHALL use the active locale namespaces.

#### Scenario: Filter returns no tasks

- **WHEN** valid filters produce zero results
- **THEN** the localized empty state SHALL render without breaking pagination or
  the available create flow.

### Requirement: Focused Task Verification Evidence

The tasks capability SHALL include focused Vitest evidence for deterministic
data, URL, validation, and component-facing behavior as its accepted
verification contract.

#### Scenario: Deterministic task behavior is verified

- **WHEN** task unit and component tests run
- **THEN** they SHALL cover input schemas and server validation, URL sanitation,
  search, status/priority filters, sorting, limits, second-page data,
  out-of-range page clamping, normalized CRUD, duplicate title handling,
  missing records, status changes, and deterministic seed reset.

#### Scenario: Task change is ready to archive

- **WHEN** every implementation and focused verification task is complete
- **THEN** cumulative handoffs SHALL be reconciled in progress
- **AND** `pnpm verify` SHALL pass below 15 minutes on the current machine
- **AND** strict readiness SHALL validate a fresh SHA-256 snapshot before native
  archive.
