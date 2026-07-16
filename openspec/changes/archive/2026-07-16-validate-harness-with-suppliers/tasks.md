## 1. Progress and Data Boundary

- [x] 1.1 Create the reconciled apply-progress snapshot and persist curator/architect handoffs with exact roots and skills.
- [x] 1.2 Implement supplier domain/DTO/response/filter types, shared localized Zod schema factories, and 12 deterministic process-local seeds.
- [x] 1.3 Implement sanitized list/detail/create/edit/delete/toggle services and thin server actions with duplicate, validation, missing-record, audit, and error semantics.
- [x] 1.4 Implement typed client hooks for detail and every mutation with localized service-error mapping and refresh-friendly callbacks.

## 2. Route, Localization, and SSR List

- [x] 2.1 Add `paths.suppliers`, the localized Catalog sidebar entry with `Truck`, direct localized route, metadata, and `DetailsContainerWrapper` supplier support.
- [x] 2.2 Add complete and structurally consistent EN/ES `suppliers`, `supplierDetails`, `supplierForm`, sidebar, detail-wrapper, validation, notification, and shared action messages.
- [x] 2.3 Implement the suppliers SSR content, URL-parameter sanitation at route entry, filters with URL authority, Suspense boundaries, server list container, pagination, and empty state.

## 3. Responsive CRUD Experience

- [x] 3.1 Implement the desktop supplier table and mobile supplier cards with view/edit/toggle/delete actions and no bulk/report features.
- [x] 3.2 Implement localized create/edit forms using shared Zod factories at the client and server boundary, including valid, invalid, and duplicate-name behavior.
- [x] 3.3 Implement localized detail, physical-delete, and active-toggle modal flows with `NOT_FOUND` handling, refresh persistence, and safe page-1 recovery after deletion.

## 4. Browser Verification

- [x] 4.1 Verify English desktop direct/sidebar navigation, SSR, URL refresh persistence, search, explicit inactive filter, sorting, valid limits, page 2, and empty state.
- [x] 4.2 Verify English desktop create validation, valid create, case-insensitive duplicate, detail, edit, toggle, delete, and safe return to page 1.
- [x] 4.3 Verify Spanish desktop localization and the corresponding core navigation, validation, CRUD, and filter flows.
- [x] 4.4 Verify English and Spanish mobile card layouts and modal actions at a mobile viewport.
- [x] 4.5 Verify mutations survive refresh in one process and restarting the application restores exactly the 12 deterministic seeds.

## 5. Repository Gates and Reconciliation

- [x] 5.1 Run OpenSpec plus harness validation and record exit code/result.
- [x] 5.2 Run non-incremental application plus reference TypeScript checks and record exit code/result.
- [x] 5.3 Run application plus reference ESLint checks and record exit code/warnings/result.
- [x] 5.4 Run the production build and record exit code/warnings/result.
- [x] 5.5 Reconcile every task, current progress, files changed, handoffs, browser results, and REQ-004/index close data for final evidence.
