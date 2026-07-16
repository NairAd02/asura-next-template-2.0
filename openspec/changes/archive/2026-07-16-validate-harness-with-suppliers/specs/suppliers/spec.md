## ADDED Requirements

### Requirement: Supplier Domain and Validation

The system SHALL represent a supplier with identity, name, optional contact name, required email, optional phone, active state, and creation/update audit data, and SHALL validate create and edit inputs at both client and server boundaries.

#### Scenario: Valid supplier is created

- **WHEN** a user submits a trimmed 2–120 character unique name, valid email, optional contact/phone, and an optional active value
- **THEN** the system SHALL create a supplier with generated identity and audit timestamps
- **AND** active SHALL default to true when omitted
- **AND** email SHALL be normalized for storage.

#### Scenario: Invalid input reaches server boundary

- **WHEN** a create or edit action receives an invalid name, email, contact name, phone, or field type
- **THEN** it SHALL return `VALIDATION_ERROR`
- **AND** it SHALL NOT mutate supplier state.

#### Scenario: Duplicate name differs only by case

- **GIVEN** an existing supplier has a normalized name
- **WHEN** create or edit submits the same name with different casing or surrounding whitespace
- **THEN** the operation SHALL return `ALREADY_EXISTS`
- **AND** edit SHALL exclude its own record from duplicate comparison.

### Requirement: Process-Local Supplier CRUD

The system SHALL seed 12 deterministic suppliers and SHALL support detail, create, edit, physical delete, and active-state toggle operations in mutable state scoped to the running server process.

#### Scenario: Supplier detail exists

- **WHEN** detail is requested for an existing supplier ID
- **THEN** the system SHALL return `ServiceResponse<SupplierDetails>` success with all domain and audit fields.

#### Scenario: Supplier does not exist

- **WHEN** detail, edit, delete, or toggle targets an unknown supplier ID
- **THEN** the system SHALL return failure code `NOT_FOUND`
- **AND** it SHALL never return successful nullable detail data.

#### Scenario: Supplier is edited or toggled

- **WHEN** a valid edit or active-state toggle succeeds
- **THEN** the existing supplier SHALL be updated in place
- **AND** update audit fields SHALL reflect the mutation.

#### Scenario: Supplier is physically deleted

- **WHEN** delete succeeds for an existing supplier
- **THEN** the supplier SHALL be removed from the process-local collection.

#### Scenario: Mutation survives refresh

- **WHEN** a successful mutation is followed by a browser refresh while the same server process remains alive
- **THEN** the mutated state SHALL remain observable.

#### Scenario: Server process restarts

- **WHEN** the application server process is stopped and started again
- **THEN** supplier state SHALL return to the 12 deterministic seeds
- **AND** the UI SHALL make no claim of durable persistence.

### Requirement: Supplier Query and URL State

The suppliers list SHALL sanitize URL filters and return server-rendered paginated results searchable by name, contact name, email, or phone; filterable by active state; and sortable by name or creation date.

#### Scenario: Explicit inactive filter is shared

- **WHEN** the URL contains `isActive=false`
- **THEN** only inactive suppliers SHALL be returned
- **AND** refresh SHALL preserve the inactive filter and URL value.

#### Scenario: Search matches supported contact fields

- **WHEN** search text matches a supplier name, contact name, email, or phone case-insensitively
- **THEN** that supplier SHALL be included in the filtered result.

#### Scenario: Query parameters are sanitized

- **WHEN** page, limit, sortBy, sortOrder, or isActive contains an unsupported value
- **THEN** the system SHALL use safe canonical defaults
- **AND** valid values SHALL preserve page, limits 5/10/20/30, sort fields name/createdAt, sort direction, and explicit booleans.

#### Scenario: Second seeded page is requested

- **WHEN** the list uses a limit smaller than the 12 seeded records and page 2 is requested
- **THEN** the response SHALL contain the corresponding second-page rows and accurate pagination metadata.

#### Scenario: Deletion invalidates the current page

- **WHEN** a supplier is deleted from a filtered or later-page view
- **THEN** the client SHALL navigate safely to page 1 before refreshing results.

### Requirement: Localized Responsive Supplier Experience

The application SHALL expose an independently navigable localized suppliers screen with Catalog sidebar navigation, metadata, responsive list views, empty state, and modal create/edit/detail/delete/toggle flows.

#### Scenario: Supplier route is entered directly

- **WHEN** a user opens `/en/suppliers` or `/es/suppliers` without an authentication session
- **THEN** the suppliers page SHALL render because the `(protected)` group is organizational rather than an authentication guarantee.

#### Scenario: Catalog navigation is rendered

- **WHEN** the application sidebar is displayed
- **THEN** Catalog SHALL include a localized Suppliers link using the `Truck` icon and `paths.suppliers`.

#### Scenario: Desktop and mobile lists render

- **WHEN** the viewport is desktop width
- **THEN** suppliers SHALL render in a complete action-enabled table
- **AND WHEN** the viewport is mobile width
- **THEN** suppliers SHALL render as complete action-enabled cards.

#### Scenario: Supplier forms display localized validation

- **WHEN** create or edit input is invalid in English or Spanish
- **THEN** validation text, labels, actions, notifications, detail text, and errors SHALL use the active locale namespaces.

#### Scenario: Filter returns no suppliers

- **WHEN** valid filters produce zero results
- **THEN** the localized empty state SHALL render without breaking pagination or available create flow.

### Requirement: Harness Pilot Evidence

The change SHALL be executed through sequential curator, architect, data, UI, and verifier ownership and SHALL produce browser plus four-gate PASS evidence before native archive.

#### Scenario: Pilot is ready to archive

- **WHEN** every implementable/browser task is complete
- **THEN** cumulative handoffs SHALL be reconciled in progress
- **AND** browser evidence SHALL cover English and Spanish at desktop and mobile widths
- **AND** the four repository gates SHALL pass
- **AND** strict readiness SHALL validate a fresh SHA-256 snapshot before native archive.
