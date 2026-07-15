# Proposal: Integrate OpenSpec With `.agent` Workflow

## Why

Adopt OpenSpec as the executable change/spec layer while preserving `.agent` as
the project-specific technical governance layer and `docs/` as source material.

## What Changes

- Standardize `docs/project-context.md` as the canonical source document.
- Add `docs/requirements/` for curated candidate requirement briefs.
- Configure `openspec/config.yaml` so OpenSpec reads `.agent` conventions.
- Replace the old spec-writer path with `agent-requirements-curator`.
- Update verification to run OpenSpec validation before project gates.

## Non-goals

- Do not bulk-convert unrelated historical examples into OpenSpec.
- Do not use OpenSpec Stores.
- Do not create a product feature from template examples.

## Source Requirement

- `docs/requirements/integrate-openspec-agent-workflow/brief.md` (`REQ-001`)

## Open Questions

- None.
