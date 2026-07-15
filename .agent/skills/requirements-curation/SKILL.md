---
name: requirements-curation
description: Load when extracting candidate requirements from docs/project-context.md into docs/requirements/ before creating OpenSpec changes.
---

# Requirements Curation

## When to use

Use this skill during discovery when product knowledge exists in
`docs/project-context.md` and needs to become a clean backlog of candidate
requirements under `docs/requirements/`.

This skill does **not** write executable specs. OpenSpec owns executable changes
and accepted behavior via `openspec/changes/` and `openspec/specs/`.

## Inputs

Always read these first:

- `docs/project-context.md` - canonical source material.
- `docs/requirements/index.md` - existing curated requirements and IDs.
- `docs/requirements/_templates/requirement-brief.template.md` - required brief shape.
- `.agent/skill-registry.md` - available project skills.
- `.agent/skills/spec-driven-development/SKILL.md` - hybrid OpenSpec + .agent protocol.

Read additional `.agent/skills/*/SKILL.md` files only when their domain applies
to a candidate requirement.

## Outputs

For each curated requirement, create or update:

- `docs/requirements/<requirement-kebab>/brief.md`
- a row in `docs/requirements/index.md`

Each brief must include:

- stable `REQ-<NNN>` ID;
- status;
- priority;
- source references back to `docs/project-context.md`;
- intent;
- actors;
- scope;
- out of scope;
- candidate flows;
- business rules / RNFs / constraints;
- dependencies;
- open questions;
- suggested OpenSpec `change-id`.

## Rules

- Keep requirements candidate-level. Do not turn them into OpenSpec delta specs.
- Do not create `openspec/changes/` unless the user explicitly asks to start a change.
- Do not copy the entire project context into every brief; cite source sections.
- Split unrelated capabilities into separate requirement briefs.
- Merge duplicate or overlapping requirements and record the decision in the brief.
- Preserve unresolved decisions under `Open Questions`; never guess silently.
- Prefer small OpenSpec change IDs in kebab-case, for example `add-usage-dashboard`.
- Mark a brief `ready-for-openspec` only when scope, actors, primary flow, and open questions are clear enough for `/opsx:propose`.

## Checklist

- [ ] `docs/project-context.md` was read.
- [ ] Existing requirement IDs and change IDs were checked.
- [ ] Each new requirement has one stable `REQ-<NNN>` ID.
- [ ] `docs/requirements/index.md` was updated.
- [ ] No OpenSpec artifact was created unless explicitly requested.
- [ ] Open questions were preserved instead of invented away.

## Common errors

- Treating a requirement brief as a final spec.
- Bulk-converting the whole project context into OpenSpec specs.
- Creating one huge requirement that should be several focused changes.
- Forgetting source references back to `docs/project-context.md`.
- Losing ambiguity instead of recording it as an open question.
