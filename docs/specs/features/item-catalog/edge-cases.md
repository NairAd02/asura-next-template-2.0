# Edge Cases: Item Catalog

> Corner cases, validation failures, and exceptional flows kept out of `spec.md`. Add entries as they are discovered (code review, QA, production).

| ID | Scenario | Expected behavior | Source |
|---|---|---|---|
| EC-CAT-01 | User submits the create form with a duplicate unique field (e.g. name/slug) | Server action rejects with a field-level error; no duplicate is created | RF-CAT-02 |
| EC-CAT-02 | User deletes/deactivates an item that is referenced by another module | Block or warn if hard dependencies exist; otherwise allow (soft-delete keeps referential integrity) | BR-03 |
| EC-CAT-03 | Two users edit the same item concurrently | Last write wins unless the project requires optimistic locking; document the chosen behavior here | RF-CAT-03 |
| EC-CAT-04 | Filters combine search + status + pagination at the same time | All filters apply together (AND), page resets to 1 when filters change | RF-CAT-07 |
| EC-CAT-05 | User navigates directly to a details URL for a deleted/inactive item | Show a clear "not found" or "inactive" state instead of a raw error | RF-CAT-04 |

## Notes

- This file is a generic example — add real edge cases as they surface during implementation and QA.
