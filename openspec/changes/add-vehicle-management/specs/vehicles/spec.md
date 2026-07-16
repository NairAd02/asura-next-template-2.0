## ADDED Requirements

### Requirement: Vehicle Domain and Validation

The system SHALL represent a company vehicle with fleet identity, registration
data, classification, assignment, operational status, maintenance indicators,
and audit fields, and SHALL validate create and edit inputs at both client and
server boundaries.

#### Scenario: Valid vehicle is created

- **WHEN** a user submits a unique plate, unique VIN, make, model, year, type,
  status, assigned branch, non-negative odometer, and optional assignment,
  maintenance, inspection, or notes fields
- **THEN** the system SHALL create a vehicle with generated identity and audit
  timestamps
- **AND** plate and VIN SHALL be uppercase-normalized for storage and duplicate
  comparison.

#### Scenario: Invalid input reaches server boundary

- **WHEN** a create or edit action receives missing required fields, invalid
  field types, an unsupported type or status, an unrealistic year, a negative
  odometer, or invalid date strings
- **THEN** it SHALL return `VALIDATION_ERROR`
- **AND** it SHALL NOT mutate vehicle state.

#### Scenario: Duplicate plate or VIN differs only by case

- **GIVEN** an existing vehicle has normalized registration identifiers
- **WHEN** create or edit submits the same plate or VIN with different casing or
  surrounding whitespace
- **THEN** the operation SHALL return `ALREADY_EXISTS`
- **AND** edit SHALL exclude its own record from duplicate comparison.

### Requirement: Process-Local Vehicle CRUD

The system SHALL seed deterministic vehicles and SHALL support detail, create,
edit, physical delete, and status-change operations in mutable state scoped to
the running server process.

#### Scenario: Vehicle detail exists

- **WHEN** detail is requested for an existing vehicle ID
- **THEN** the system SHALL return `ServiceResponse<VehicleDetails>` success
  with all domain and audit fields.

#### Scenario: Vehicle does not exist

- **WHEN** detail, edit, delete, or status change targets an unknown vehicle ID
- **THEN** the system SHALL return failure code `NOT_FOUND`
- **AND** it SHALL never return successful nullable detail data.

#### Scenario: Vehicle is edited or status is changed

- **WHEN** a valid edit or status change succeeds
- **THEN** the existing vehicle SHALL be updated in place
- **AND** update audit fields SHALL reflect the mutation.

#### Scenario: Vehicle is physically deleted

- **WHEN** delete succeeds for an existing vehicle
- **THEN** the vehicle SHALL be removed from the process-local collection.

#### Scenario: Mutation survives refresh

- **WHEN** a successful mutation is followed by a browser refresh while the same
  server process remains alive
- **THEN** the mutated vehicle state SHALL remain observable.

#### Scenario: Server process restarts

- **WHEN** the application server process is stopped and started again
- **THEN** vehicle state SHALL return to the deterministic seeds
- **AND** the UI SHALL make no claim of durable persistence.

### Requirement: Vehicle Query and URL State

The vehicles list SHALL sanitize URL filters and return server-rendered
paginated results searchable by plate, VIN, make, model, assigned driver, or
branch; filterable by operational status and vehicle type; and sortable by
approved vehicle fields.

#### Scenario: Status filter is shared

- **WHEN** the URL contains a supported vehicle status
- **THEN** only vehicles with that status SHALL be returned
- **AND** refresh SHALL preserve the status filter and URL value.

#### Scenario: Search matches supported vehicle fields

- **WHEN** search text matches a vehicle plate, VIN, make, model, assigned
  driver, or branch case-insensitively
- **THEN** that vehicle SHALL be included in the filtered result.

#### Scenario: Query parameters are sanitized

- **WHEN** page, limit, sortBy, sortOrder, status, or type contains an
  unsupported value
- **THEN** the system SHALL use safe canonical defaults
- **AND** valid values SHALL preserve page, limits 5/10/20/30, approved sort
  fields, sort direction, status, and type.

#### Scenario: Second seeded page is requested

- **WHEN** the list uses a limit smaller than the seeded vehicle count and page
  2 is requested
- **THEN** the response SHALL contain the corresponding second-page rows and
  accurate pagination metadata.

#### Scenario: Deletion invalidates the current page

- **WHEN** a vehicle is deleted from a filtered or later-page view
- **THEN** the client SHALL navigate safely to page 1 before refreshing results.

### Requirement: Localized Responsive Vehicle Experience

The application SHALL expose an independently navigable localized vehicles
screen with Catalog sidebar navigation, metadata, responsive list views, empty
state, and modal create, edit, detail, delete, and status-change flows.

#### Scenario: Vehicle route is entered directly

- **WHEN** a user opens `/en/vehicles` or `/es/vehicles` without an
  authentication session
- **THEN** the vehicles page SHALL render because the `(protected)` group is
  organizational rather than an authentication guarantee.

#### Scenario: Catalog navigation is rendered

- **WHEN** the application sidebar is displayed
- **THEN** Catalog SHALL include a localized Vehicles link using a fleet-related
  Lucide icon and `paths.vehicles`.

#### Scenario: Desktop and mobile lists render

- **WHEN** the viewport is desktop width
- **THEN** vehicles SHALL render in a complete action-enabled table
- **AND WHEN** the viewport is mobile width
- **THEN** vehicles SHALL render as complete action-enabled cards.

#### Scenario: Vehicle forms display localized validation

- **WHEN** create or edit input is invalid in English or Spanish
- **THEN** validation text, labels, actions, notifications, detail text, and
  errors SHALL use the active locale namespaces.

#### Scenario: Filter returns no vehicles

- **WHEN** valid filters produce zero results
- **THEN** the localized empty state SHALL render without breaking pagination or
  the available create flow.

### Requirement: Focused Vehicle Verification Evidence

The vehicles capability SHALL include focused Vitest evidence for deterministic
data, URL, validation, and component-facing behavior as its accepted
verification contract.

#### Scenario: Deterministic vehicle behavior is verified

- **WHEN** vehicle unit and component tests run
- **THEN** they SHALL cover input schemas and server validation, URL sanitation,
  search, status/type filters, sorting, limits, second-page data, out-of-range
  page clamping, normalized CRUD, duplicate plate/VIN handling, missing records,
  status changes, and deterministic seed reset.

#### Scenario: Vehicle change is ready to archive

- **WHEN** every implementation and focused verification task is complete
- **THEN** cumulative handoffs SHALL be reconciled in progress
- **AND** `pnpm verify` SHALL pass below 15 minutes on the current machine
- **AND** strict readiness SHALL validate a fresh SHA-256 snapshot before native
  archive.
