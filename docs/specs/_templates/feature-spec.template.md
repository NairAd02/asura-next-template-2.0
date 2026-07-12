# Feature: <Name>

> **Status:** Draft | Active &nbsp;·&nbsp; **Owner:** <name> &nbsp;·&nbsp; **Requirements covered:** <ids from traceability-matrix.md>
>
> Copy this file to `features/<feature>/spec.md`. Keep edge cases in the sibling `edge-cases.md`. See `.agent/skills/spec-authoring/SKILL.md` for the full rules and `.agent/reference/spec-example/` for a fully worked example.

## Context

Why this feature exists and the problem it solves. Link to [`../../00-overview.md`](../../00-overview.md) and, if applicable, to the source requirements doc.

## Functional requirements

Use RFC 2119 (MUST / SHOULD / MAY) and stable IDs `RF-<PREFIX>-NN`.

- **RF-<PREFIX>-01:** The system MUST ...
- **RF-<PREFIX>-02:** The admin MUST be able to ...

## Non-functional requirements

Reference system-wide RNFs from [`../../00-overview.md`](../../00-overview.md). List only feature-specific deltas here.

- Applies: `RNF-GLOBAL-NN`, ...

## Main flows

### Flow 1 — Happy path
1. ...

### Flow 2 — Alternative
1. ...

## Business rules

- **[BR-XX](../../01-business-rules.md):** how it applies to this feature.

## Acceptance criteria (Gherkin)

```gherkin
Scenario: <name>
  Given ...
  When ...
  Then ...
```

- [ ] AC-<PREFIX>-01 — ...

## Dependencies

- **Requires:** `<other spec>#<ID>` / `<external service>`
- **Affects:** `<other spec>`

## Open questions

- ...
