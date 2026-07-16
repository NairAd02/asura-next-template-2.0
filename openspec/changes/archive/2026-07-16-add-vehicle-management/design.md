## Context

REQ-006 introduces a simulated fleet vehicle CRUD module for the admin panel.
The project-level implementation reference is `.agent/reference/widget`, which
defines the expected filters, list hooks, modal orchestration, and client view
shape. Suppliers remains the accepted domain precedent for process-local mock
data and CRUD behavior, but it is not the code-pattern authority when it drifts
from `.agent/reference/widget`.

The change runs in a Next.js App Router template with no real authentication
guarantee in the `(protected)` route group. Persistence remains process-local:
mutations survive refreshes in the same running server process and reset after
restart.

## Goals / Non-Goals

**Goals:**

- Add a complete `vehicles` module with list, filters, create, detail, edit,
  delete, and status-change workflows.
- Use deterministic mock seeds and the existing in-memory store/query helpers.
- Keep the URL as the list state authority for search, status/type filters,
  sorting, page, and limit.
- Localize all visible text in English and Spanish.
- Add focused automated coverage for deterministic validation, URL, query, and
  mutation behavior.
- Preserve suppliers business behavior and accepted specs while correcting any
  client implementation drift from the shared `.agent/reference/widget` pattern.

**Non-Goals:**

- No database, durable persistence, API routes, real authz/authn, GPS,
  telematics, files, reports, imports, exports, or new dependencies.
- No bulk operations for vehicles in this change.
- No browser-smoke requirement in final PASS evidence; deterministic behavior
  belongs in Vitest.

## Decisions

### Mirror the `.agent/reference/widget` module structure

Vehicles will use `modules/vehicles/**` with `vehicles-content.tsx`, list,
filters, form, details, delete, status, and `lib` subfolders for actions,
services, hooks, mock data, schemas, and types. Filters will use `FilterCard`,
active-filter chips, reset behavior, URL-backed state, and `handleChangeFilters`
props. List presentational components will reexport and use the generic
view/edit/delete list-action hooks with module-specific aliases.

Alternative considered: build a smaller one-file demo. That would exercise less
of the harness and diverge from the reference module the user asked us to follow.

### Use an independent fleet domain contract

`Vehicle` will include `id`, `plate`, `vin`, `make`, `model`, `year`,
`type`, `status`, `assignedDriver`, `branch`, `odometer`, optional inspection
and maintenance dates, optional notes, and audit fields. Plate and VIN are
uppercase-normalized, required, and unique case-insensitively.

Alternative considered: copy supplier fields with different labels. A real
fleet module needs inventory identifiers, operational status, and maintenance
signals to feel like a useful management surface.

### Keep mutations process-local

The service layer will seed deterministic vehicle records and mutate a
module-local in-memory collection, matching suppliers. Tests may use a reset
helper through module imports only; no test-only route is added.

Alternative considered: persist to browser storage or a JSON file. That would
confuse server/client ownership or introduce persistence outside the mock-only
scope.

### Make URL filters explicit and shareable

Vehicle filters will sanitize `search`, `status`, `type`, `page`, `limit`,
`sortBy`, and `sortOrder`. Search will match plate, VIN, make, model, assigned
driver, and branch. Sorting will support plate, status, year, odometer, and
creation date.

Alternative considered: client-only filtering. The existing module pattern uses
SSR with sanitized URL state, and preserving that contract gives refreshable
views and better harness coverage.

### Split roles by ownership

The data executor owns domain types, schemas, mock store, services, actions,
hooks, and focused data tests. The UI executor owns route, navigation, messages,
content, list, filters, forms, details, delete/status containers, and UI-facing
integration. The verifier owns final gates and evidence only.

Alternative considered: one broad executor. The harness requires bounded
handoffs, and the data/UI split reduces conflicts.

## Risks / Trade-offs

- [Mock state resets after restart] -> Document the limitation in behavior and
  avoid UI claims of durable persistence.
- [Vehicle VIN validation can become country/manufacturer specific] -> Enforce
  a practical 6-17 uppercase alphanumeric/hyphen identifier instead of decoding
  real VIN standards.
- [Dates can be locale-sensitive] -> Store date strings as ISO `yyyy-MM-dd` and
  render via existing localized date utilities where applicable.
- [A module cloned from a drifted implementation can repeat old mistakes] ->
  Treat `.agent/reference/widget` as the code-pattern authority and use
  suppliers only as a domain precedent where it matches that reference.

## Migration Plan

1. Create the `vehicles` OpenSpec capability and implementation module.
2. Add route, navigation, path helper, and localization entries.
3. Add deterministic vehicle tests and run fast feedback during implementation.
4. Run final `pnpm verify`, persist PASS evidence, and prepare archive readiness.

Rollback removes the additive vehicle route, module, messages, tests, and spec
delta. No data migration is required.

## Open Questions

None blocking. REQ-006 intentionally delegates the exact vehicle attributes to
implementation within the documented fleet-inventory constraints.
