# Feature: Usage Dashboard

> **Status:** Active &nbsp;·&nbsp; **Owner:** \<name\> &nbsp;·&nbsp; **Requirements covered:** 9–10
>
> **Shape:** read-only / analytics — filters + drill-down, no create/edit/delete/form. Use this spec as the template for dashboard/reporting-style modules.

## Context

Admins and Managers need a visual overview of usage/activity across the catalog (e.g. counts over time, breakdown by status) with the ability to drill down from a chart into the underlying records. This feature has **no form and no mutations** — it is entirely read-only.

## Functional requirements

Use RFC 2119 (MUST / SHOULD / MAY) and stable IDs `RF-DASH-NN`.

- **RF-DASH-01:** The system MUST display summary widgets (e.g. total active items, items created this period) computed server-side.
- **RF-DASH-02:** The system MUST display a time-series or breakdown chart, filterable by a date range.
- **RF-DASH-03:** Filters (date range, and optionally category) MUST be reflected in the URL ([BR-06](../../01-business-rules.md)).
- **RF-DASH-04:** Admins and Managers MUST be able to click a chart segment/widget to drill down into the filtered `item-catalog` list. Viewers MAY see the dashboard but MUST NOT drill down into record-level data if that requires elevated permissions ([02-roles-permissions.md](../../02-roles-permissions.md)).

## Non-functional requirements

- Applies: `RNF-GLOBAL-02` (i18n/a11y), `RNF-GLOBAL-03` (dashboard response-time target).

## Main flows

### Flow 1 — View dashboard (happy path)
1. User opens the usage dashboard; default date range (e.g. last 30 days) loads.
2. Summary widgets and chart render from server-computed aggregates.

### Flow 2 — Filter by date range
1. User picks a custom date range.
2. URL updates; widgets and chart re-fetch and re-render for the new range.

### Flow 3 — Drill down
1. Admin/Manager clicks a chart segment (e.g. "inactive items in March").
2. App navigates to `item-catalog` pre-filtered to match that segment.

## Business rules

- **[BR-06](../../01-business-rules.md):** date-range and category filters are URL-synced.

## Acceptance criteria (Gherkin)

```gherkin
Scenario: Default dashboard view
  Given a user opens the usage dashboard
  Then summary widgets and a chart are shown for the default date range

Scenario: Filter by custom date range
  Given a user is on the usage dashboard
  When they select a custom date range
  Then the URL reflects the selected range
  And the widgets/chart update to match

Scenario: Drill down from a chart segment
  Given a Manager views the usage dashboard
  When they click a chart segment
  Then they are taken to the item catalog list pre-filtered to match that segment
```

- [ ] AC-DASH-01 — widgets/chart reflect server-computed aggregates for the selected range.
- [ ] AC-DASH-02 — date-range/category filters are URL-synced.
- [ ] AC-DASH-03 — drill-down navigates to a correctly pre-filtered `item-catalog` view.
- [ ] AC-DASH-04 — Viewer role sees the dashboard but respects drill-down permission limits.

## Dependencies

- **Requires:** `item-catalog/spec.md` (drill-down target).
- **Affects:** none.

## Open questions

- None — this is a template example. Replace with real open questions for your feature.
