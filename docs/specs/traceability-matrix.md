# Traceability Matrix

> **Template note:** generic example matrix for the 3 example features shipped with this template. Maps each requirement to its feature spec, requirement IDs, and related business rules. Keep this in sync whenever a spec changes — replace with your real project's requirements as you add features.

> Legend: **RNF-GLOBAL-xx** = system-wide non-functional ([`00-overview.md`](./00-overview.md)); **RF-\<PREFIX\>-xx** = functional req in the feature spec; **BR-xx** = global business rule ([`01-business-rules.md`](./01-business-rules.md)).

| Req # | Requirement | Category | Feature / Doc | Spec IDs | Business rules |
|---|---|---|---|---|---|
| 1 | List, search, and filter catalog items | Catalog | `item-catalog` | RF-CAT-01, RF-CAT-07 | BR-06 |
| 2 | Create a new catalog item | Catalog | `item-catalog` | RF-CAT-02 | — |
| 3 | Edit an existing catalog item | Catalog | `item-catalog` | RF-CAT-03 | — |
| 4 | View catalog item details | Catalog | `item-catalog` | RF-CAT-04 | — |
| 5 | Soft-delete a catalog item | Catalog | `item-catalog` | RF-CAT-05 | BR-03 |
| 6 | Activate/deactivate a catalog item | Catalog | `item-catalog` | RF-CAT-06 | BR-03 |
| 7 | View own notification preferences | Settings | `notification-preferences` | RF-NOTIF-01 | — |
| 8 | Update own notification preferences | Settings | `notification-preferences` | RF-NOTIF-02, RF-NOTIF-03, RF-NOTIF-04 | BR-02 |
| 9 | View usage dashboard with filters | Analytics | `usage-dashboard` | RF-DASH-01, RF-DASH-02, RF-DASH-03 | BR-06 |
| 10 | Drill down from dashboard to catalog list | Analytics | `usage-dashboard` | RF-DASH-04 | — |

## Coverage check

- **Requirements covered:** 10 / 10 (example set).
- **Business rules touched:** BR-02, BR-03, BR-06.
- **System-wide RNFs** (`RNF-GLOBAL-01..05`) apply to every feature above; see [`00-overview.md`](./00-overview.md).

## How to use

- Add a row here every time a new requirement is captured in Research/Design, **before** implementation starts.
- Keep requirement numbers stable once assigned — never renumber, only append.
- This file is the single place to check "is everything in the requirements sheet actually covered by a spec?"
