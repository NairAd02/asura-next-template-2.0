## Why

REQ-006 asks for a realistic, mock-backed vehicle management module in the
admin panel to continue validating the harness beyond the accepted suppliers
CRUD pilot. The change gives operators a complete fleet inventory workflow while
keeping persistence, authentication, and integrations out of scope.

## What Changes

- Add a localized `vehicles` admin module with independent route, sidebar entry,
  metadata, list, filters, pagination, responsive table/cards, empty state, and
  modal create/detail/edit/delete/status workflows.
- Add a process-local vehicle data layer with deterministic seeds, validation,
  duplicate detection, URL filter sanitation, sorting, pagination, and
  mutation helpers.
- Add English and Spanish messages for vehicle navigation, filters, forms,
  details, confirmation dialogs, actions, statuses, and notifications.
- Add focused automated behavior coverage for vehicle schemas, server
  validation, URL state, query behavior, CRUD mutations, duplicate handling,
  missing records, and store reset semantics.
- Use `.agent/reference/widget` as the code-pattern reference, and realign the
  existing suppliers implementation where it drifted from that pattern without
  changing accepted suppliers business requirements.

## Capabilities

### New Capabilities

- `vehicles`: Defines the vehicle domain contract, mock CRUD state, URL-backed
  querying, localized responsive admin experience, and focused verification
  evidence for the fleet vehicle management module.

### Modified Capabilities

- Supplier implementation alignment only: filters/list client structure is
  corrected to the shared reference pattern without changing supplier domain
  behavior.

## Impact

- **Requirement brief:** `docs/requirements/manage-fleet-vehicles/brief.md`.
- **Application routes/navigation:** add `/{locale}/vehicles`, `paths.vehicles`,
  and a Catalog sidebar entry.
- **Application modules:** add `modules/vehicles/**` following the
  `.agent/reference/widget` module structure and align suppliers where it
  diverged from that shared pattern.
- **Localization:** update `messages/en.json` and `messages/es.json`.
- **Tests:** add focused Vitest coverage under the vehicles module.
- **Dependencies/systems:** no new package dependency, API route, database,
  authentication, authorization, external service, import, export, or reporting
  system is introduced.

## Success Criteria

- Operators can browse, search, filter, sort, paginate, create, inspect, edit,
  delete, and change status for mock vehicles in English and Spanish.
- Vehicle mutations survive refreshes in the same server process and reset to
  deterministic seeds after restart.
- Invalid inputs and duplicate plate/VIN values fail consistently at client and
  server boundaries.
- `pnpm verify` passes with focused vehicle behavior tests included.

## Rollback

Remove the `vehicles` route, module, navigation path/sidebar entry, localization
namespaces, tests, and OpenSpec `vehicles` capability before archive. No data
migration or dependency rollback is required because the change is mock-only and
adds no external integration.
