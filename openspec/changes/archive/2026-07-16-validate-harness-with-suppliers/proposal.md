## Why

The hardened SDD harness needs an end-to-end product change to prove that its requirement, planning, specialized handoff, implementation, browser verification, and archive controls work together on realistic behavior. REQ-004 defines a bounded suppliers CRUD that exercises the template's data, SSR, URL-state, responsive UI, form, modal, and i18n patterns without introducing infrastructure or dependency noise.

Driving requirement: `docs/requirements/validate-harness-with-suppliers/brief.md` (REQ-004).

## What Changes

- Add an independent `suppliers` module with 12 deterministic process-local mock records, list/detail/create/edit/physical-delete operations, and active-state toggling.
- Enforce shared client/server validation for supplier names, email, optional contact fields, and case-insensitive name uniqueness with the agreed service error contract.
- Add server-rendered, URL-synchronized search, status, sorting, pagination, sanitization, desktop-table, mobile-card, and empty-state behavior.
- Add localized `/[locale]/suppliers` navigation, metadata, Catalog sidebar entry, modal flows, and complete English/Spanish messages.
- Validate the full flow through sequential curator, architect, data, UI, and verifier handoffs, integrated-browser scenarios, and the repository's four verification gates.
- Document process-local persistence as an intentional limitation: mutations survive refresh in one server process and reset to the seeds after restart.

## Capabilities

### New Capabilities

- `suppliers`: Supplier catalog management, including validated mock CRUD, query behavior, responsive localized interaction flows, and the persistence limitation defined by REQ-004.

### Modified Capabilities

None. The existing workflow and template-quality contracts remain unchanged; this change consumes them as a validation pilot.

## Impact

- **Application:** new `modules/suppliers/**` implementation and `app/[locale]/(protected)/suppliers/page.tsx` route.
- **Shared integration:** locale-aware paths, Catalog sidebar navigation with the `Truck` icon, metadata, shared detail loading, and EN/ES message catalogs.
- **Data/runtime:** mutable in-memory supplier state scoped to the running server process; no database, API route, or durable storage.
- **Dependencies:** only existing Next.js, React, Zod, React Hook Form, next-intl, TanStack Table, Sonner, shadcn/ui, Radix, and Lucide facilities; no package additions.
- **Compatibility:** no breaking API or route changes and no modifications to the `items` module.

## Success Criteria

- All REQ-004 list, URL sanitization, CRUD, duplicate, missing-record, responsive, localization, refresh-persistence, and restart-reset scenarios are demonstrable in the integrated browser.
- English and Spanish flows work at desktop and mobile viewports, including explicit `isActive=false`, page 2 with seeded data, and safe page recovery after deletion.
- Specialized ownership remains sequential, with the data executor confined to the suppliers data boundary and the UI executor owning routes and messages.
- OpenSpec validation, harness validation, non-incremental app and reference typechecks, app and reference lint, and the production build pass before archive.

## Non-Goals

- Database or other durable persistence, API routes, supplier relations, authorization, or treating the `(protected)` route group as authentication.
- Bulk actions, reporting, imports/exports, changes to `items`, or a reusable abstraction beyond existing shared components.
- Vitest, Playwright, a new browser framework, or any new dependency.

## Dependencies and Open Questions

- The change depends on the hardened harness, existing shared module primitives, the validated widget reference, and the exact global OpenSpec 1.6.0 prerequisite.
- UI is the sole owner of application routes and message files to avoid cross-phase conflicts.
- Open questions: none; scope, behavior, and the persistence limitation are approved in REQ-004.

## Rollback Strategy

Revert the new suppliers route and module plus the isolated path, sidebar, metadata, detail-wrapper, and locale-message additions. Because the feature has no durable data, API, schema migration, or dependency change, rollback leaves no external state to migrate or recover.
