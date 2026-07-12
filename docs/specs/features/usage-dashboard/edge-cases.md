# Edge Cases: Usage Dashboard

> Corner cases, validation failures, and exceptional flows kept out of `spec.md`. Add entries as they are discovered (code review, QA, production).

| ID | Scenario | Expected behavior | Source |
|---|---|---|---|
| EC-DASH-01 | No data exists for the selected date range | Show an explicit empty state on widgets/chart, not a broken/blank render | RF-DASH-01 |
| EC-DASH-02 | Date range is invalid (end before start) | Reject client-side before querying the server; show a validation message | RF-DASH-03 |
| EC-DASH-03 | Viewer role attempts to trigger a drill-down | Drill-down control is hidden or disabled for roles without `item-catalog` access | RF-DASH-04 |
| EC-DASH-04 | Date range spans a very large period (e.g. multiple years) | Aggregate server-side and consider down-sampling to keep response time within `RNF-GLOBAL-03` | RNF-GLOBAL-03 |

## Notes

- This file is a generic example — add real edge cases as they surface during implementation and QA.
