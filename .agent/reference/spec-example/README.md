# Requirement Reference — Widget

> ⚠️ **This is not a real project spec.** It is a training reference paired 1:1 with the code reference module at [`.agent/reference/widget/`](../widget/README.md).

## Why this exists

`.agent/reference/widget/` shows agents what the **code** for a fully-featured module looks like. This folder shows requirement-quality examples for the same entity (`Widget`), same fields, same features (list, filters, create/edit form, details, delete, activate).

An agent reviewing an OpenSpec change can open `spec.md` here, open the matching file in `.agent/reference/widget/`, and see how requirement quality maps to implementation decisions.

## Files

| File | Purpose |
|---|---|
| `spec.md` | Fully resolved feature spec for "Widget Management" — every section filled in, no placeholders. |
| `edge-cases.md` | Fully resolved edge cases for the same feature. |

## How to use it

1. Read `.agent/skills/spec-driven-development/SKILL.md` first for the current hybrid workflow.
2. Read `spec.md` / `edge-cases.md` here to see requirement-quality rules applied to a real (generic) example.
3. Cross-check against `.agent/reference/widget/lib/types/widget.types.ts` to see how `RF-WID-NN` requirements became concrete fields/DTOs.
4. Write new executable specs through OpenSpec, **not** into this reference folder.

New source material starts in `docs/project-context.md` and `docs/requirements/`.
New executable specs live in `openspec/specs/`.
