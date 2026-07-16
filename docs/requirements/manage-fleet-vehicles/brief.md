# Requirement Brief: Manage Fleet Vehicles

> **ID:** REQ-006  
> **Status:** implemented  
> **Priority:** high  
> **Source:** `docs/project-context.md#client-pilot-fleet-vehicle-management`  
> **OpenSpec change:** `archive/2026-07-16-add-vehicle-management`

## Intent

Deliver a realistic fleet vehicle administration module in the admin panel so a
company operator can manage mock vehicle inventory end to end while exercising
the project harness against the `.agent/reference/widget` implementation
pattern.

## Actors

- Admin operator managing company vehicles
- Human operator validating the harness
- Requirements curator, architect, data executor, UI executor, and verifier

## Scope

- Add an independent `vehicles` module without changing suppliers, items, users,
  or authentication behavior.
- Model fleet identity, plate/VIN, vehicle classification, assignment,
  operational status, mileage, inspection and maintenance dates, notes, and
  audit fields.
- Provide deterministic mock seeds and process-local mutable CRUD state that
  survives refreshes while the server process remains alive and resets after
  restart.
- Implement list, create, detail, edit, physical delete, and status-change
  flows.
- Provide URL-synchronized search, status/type filters, sorting, pagination,
  parameter sanitization, desktop table, mobile cards, and empty state.
- Add a localized `/{locale}/vehicles` route, Catalog sidebar entry, metadata,
  paths helper, and complete EN/ES namespaces.
- Validate deterministic data, URL, validation, and component behavior through
  focused automated tests and repository verification.

## Out of Scope

- Database, external APIs, durable persistence, real authentication, real
  authorization, GPS tracking, telematics, files, reports, imports, exports, or
  fleet cost accounting.
- Bulk actions unless already trivial through an existing shared pattern.
- Changing accepted suppliers business behavior or accepted specs. Correcting
  supplier client implementation drift from the shared `.agent/reference/widget`
  pattern is allowed when it preserves the supplier domain contract.

## Candidate Flows

### Browse and filter

1. The operator navigates directly or through Catalog > Vehicles.
2. The server renders sanitized URL state and paginated mock vehicle results.
3. The operator searches by plate, VIN, make, model, assigned driver, or branch.
4. The operator filters by operational status and vehicle type, sorts, changes
   page size, or navigates pages.
5. Refresh preserves the same URL-backed view.

### Create and detect duplicates

1. The operator opens the create modal.
2. Client validation displays localized required, format, numeric, and date
   messages.
3. The server boundary validates again and rejects duplicate plate or VIN values.
4. A valid vehicle is added to process-local state and appears after refresh.

### Inspect, edit, status change, and delete

1. Row or card actions open detail, edit, status-change, or delete modals.
2. Missing records return `NOT_FOUND` rather than nullable success.
3. Edits and status changes update audit state and survive refresh in the same
   process.
4. Physical delete removes the record and returns to a safe list page.

## Rules and Constraints

- Plate and VIN are required, trimmed, uppercase-normalized, and unique
  case-insensitively.
- Make, model, year, vehicle type, operational status, odometer reading, and
  assigned branch are required.
- Year must be realistic for a current fleet vehicle, and odometer must be a
  non-negative integer.
- License plate format should allow common company fleet formats without
  country-specific enforcement.
- Inspection and next maintenance dates are optional but must be valid dates
  when provided.
- Create and edit inputs are validated at both client and server boundaries.
- Filters are shareable and persist through refresh because the URL is the state
  authority.
- Fallible detail and mutation responses use the project's existing API response
  codes and patterns.
- Visible text must be localized in English and Spanish.

## Dependencies

- `.agent/reference/widget` as the reusable implementation pattern.
- REQ-004 accepted suppliers CRUD pilot as a domain precedent only where its
  implementation matches the shared reference pattern.
- Existing shared table, modal, form, filter, pagination, sidebar, toast, and
  localization conventions.
- Process-local mock store helpers.

## Open Questions

- None blocking. Vehicle attributes are intentionally delegated to the
  implementer within the fleet-inventory constraints above.

## Suggested OpenSpec Change

- **Change ID:** `archive/2026-07-16-add-vehicle-management`
- **Affected domain/spec:** `vehicles`
- **Notes for proposal/spec/design/tasks:** Reuse the `.agent/reference/widget`
  module structure while giving vehicles an independent domain contract,
  localized navigation, deterministic mock data, URL-backed list state, modal
  CRUD/status workflows, and focused automated behavior tests.
