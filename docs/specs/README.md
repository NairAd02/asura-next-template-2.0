# Specs — Spec-Driven Development

> **Template note:** this whole `docs/specs/` tree is a **generic, self-contained example**. It exists to show how specs should be structured and written for projects built from this template — replace the example content (`item-catalog`, `notification-preferences`, `usage-dashboard`) with your real project's specs, keeping the same structure and conventions.

Feature-level specs following **Spec-Driven Development (SDD)**. These specs are versioned with the code, in this repo.

> If you're an AI agent authoring a new spec, also read `.agent/skills/spec-authoring/SKILL.md` (rules) and `.agent/reference/spec-example/` (a fully worked example paired with the code reference module).

---

## Structure

```
docs/specs/
├── README.md                   ← this file
├── 00-overview.md               ← project purpose, modules, system-wide RNFs (RNF-GLOBAL-01..05)
├── 01-business-rules.md         ← global business rules (BR-NN)
├── 02-roles-permissions.md      ← roles + permission matrix
├── traceability-matrix.md       ← requirements → feature + RF/RNF IDs + BRs
├── _templates/                  ← copy these to author new specs
│   ├── feature-spec.template.md
│   └── edge-cases.template.md
└── features/
    ├── item-catalog/             ← full CRUD example (list, form, filters, details, delete, activate)
    ├── notification-preferences/ ← config-only example (single settings form, no list/delete)
    └── usage-dashboard/          ← read-only/analytics example (filters + drill-down, no form)
```

Each feature folder contains a `spec.md` (context, requirements, flows, business rules, Gherkin acceptance criteria, dependencies) and an `edge-cases.md` (corner cases discovered over time).

## Conventions

- **RFC 2119** keywords (MUST/SHOULD/MAY).
- **Stable IDs:** functional `RF-<PREFIX>-NN` (pick a short per-feature prefix, e.g. `CAT`, `NOTIF`, `DASH`), system-wide non-functional `RNF-GLOBAL-NN`, business rules `BR-NN` (global), acceptance criteria `AC-<PREFIX>-NN`, edge cases `EC-<PREFIX>-NN`.
- **Gherkin** acceptance criteria.
- A behavior-changing PR MUST update the relevant spec (and `traceability-matrix.md` if requirement coverage changes).
- IDs are **stable once assigned** — never renumber, only append.

## Source requirements

For a real project, link here to wherever your requirements originate (a requirements doc, ticket system, or discovery notes). This template ships without one — the 3 example features above stand in for a real requirements sheet.

## Authoring a new spec

1. Copy `_templates/feature-spec.template.md` → `features/<feature>/spec.md` and `_templates/edge-cases.template.md` → `features/<feature>/edge-cases.md`.
2. Follow `.agent/skills/spec-authoring/SKILL.md` for the rules and `.agent/reference/spec-example/` for a fully worked example.
3. Add a row to `traceability-matrix.md` for each new requirement covered.
4. Get the spec approved before implementation starts (SDD Design-phase gate).
