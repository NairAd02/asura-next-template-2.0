# Spec Reference — Widget

> ⚠️ **This is not a real project spec.** It is a training reference for AI agents that write specs (`spec-authoring` skill), paired 1:1 with the code reference module at [`.agent/reference/widget/`](../widget/README.md).

## Why this exists

`.agent/reference/widget/` shows agents what the **code** for a fully-featured module looks like. This folder shows what the **spec that led to that code** looks like — same entity (`Widget`), same fields, same features (list, filters, create/edit form, details, delete, activate).

An agent writing a new spec should be able to open `spec.md` here, open the matching file in `.agent/reference/widget/`, and see exactly how each requirement maps to an implementation decision.

## Files

| File | Purpose |
|---|---|
| `spec.md` | Fully resolved feature spec for "Widget Management" — every section filled in, no placeholders. |
| `edge-cases.md` | Fully resolved edge cases for the same feature. |

## How to use it

1. Read `.agent/skills/spec-authoring/SKILL.md` first for the rules.
2. Read `spec.md` / `edge-cases.md` here to see the rules applied to a real (generic) example.
3. Cross-check against `.agent/reference/widget/lib/types/widget.types.ts` to see how `RF-WID-NN` requirements became concrete fields/DTOs.
4. Write the new spec into `docs/specs/features/<feature>/spec.md`, **not** into this reference folder.

## Relationship to `docs/specs/`

`docs/specs/features/` contains **project-facing example specs** (`item-catalog`, `notification-preferences`, `usage-dashboard`) that a human would read as documentation. This folder is the **agent-facing training pair** for the code reference module — keep both in sync if the `widget` reference module ever changes shape.
