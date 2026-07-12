# 00 — Project Overview

> **Template note:** this file is a **generic example**. Replace the content below with your real project's overview once you start building on this template. Keep the structure — feature specs in `features/*/spec.md` link back to the system-wide non-functional requirements (RNF-GLOBAL) defined here.

---

## Purpose

Describe in 1–2 paragraphs what the product/system does, who it serves, and why it exists. Example (generic placeholder):

> This system is an internal admin console that lets **Admins**, **Managers**, and **Viewers** manage a catalog of records, configure their notification preferences, and monitor usage through dashboards. It MUST enforce role-based access control and remain fully auditable.

## Modules → features

Map each top-level area of the product to the feature spec(s) that cover it. Keep this table in sync as you add features.

| Area | Feature spec(s) |
|---|---|
| Catalog management | `item-catalog` |
| User settings | `notification-preferences` |
| Analytics | `usage-dashboard` |

Full requirement mapping lives in [`traceability-matrix.md`](./traceability-matrix.md).

## Roles served

List the roles defined in [`02-roles-permissions.md`](./02-roles-permissions.md) that this system serves, e.g. **Admin**, **Manager**, **Viewer**. Authorization decisions MUST be enforced server-side; the UI only reflects permissions, never decides them ([BR-02](./01-business-rules.md)).

## System-wide non-functional requirements (RNF-GLOBAL)

These apply across **all** features. Individual feature specs reference these IDs instead of repeating them — only list feature-specific deltas in the feature's own spec.

### Authentication & session — `RNF-GLOBAL-01`
All protected routes MUST require an authenticated session. Session expiry and refresh behavior MUST be consistent across the app.

### Multilingual + accessible — `RNF-GLOBAL-02`
The UI MUST support the locales configured in `i18n/` (externalized via `next-intl`) with a persistent locale selector, and SHOULD comply with **WCAG 2.1 Level AA**.

### Performance — `RNF-GLOBAL-03`
List and dashboard views MUST meet a reasonable response-time target for the expected data volume (define your own threshold, e.g. `< 2s` for lists, `< 5s` for reports).

### Security — `RNF-GLOBAL-04`
Sensitive data MUST be transmitted over TLS, validated server-side (never trust client input), and authorization MUST be enforced on every server action / API route, not only in the UI.

### Audit — `RNF-GLOBAL-05`
Every mutating action (create/edit/delete/activate/deactivate) SHOULD be attributable to the user who performed it, if the project requires an audit trail ([BR-04](./01-business-rules.md)).

## Out of scope

Use this section to state explicit non-goals, or boundaries with other systems if this project integrates with external services (e.g. a separate API backend, a public-facing site, etc.).
