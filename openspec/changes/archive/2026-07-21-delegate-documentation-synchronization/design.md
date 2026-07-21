## Context

The workflow treats `docs/project-context.md` as canonical source material, but
the current curator only extracts a brief after that document is already
updated. New product intent therefore depends on an unstated operator action and
can leave project knowledge behind the implemented behavior. REQ-008 adds a
bounded documentation phase while retaining OpenSpec as the only executable
change-state authority.

## Goals / Non-Goals

**Goals:**

- Delegate source-document synchronization to `agent-requirements-curator`
  before OpenSpec planning for new product capabilities.
- Make the documentation scope explicit, small, and repeatable.
- Persist initial review evidence in the requirement brief and final review
  evidence through the existing owner-tagged-task and handoff mechanisms.
- Keep documentation work out of implementation and verification roles.

**Non-Goals:**

- Add a second lifecycle state machine or semantic archive validator.
- Require documentation curation for no-change technical work.
- Let the curator edit `.agent`, `AGENTS.md`, runtime code, accepted specs, or
  archived evidence.

## Decisions

### Documentation inventory is the review boundary

`docs/documentation-inventory.md` lists always-reviewed documents, conditional
documents, and exclusions. The curator records `updated`, `no-change`, or
`not-applicable` plus a justification in the linked brief. This is chosen over
scanning all Markdown because project documentation remains focused as the
repository grows.

### Initial curation uses a bounded `no-change` handoff

For new product intent absent from project context and the requirement index,
the orchestrator sends the curator the intent, inventory, relevant source
material, and documentation-only roots. The curator updates source material,
creates or updates the brief and index, then returns the existing phase-handoff
shape. The brief ledger is the durable discovery record; no OpenSpec progress
artifact exists before a change is proposed.

### Final reconciliation is a curator-owned planned task

Every product OpenSpec change linked to a brief includes an
`[agent-requirements-curator]` task immediately before verification. It runs
after scope-changing implementation and before `pnpm verify`, so changes are
included in the normal evidence snapshot. The resulting handoff is appended to
`apply-progress.md`, reusing current delegation validation instead of creating
a new archive gate.

### Governance ownership stays separate

The curator owns project documentation roots. The orchestrator owns Harness
governance files (`AGENTS.md`, `.agent/`, OpenSpec config, and local skills)
and coordinates the curator. This prevents the curator from carrying
architecture, code, test, or archive context. If subagents are unavailable,
the existing inline fallback is used with the same roots and an explicit reason.

### Entry guidance makes the path consistent

The bootstrap, SDD skill, registry, curator role, human/developer guides, and
local explore/propose/update/apply guidance all state the same two checkpoints:
initial synchronization before OpenSpec and final reconciliation before
verification. Proposal generation adds the curator task for linked product
briefs; change updates retain it when scope changes.

## Risks / Trade-offs

- [Documentation overhead on small work] -> Trigger initial curation only for
  new product intent and keep conditional entries explicitly scoped.
- [Inventory becomes stale] -> The curator owns inventory review when
  documentation navigation or material changes.
- [Subagent is unavailable] -> Use the documented inline fallback and record
  the concrete availability reason in progress evidence.
- [Final documentation edit invalidates evidence] -> Complete reconciliation
  before `pnpm verify`; any later edit follows the existing freshness rule.

## Migration Plan

1. Add the inventory, brief ledger template, and REQ-008 source documentation.
2. Align workflow governance, local guidance, and human-facing guides.
3. Add the workflow delta and validate the new flow through this change's
   curator-owned final task.
4. Roll back by reverting these documentation and governance files together;
   no data, dependency, or runtime migration is involved.

## Open Questions

- None.
