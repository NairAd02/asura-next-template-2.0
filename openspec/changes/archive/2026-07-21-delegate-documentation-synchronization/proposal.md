## Why

New product intent can arrive without prior representation in
`docs/project-context.md` or the requirements backlog. The existing workflow
assumes the operator updated that source material first, so durable project
knowledge can drift while architecture, implementation, and verification agents
carry unnecessary documentation context.

Driving requirement: `docs/requirements/synchronize-documentation-for-new-features/brief.md` (REQ-008).

## What Changes

- Require a bounded, delegated documentation-synchronization handoff before
  OpenSpec planning for a new product capability absent from project context and
  requirements.
- Add a maintained documentation inventory and a standard synchronization ledger
  to requirement briefs.
- Give `agent-requirements-curator` isolated documentation roots and prohibit it
  from implementation, verification, archive, or redelegation work.
- Require a curator-owned documentation reconciliation task before final
  verification of a product change, so its result is captured by existing
  evidence rules.
- Align bootstrap, OpenSpec local guidance, operator/developer guides, roles,
  and workflow governance with the new path.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workflow`: Define delegated initial and final documentation synchronization
  for new product capabilities and scope changes.

## Impact

- Affected systems: `docs/`, requirement curation, Harness entry guidance,
  local OpenSpec skills, workflow governance, and the accepted workflow spec.
- No application runtime API, dependency, route, data model, or persistence
  change.
- Success means a new capability follows the curator handoff before proposal,
  the final curator task precedes verification, and all repository gates pass.
- Rollback is a single revert of the documentation, governance, local-skill,
  and workflow-spec changes; no migration or runtime data cleanup is required.
