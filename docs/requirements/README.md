# Requirements

This folder is the curated queue of candidate requirements extracted from
`docs/project-context.md`.

Requirement briefs are not executable specs. They are product-intent packets that
feed OpenSpec changes.

## Structure

```text
docs/requirements/
├── index.md
├── _templates/
│   └── requirement-brief.template.md
└── <requirement-kebab>/
    └── brief.md
```

## Lifecycle

- `candidate` - extracted from source material, not yet selected.
- `ready-for-openspec` - clear enough to become an OpenSpec change.
- `in-openspec` - has an active `openspec/changes/<change-id>/`.
- `implemented` - archived into `openspec/specs/`.
- `deferred` - intentionally postponed.
