# Requirement Brief: Validate the Harness with Suppliers

> **ID:** REQ-004  
> **Status:** implemented  
> **Priority:** high  
> **Source:** user-approved harness validation plan (2026-07-15)  
> **OpenSpec change:** `archive/2026-07-16-validate-harness-with-suppliers`
> **Implemented:** 2026-07-16; browser PASS, `pnpm verify` PASS, and native OpenSpec archive completed.

## Intent

Validate the hardened `docs -> OpenSpec -> .agent -> implementation -> verification -> archive` workflow by delivering a complete, independently navigable suppliers CRUD whose behavior can be exercised in English and Spanish on desktop and mobile without adding persistence or test dependencies.

## Actors

- Catalog operator using the suppliers screen
- Human operator validating the harness
- Requirements curator, architect, data executor, UI executor, and verifier

## Scope

- Add an independent `suppliers` module without changing `items`.
- Model supplier identity, contact data, active state, and audit fields.
- Provide 12 deterministic mock seeds and process-local mutable CRUD state that survives refreshes while the server process remains alive and resets after restart.
- Implement list, create, detail, edit, physical delete, and active/inactive toggle flows.
- Provide URL-synchronized search, status filter, sorting, pagination, parameter sanitization, desktop table, mobile cards, and empty state.
- Add the localized `/{locale}/suppliers` route, catalog sidebar entry with `Truck`, metadata, paths helper, and complete EN/ES namespaces.
- Validate behavior through the integrated browser and the four repository gates.

## Domain Contract

`Supplier` contains `id`, `name`, `contactName`, `email`, `phone`, `isActive`, `createdBy`, `createdAt`, `updatedBy`, and `updatedAt`. `SupplierDetails` is the detailed success entity.

- Name is trimmed, required, 2–120 characters, and unique case-insensitively.
- Email is trimmed, required, valid, and normalized for comparison/storage.
- Contact name and phone are optional and normalized to nullable values.
- New suppliers are active by default unless explicitly set otherwise.
- Create and edit inputs are validated at the client and server boundary.
- Fallible detail/mutation responses use `VALIDATION_ERROR`, `ALREADY_EXISTS`, `NOT_FOUND`, or `INTERNAL_ERROR`.

## List and URL Rules

- Search matches name, contact name, email, and phone.
- Active status can be all, active, or inactive; explicit `false` must survive parsing and refresh.
- Sorting supports name and creation date, ascending or descending.
- `page`, `limit`, `sortBy`, `sortOrder`, and `isActive` are parsed and sanitized; unsupported values fall back to approved defaults.
- Pagination supports limits 5, 10, 20, and 30 and exposes page 2 with the 12 seeds.
- Filters are shareable and persist through refresh because the URL is the state authority.
- Deletion safely returns to page 1 when the current page would otherwise be invalid.

## Candidate Flows

### Browse and filter

1. The operator navigates directly or through Catalog > Suppliers.
2. The server renders the sanitized URL state and paginated mock results.
3. The operator searches, filters active/inactive, sorts, changes limit, or navigates pages.
4. Refresh preserves the same URL-backed view.

### Create and detect duplicate

1. The operator opens the create modal.
2. Client validation displays localized required/format messages.
3. The server boundary validates again and rejects a case-insensitive duplicate name with `ALREADY_EXISTS`.
4. A valid supplier is added to process-local state and appears after refresh.

### Inspect, edit, toggle, and delete

1. Row/card actions open detail, edit, toggle, or delete modals.
2. Missing records return `NOT_FOUND` rather than nullable success.
3. Edits and toggles update audit state and survive refresh in the same process.
4. Physical delete removes the record and returns to a safe list page.

## Acceptance

- Browser verification covers sidebar/direct navigation, SSR, empty state, URL persistence, explicit false, sorting, limits, page 2, valid create, localized validation, duplicate name, detail, edit, toggle, delete, and safe page reset.
- The same core flows are exercised in English and Spanish, at desktop and mobile viewports.
- Refresh within one running server preserves mutations; restarting restores the 12 seeds and is recorded as the expected limitation.
- `pnpm verify` passes and the final PASS report includes browser evidence, four gates, warnings, handoffs, and a fresh SHA-256 snapshot.

## Out of Scope

- Database, API routes, durable persistence, relations, authorization, or treating `(protected)` as real authentication.
- Bulk actions, reports, imports/exports, or changes to the items module.
- Vitest, Playwright, another dependency, or a new browser automation framework.

## Dependencies and Constraints

- Reuse existing shared components and the validated widget/module patterns.
- UI owns application routes and message files to prevent data/UI handoff conflicts.
- Execute sequential curator -> architect -> data -> UI -> verifier handoffs with exact editable roots.
- No blocking questions remain; the user approved the complete scope and expected persistence limitation.
