## MODIFIED Requirements

### Requirement: Harness Pilot Evidence

The suppliers capability SHALL retain focused Vitest evidence for deterministic data, URL, validation, and component behavior as its accepted verification contract.

#### Scenario: Deterministic supplier behavior is verified

- **WHEN** supplier unit and component tests run
- **THEN** they SHALL cover input schemas and server validation, explicit `false`, URL sanitation, search, sorting, limits, second-page data, out-of-range page clamping, normalized CRUD, duplicate names, missing records, deterministic seed reset, and `DataTable` visibility stability
- **AND** they SHALL fail if the original pagination or maximum-update-depth regression is reintroduced.

#### Scenario: Short supplier browser smoke runs

- **WHEN** an operator optionally opens the suppliers route for exploratory diagnosis
- **THEN** that inspection SHALL remain outside supplier verification tasks, `verify-report.md`, PASS criteria, snapshot invalidation, and archive readiness
- **AND** an observed deterministic supplier regression SHALL be covered by a focused automated test in a subsequent iteration.

#### Scenario: Pilot is ready to archive

- **WHEN** every implementation and focused verification task is complete
- **THEN** cumulative handoffs SHALL be reconciled in progress
- **AND** `pnpm verify` SHALL pass below 15 minutes on the current machine
- **AND** strict readiness SHALL validate a fresh SHA-256 snapshot before native archive.
