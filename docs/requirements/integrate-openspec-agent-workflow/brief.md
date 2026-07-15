# Requirement Brief: Integrate OpenSpec With `.agent` Workflow

> **ID:** REQ-001  
> **Status:** implemented  
> **Priority:** high  
> **Source:** `docs/project-context.md#proposed-architecture`  
> **OpenSpec change:** `archive/2026-07-15-integrate-openspec-agent-workflow`

## Intent

Make OpenSpec the executable change/spec layer while preserving `.agent` as the
project-specific technical governance layer and `docs/` as source material.

## Actors

- Project owner
- AI coding agent
- Future implementer using the template

## Scope

- Standardize `docs/project-context.md` as the canonical source document.
- Add `docs/requirements/` as the candidate requirement queue.
- Configure OpenSpec for Codex and inject `.agent` context.
- Replace the old spec-writer flow with a requirements curator flow.
- Update verification to validate OpenSpec before TypeScript, lint, and build.

## Out of Scope

- Migrating unrelated historical examples into OpenSpec.
- Creating a real product feature from the template examples.
- Using OpenSpec Stores.

## Candidate Flows

### Flow 1 - Curate a requirement

1. User updates `docs/project-context.md`.
2. `agent-requirements-curator` extracts or updates a requirement brief.
3. The brief receives a stable `REQ-<NNN>` ID and suggested `change-id`.

### Flow 2 - Execute a selected requirement

1. User selects a requirement brief.
2. OpenSpec creates a change with proposal, specs, design, and tasks.
3. Implementation follows the OpenSpec tasks and applicable `.agent` skills.
4. Verification runs OpenSpec validation plus project gates.
5. Archive/sync updates `openspec/specs/`.

## Rules and Constraints

- Do not bulk-convert the whole project context into OpenSpec specs.
- Do not create executable specs outside OpenSpec.
- `.agent` remains the source of stack-specific implementation conventions.
- OpenSpec is the source of accepted executable behavior after archive/sync.

## Dependencies

- Node.js >= 20.19.0.
- OpenSpec CLI installed globally.
- Codex OpenSpec skills generated under `.codex/`.

## Open Questions

- None.

## Suggested OpenSpec Change

- **Change ID:** `integrate-openspec-agent-workflow`
- **Affected domain/spec:** `workflow`
- **Notes for proposal/spec/design/tasks:** document the hybrid workflow itself as the first OpenSpec pilot.

## Implementation Result

- Archived change: `openspec/changes/archive/2026-07-15-integrate-openspec-agent-workflow/`
- Accepted spec: `openspec/specs/workflow/spec.md`
