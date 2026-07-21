# Requirement Brief: Delegate Documentation Synchronization for New Features

> **ID:** REQ-008  
> **Status:** implemented  
> **Priority:** high  
> **Source:** `docs/project-context.md#functional-requirements`, `docs/project-context.md#proposed-architecture`  
> **OpenSpec change:** `archive/2026-07-21-delegate-documentation-synchronization`

## Intent

Keep durable project knowledge aligned with new product capabilities without
loading documentation work into architecture, implementation, or verification
roles.

## Actors

- Human operator who introduces a new capability.
- Orchestrator that classifies work and sends bounded handoffs.
- `agent-requirements-curator` that synchronizes project documentation and
  curates the requirement.

## Scope

- Maintain an explicit inventory of project documentation reviewed for new
  product capabilities.
- Delegate initial documentation synchronization and requirement curation to the
  requirements curator before OpenSpec planning.
- Persist an initial documentation ledger in the requirement brief.
- Require a curator-owned final documentation-reconciliation task before final
  verification of product changes.
- Preserve the current OpenSpec, approval, evidence, and native archive rules.

## Out of Scope

- Scanning every Markdown file in the repository.
- Making the curator implement code, author executable specs, verify, or
  archive.
- Adding a semantic archive gate that judges the quality of documentation text.
- Rewriting archived changes or accepted specs outside native OpenSpec sync.

## Candidate Flows

### Flow 1 - New capability has no existing source material

1. The orchestrator identifies product intent that is absent from project
   context and the requirements index.
2. It sends a bounded `no-change` handoff to `agent-requirements-curator`.
3. The curator reviews the documentation inventory, updates applicable source
   material, creates the requirement brief and records the ledger.
4. The orchestrator uses the ready brief to create an OpenSpec change.

### Flow 2 - Scope changes during a product change

1. Planning or implementation identifies a scope change that can affect durable
   documentation.
2. Before final verification, the curator receives a bounded final-review
   handoff.
3. The curator updates affected documentation or records why no update applies.
4. The final verification snapshot includes those edits and the handoff.

## Rules and Constraints

- `docs/project-context.md`, the requirement brief, and the requirements index
  are always reviewed for a new product capability.
- Other maintained documents are reviewed only according to
  `docs/documentation-inventory.md`.
- The curator receives only documentation context and its explicit editable
  roots; it does not redelegate.
- When a subagent runtime is unavailable, the orchestrator uses the existing
  inline fallback and records the concrete reason in change progress evidence.
- The final documentation task is completed before `pnpm verify`; edits made
  afterward require fresh evidence under the existing snapshot policy.

## Dependencies

- Existing phase handoff contract and delegation-plan validation.
- Existing requirement brief, progress, verification, and archive conventions.

## Open Questions

- None. The inventory supplies the review boundary and existing inline fallback
  supplies the unavailable-subagent behavior.

## Documentation Synchronization

### Initial review - 2026-07-21

**Handoff resolution:** `inline-fallback`. A bounded
`agent-requirements-curator` delegation was started, but it did not return a
complete handoff within the coordination window; the orchestrator completed the
same documentation-only scope without extending it to architecture,
implementation, or verification work.

| Document | Result | Justification |
|---|---|---|
| `docs/documentation-inventory.md` | updated | Created the focused review inventory and ownership boundary. |
| `docs/project-context.md` | updated | Added the durable documentation-synchronization workflow and architecture path. |
| `docs/README.md` | updated | Linked the new maintained documentation inventory. |
| `docs/requirements/synchronize-documentation-for-new-features/brief.md` | updated | Created REQ-008 and its persistent ledger. |
| `docs/requirements/index.md` | updated | Registered REQ-008. |
| `README.md` | no-change | The public template overview does not need this internal workflow detail. |
| `harness-docs/*.md` | no-change | The proposed OpenSpec change will update the relevant workflow guides. |

### Final review rule

The OpenSpec plan for this requirement must include an
`[agent-requirements-curator]` task before final verification. The task reviews
this inventory against the implemented scope and appends its result here.

### Final review - 2026-07-21

| Document | Result | Justification |
|---|---|---|
| `docs/documentation-inventory.md` | updated | Added the existing Harness operator/developer guides to the conditional review scope. |
| `docs/project-context.md` | no-change | The durable workflow and architecture updates from the initial review remain accurate. |
| `docs/README.md` | no-change | It already links the inventory introduced for this workflow. |
| `docs/requirements/README.md` | updated | Documents the initial and final curator review requirements for briefs. |
| `docs/requirements/synchronize-documentation-for-new-features/brief.md` | updated | Recorded the completed final review and the implemented workflow impact. |
| `docs/requirements/index.md` | no-change | REQ-008 remains correctly linked and `ready-for-openspec` until native archive. |
| `README.md` | updated | The repository operating model now directs new undocumented capabilities through curator synchronization. |
| `harness-docs/*.md` | updated | Developer and operator guides now explain the isolated curator handoffs and timing before verification. |
| `docs/guides/**/*.md` and `docs/operations/**/*.md` | not-applicable | These maintained-document patterns do not exist in this repository. |

**Handoff resolution:** `inline-fallback`. A bounded curator subagent was
retried for this final review but did not return a complete handoff within the
coordination window. The orchestrator completed only the documented curator
scope and did not perform verification or archive work.

## Suggested OpenSpec Change

- **Change ID:** `archive/2026-07-21-delegate-documentation-synchronization`
- **Affected domain/spec:** `workflow`
- **Notes for proposal/spec/design/tasks:** Update workflow governance and local
  OpenSpec guidance; keep curator work bounded to documentation and include a
  pre-verification curator-owned reconciliation task.

## Implementation Record

- **Archived:** 2026-07-21
- **Accepted spec:** `openspec/specs/workflow/spec.md`
- **Evidence:** `pnpm verify` PASS and strict archive readiness passed before
  native archive.
