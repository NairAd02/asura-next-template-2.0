# 02 — Roles & Permissions

> **Template note:** generic example role model. Replace with your project's real roles, but keep the "additive from zero" convention — it plays well with server-side authorization checks.

## Roles

| Role | Scope |
|---|---|
| **Admin** | Full access to every feature, including user/role management and system configuration. |
| **Manager** | Can create/edit/manage records in their scope (e.g. team or department), but cannot manage other users or global configuration. |
| **Viewer** | Read-only access — can view lists, details, and dashboards, but cannot create, edit, or delete. |

## Permission matrix (example)

| Feature | Admin | Manager | Viewer |
|---|---|---|---|
| `item-catalog` — view list/details | ✅ | ✅ | ✅ |
| `item-catalog` — create/edit/delete | ✅ | ✅ | ❌ |
| `item-catalog` — activate/deactivate | ✅ | ✅ | ❌ |
| `notification-preferences` — manage own preferences | ✅ | ✅ | ✅ |
| `usage-dashboard` — view dashboard | ✅ | ✅ | ✅ |
| `usage-dashboard` — drill down to record details | ✅ | ✅ | ❌ |

## Conventions

- Permissions start at **zero** and are explicitly granted per role — no implicit access ([BR-02](./01-business-rules.md)).
- Authorization MUST be enforced in `lib/actions/*` / API routes, never only in the client UI.
- If a feature needs a role not listed here, add it to this table rather than special-casing it inline in the feature spec.
