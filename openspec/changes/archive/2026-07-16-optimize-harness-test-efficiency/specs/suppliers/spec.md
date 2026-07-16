## MODIFIED Requirements

### Requirement: Harness Pilot Evidence

The suppliers capability SHALL retain focused Vitest evidence for deterministic data, URL, validation, and component behavior plus a short integrated-browser smoke for localized responsive composition.

#### Scenario: Deterministic supplier behavior is verified

- **WHEN** supplier unit and component tests run
- **THEN** they SHALL cover input schemas and server validation, explicit `false`, URL sanitation, search, sorting, limits, second-page data, out-of-range page clamping, normalized CRUD, duplicate names, missing records, deterministic seed reset, and `DataTable` visibility stability
- **AND** they SHALL fail if the original pagination or maximum-update-depth regression is reintroduced.

#### Scenario: Short supplier browser smoke runs

- **WHEN** `pnpm verify` has passed and the verifier opens the integrated browser
- **THEN** the smoke SHALL verify EN desktop render/filter persistence and one create-view-delete flow
- **AND** it SHALL verify ES labels/required validation plus mobile card visibility and one detail action
- **AND** it SHALL NOT repeat the exhaustive locale/viewport CRUD matrix from the original pilot.

#### Scenario: Pilot is ready to archive

- **WHEN** every implementation and focused verification task is complete
- **THEN** cumulative handoffs SHALL be reconciled in progress
- **AND** `pnpm verify` SHALL pass below 15 minutes on the current machine
- **AND** the short integrated-browser smoke SHALL pass
- **AND** strict readiness SHALL validate a fresh SHA-256 snapshot before native archive.
