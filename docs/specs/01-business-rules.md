# 01 — Business Rules

> **Template note:** generic example business rules (`BR-NN`). These are referenced by ID from feature specs (e.g. `[BR-02](../../01-business-rules.md)`) instead of being restated in each feature. Replace with your project's real rules — keep IDs **stable** once a spec references them.

| ID | Rule |
|---|---|
| `BR-01` | A record's `slug`/unique identifier, once published or shared externally, MUST NOT be changed without an explicit migration path. |
| `BR-02` | All authorization decisions MUST be enforced server-side (actions/API routes). The UI only reflects permissions granted to the current role. |
| `BR-03` | Soft-deletable entities MUST use an `isActive` (or `deletedAt`) flag rather than hard deletes, so history and relations are preserved. |
| `BR-04` | Every mutating server action SHOULD record who performed it and when, if the feature is marked as audited. |
| `BR-05` | Any user-facing text (labels, errors, toasts) MUST be externalized via i18n — no hardcoded strings in components. |
| `BR-06` | Pagination, sorting, and filtering parameters MUST be reflected in the URL so a view's state survives a refresh or is shareable via link. |

## How to use

- Reference a rule from a feature spec's **Business rules** section: `` - **[BR-02](../../01-business-rules.md):** how it applies to this feature. ``
- Add a new rule here only if it applies to **more than one** feature. Feature-specific rules belong in the feature's own `spec.md`.
- Never renumber an existing `BR-NN` once a spec links to it — add new ones instead.
