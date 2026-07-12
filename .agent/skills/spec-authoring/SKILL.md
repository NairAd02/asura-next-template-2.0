---
name: spec-authoring
description: Load whenever a new feature/module needs a formal spec (docs/specs/features/<feature>/spec.md + edge-cases.md), or an existing spec needs updating.
---

# Spec Authoring

## When to use

Whenever the Design phase requires writing or updating a formal spec under `docs/specs/features/`, before any implementation code is written. This is the SDD **Design (spec)** step — it happens before (or alongside) `agent-architect`'s technical module plan.

## Reference material — read these first

- `.agent/reference/spec-example/spec.md` + `edge-cases.md` — a fully resolved example spec, paired 1:1 with the code reference module at `.agent/reference/widget/`. This shows every rule below applied correctly.
- `docs/specs/_templates/feature-spec.template.md` + `edge-cases.template.md` — blank templates to copy for a new feature.
- `docs/specs/00-overview.md`, `01-business-rules.md`, `02-roles-permissions.md` — global docs that feature specs reference by ID instead of repeating.
- `docs/specs/features/item-catalog/`, `notification-preferences/`, `usage-dashboard/` — real project-facing examples covering the three most common module shapes (full CRUD, config-only, read-only/analytics).

## File structure and location

- One folder per feature: `docs/specs/features/<feature-kebab-case>/`.
- Two files per feature: `spec.md` (context, requirements, flows, business rules, acceptance criteria, dependencies, open questions) and `edge-cases.md` (corner cases table).
- Never put a spec anywhere else, and never skip `edge-cases.md` even if it starts with only 2–3 rows.

## ID conventions (MUST follow exactly)

| Prefix | Meaning | Scope | Example |
|---|---|---|---|
| `RF-<PREFIX>-NN` | Functional requirement | Per feature | `RF-CAT-01` |
| `RNF-GLOBAL-NN` | System-wide non-functional requirement | Global, defined in `00-overview.md` | `RNF-GLOBAL-02` |
| `BR-NN` | Business rule | Global, defined in `01-business-rules.md` | `BR-03` |
| `AC-<PREFIX>-NN` | Acceptance criterion checklist item | Per feature | `AC-CAT-01` |
| `EC-<PREFIX>-NN` | Edge case | Per feature | `EC-CAT-01` |

Rules:
- Pick a short, unique, uppercase `<PREFIX>` per feature (3–5 letters, e.g. `CAT`, `NOTIF`, `DASH`). Never reuse a prefix already used by another feature.
- IDs are **stable once assigned** — never renumber or reuse a number, even if a requirement is later removed. Append new ones instead.
- A feature-specific non-functional delta does **not** get its own `RNF-` ID — describe it in prose under "Non-functional requirements" and cite the global `RNF-GLOBAL-NN` it refines.

## RFC 2119 keywords

Every functional/non-functional requirement sentence MUST use exactly one of: **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY**. Do not write requirements as plain descriptive sentences without one of these keywords — that is the single most common authoring mistake.

## Required sections in `spec.md`

In this order: `Context` → `Functional requirements` → `Non-functional requirements` → `Main flows` → `Business rules` → `Acceptance criteria (Gherkin)` → `Dependencies` → `Open questions`. Do not omit a section — write "None" if it's genuinely empty, don't delete the heading.

- **Context:** why the feature exists, in 1 short paragraph. Link to `00-overview.md`.
- **Functional requirements:** numbered `RF-<PREFIX>-NN` bullets, RFC 2119.
- **Non-functional requirements:** only feature-specific deltas; reference `RNF-GLOBAL-NN` by link, don't restate the global text.
- **Main flows:** numbered steps per flow, at least a "happy path" flow.
- **Business rules:** link relevant `BR-NN` from `01-business-rules.md` with one line on how it applies here. Add a new global rule to `01-business-rules.md` only if it affects more than one feature.
- **Acceptance criteria (Gherkin):** at least one `Scenario` per main flow, using `Given/When/Then`. Follow with an `AC-<PREFIX>-NN` checklist that a verifier can tick off.
- **Dependencies:** `Requires:` (other specs/external services this feature needs) and `Affects:` (other specs impacted by this one).
- **Open questions:** anything not yet decided — never invent an answer to unblock yourself, list it here and flag it to the user instead.

## Module shape — declare it explicitly

Not every feature has every surface. State the shape at the top of the spec (mirrors `agent-architect`'s module plan):
- **Full CRUD:** list, filters, create/edit form, details, delete, activate — see `item-catalog`.
- **Config-only:** single settings form, no list, no delete — see `notification-preferences`.
- **Read-only/analytics:** filters + drill-down, no form/create/edit/delete — see `usage-dashboard`.
- A feature may also be a custom mix — if so, list exactly which surfaces exist and which are explicitly absent.

## Traceability

Every functional requirement MUST have a row in `docs/specs/traceability-matrix.md` (Req # → feature → `RF-` IDs → `BR-` IDs). Update this file in the same change as the spec — a spec without a traceability row is incomplete.

## Workflow

1. Confirm the feature doesn't already have a spec (check `docs/specs/features/`).
2. Copy the templates from `docs/specs/_templates/`.
3. Fill every required section; assign a fresh `<PREFIX>` and IDs.
4. Add/update rows in `traceability-matrix.md`.
5. Present the spec to the user for approval — implementation MUST NOT start before approval (SDD Design-phase gate, see `.agent/skills/spec-driven-development/SKILL.md`).
6. Once approved, hand off to `agent-architect` for the technical module plan.

## Checklist before declaring a spec done

- [ ] Every requirement sentence uses a RFC 2119 keyword.
- [ ] Every ID follows the exact prefix convention and is unique within the feature.
- [ ] `edge-cases.md` exists with at least the corner cases identified during Research.
- [ ] `traceability-matrix.md` has a row for each new requirement.
- [ ] Module shape (full CRUD / config-only / read-only / custom) is explicitly stated.
- [ ] All internal links (`00-overview.md`, `01-business-rules.md`, other specs) resolve to real files/anchors.
- [ ] No open question was silently resolved by guessing.

## Common errors

- Writing requirements without MUST/SHOULD/MAY (turns a spec into vague prose no one can verify).
- Forgetting to update `traceability-matrix.md`.
- Duplicating a global business rule's full text inside a feature spec instead of linking `BR-NN`.
- Assuming every feature needs list + form + filters + delete — state the actual shape instead.
- Missing Gherkin scenarios for flows described in prose.
- Reusing an ID prefix or number already used elsewhere.
