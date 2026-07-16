## Context

REQ-004 is a bounded product pilot for the newly hardened harness. The repository already provides in-memory CRUD helpers, server actions, URL-filter patterns, responsive table/card views, modal/form primitives, i18n, and the validated widget reference. The new module must exercise those patterns without changing `items`, adding infrastructure, or pretending the `(protected)` route group enforces authentication.

Responsibility is sequential: curator owns the brief/index, architect owns this plan, data owns `modules/suppliers/lib/**`, UI owns every other supplier file plus routes/messages/shared integration, and verifier owns browser/gate evidence. Every handoff is persisted in `apply-progress.md`.

## Goals / Non-Goals

**Goals:**

- Deliver a complete localized supplier catalog with deterministic process-local mock state, validated CRUD/toggle/detail operations, sanitized URL querying, responsive views, and modal interaction.
- Make refresh persistence and restart reset observable and explicit.
- Validate both the product behavior and the hardened harness lifecycle through browser evidence, four gates, a fresh snapshot, and native archive.

**Non-Goals:**

- Database, API routes, durable storage, relations, authorization, bulk actions, reports, imports/exports, or changes to `items`.
- New dependencies, test frameworks, browser frameworks, or generalized abstractions.

## Decisions

### 1. Isolated process-local store

`modules/suppliers/lib/mock/suppliers.data.ts` will define 12 immutable seed values and expose a mutable store held on `globalThis` under a supplier-specific symbol/key. This survives server-component refreshes and development module reloads in the running Node process while a true process restart recreates the seeds. Deep-cloned seeds avoid reset mutations.

Alternative: a module-level array is simpler but can be duplicated by server bundles or hot reload. A database would defeat the pilot constraint.

### 2. Shared Zod schemas inside the data boundary

Localized schema factories live under `modules/suppliers/lib/schemas/` so both UI form resolvers and server actions import one validation contract. UI supplies translated messages; server actions use stable error tokens and map failed parsing to `VALIDATION_ERROR`. Services own uniqueness and missing-record rules.

Alternative: form-local schemas would force the data executor to depend on UI-owned paths and make server validation easier to omit.

### 3. Explicit domain and response contract

The data layer exposes `Supplier`, `SupplierDetails`, `CreateSupplierDto`, `EditSupplierDto`, `SupplierFiltersDto`, `SuppliersResponse`, filter sanitation, and actions for list/detail/create/edit/delete/toggle. Detail and mutations return `ServiceResponse`; missing records use `NOT_FOUND`, duplicate normalized names use `ALREADY_EXISTS`, invalid input uses `VALIDATION_ERROR`, and unexpected failures use `INTERNAL_ERROR`.

Names and emails are trimmed; names compare case-insensitively, emails are lowercased, optional contact/phone values normalize to `null`, and edits exclude the current supplier from duplicate detection.

### 4. URL is the list-state authority

The route awaits `searchParams`, calls a pure data-owned sanitizer, and passes a canonical `SupplierFiltersDto` to SSR content. Defaults are page 1, limit 10, name ascending; valid limits are 5/10/20/30; valid sort fields are name/createdAt; boolean parsing preserves explicit false. UI filter hooks update URL parameters and reset page when query criteria change. Delete success explicitly sets page 1 before refresh.

### 5. Existing SSR/modal/responsive composition

`SuppliersContent` renders header, filter and list Suspense boundaries. The list server container calls the action and renders pagination; the client presentational owns modal IDs/open state and chooses desktop table vs mobile cards. Create, edit, detail, delete, and toggle use existing modal/alert-dialog/form primitives. There are no bulk actions.

### 6. UI owns shared integration

The UI phase alone edits `app/[locale]/(protected)/suppliers/page.tsx`, `routes/paths.tsx`, `routes/groups-routes/groups-routes.tsx`, `messages/en.json`, `messages/es.json`, and `DetailsContainerWrapper`. It adds `paths.suppliers`, Catalog > Suppliers with `Truck`, `detailsContainer.supplier`, and namespaces `suppliers`, `supplierDetails`, and `supplierForm` in both locales.

### 7. Verification uses the integrated browser

No automated browser dependency is introduced. The verifier runs native status, exercises EN/ES desktop/mobile scenarios in the integrated browser, proves refresh persistence, restarts the development process to prove deterministic reset, then executes `pnpm verify`. Browser outcomes, warnings, handoffs, verdict, and SHA-256 snapshot are recorded in `verify-report.md`.

## Risks / Trade-offs

- **Process-local state can vary across multiple workers** -> Scope the guarantee to one running process and record restart reset as intentional; do not present this as production persistence.
- **Next development caching can hide a mutation** -> Use server actions plus `router.refresh()` and a global store; browser verification checks actual refresh persistence.
- **URL parameters can create invalid pages or unsafe sorts** -> Sanitize every parameter against allowlists/defaults before querying; deletion returns to page 1.
- **Shared messages/routes are conflict-prone** -> Only the UI phase owns them.
- **Manual browser evidence is convention-based** -> Record concrete URLs/viewports/actions and pair it with deterministic build/type/lint/spec gates.

## Migration Plan

1. Implement and validate the data boundary.
2. Implement the UI and shared integrations.
3. Run browser scenarios against one process, restart it, and confirm seeds return.
4. Run four gates, finalize evidence, strict preflight, and native archive.

Rollback removes the isolated route/module and its path/sidebar/message/detail-key additions. No external data or migration remains.

## Open Questions

None. REQ-004 and the approved plan settle scope, ownership, defaults, error semantics, and the persistence limitation.
