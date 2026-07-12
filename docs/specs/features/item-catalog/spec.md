# Feature: Item Catalog

> **Status:** Active &nbsp;·&nbsp; **Owner:** \<name\> &nbsp;·&nbsp; **Requirements covered:** 1–6
>
> **Shape:** full CRUD — list, filters, create/edit form, details, delete, activate/deactivate. This is the "reference" example: it maps 1:1 to the code reference module at [`.agent/reference/widget/`](../../../../.agent/reference/widget/) and the agent-facing spec reference at [`.agent/reference/spec-example/`](../../../../.agent/reference/spec-example/).

## Context

Admins and Managers need a central place to create, browse, and maintain a catalog of records (e.g. products, assets, or any first-class entity of the project). This is the most common module shape in the app — most CRUD-style features should start from this spec as a template.

## Functional requirements

Use RFC 2119 (MUST / SHOULD / MAY) and stable IDs `RF-CAT-NN`.

- **RF-CAT-01:** The system MUST display a paginated, sortable, searchable list of items.
- **RF-CAT-02:** An Admin or Manager MUST be able to create a new item via a form with client- and server-side validation.
- **RF-CAT-03:** An Admin or Manager MUST be able to edit an existing item's fields.
- **RF-CAT-04:** Any role with view access MUST be able to open a read-only details view for a single item.
- **RF-CAT-05:** An Admin or Manager MUST be able to soft-delete an item (with confirmation) rather than removing it permanently.
- **RF-CAT-06:** An Admin or Manager MUST be able to toggle an item's active/inactive state without opening the full edit form.
- **RF-CAT-07:** The list MUST support filtering by status (active/inactive) and free-text search, with filter state reflected in the URL ([BR-06](../../01-business-rules.md)).

## Non-functional requirements

Reference system-wide RNFs from [`../../00-overview.md`](../../00-overview.md). List only feature-specific deltas here.

- Applies: `RNF-GLOBAL-01` (auth), `RNF-GLOBAL-02` (i18n/a11y), `RNF-GLOBAL-03` (list performance), `RNF-GLOBAL-04` (server-side validation).

## Main flows

### Flow 1 — Create an item (happy path)
1. Admin/Manager opens the catalog list and clicks "Create".
2. Fills the form; client-side Zod validation runs on submit.
3. Server action re-validates and persists the item; list refreshes with a success toast.

### Flow 2 — Filter and search
1. User types a search term or picks a status filter.
2. URL query params update; the list re-fetches server-side and reflects the new state.
3. Reloading the page or sharing the URL preserves the same filtered view.

### Flow 3 — Deactivate instead of delete
1. Admin/Manager toggles "Active" off from the list row or details view.
2. System asks for confirmation, then flips the flag; the item remains in history/reports.

## Business rules

- **[BR-03](../../01-business-rules.md):** deactivation uses `isActive`, not a hard delete.
- **[BR-06](../../01-business-rules.md):** list filters/sort/pagination are URL-synced.

## Acceptance criteria (Gherkin)

```gherkin
Scenario: Create a new item
  Given an Admin is on the item catalog page
  When they submit a valid "Create item" form
  Then the item appears in the list
  And a success notification is shown

Scenario: Search is reflected in the URL
  Given a user is on the item catalog list
  When they type a search term
  Then the URL query string includes the search term
  And reloading the page preserves the filtered results

Scenario: Deactivate instead of delete
  Given an Admin views an active item
  When they toggle it to inactive
  Then the item is hidden from the default "active" filter
  But it still exists and can be found via the "inactive" filter
```

- [ ] AC-CAT-01 — create/edit forms validate both client- and server-side.
- [ ] AC-CAT-02 — list filters/sort/pagination persist via URL.
- [ ] AC-CAT-03 — delete requires confirmation and is a soft-delete.
- [ ] AC-CAT-04 — activate/deactivate toggle works from list and details.

## Dependencies

- **Requires:** none (self-contained example).
- **Affects:** none.

## Open questions

- None — this is a template example. Replace with real open questions for your feature.
