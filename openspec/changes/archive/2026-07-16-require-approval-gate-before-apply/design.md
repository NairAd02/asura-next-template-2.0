## Context

The accepted workflow already separates readiness, implementation, verification, and archive. It also mentions operator approval before apply, but the operational instructions leave room for an agent to move from "readiness looks coherent" into implementation without presenting a final plan or recording approval evidence.

The goal is to make the human approval point behave like a proper phase gate while staying honest about what can and cannot be mechanically proven from repository files.

## Goals / Non-Goals

**Goals:**

- Require agents to show an Implementation Approval Packet after readiness review and before implementation edits.
- Require explicit operator approval before apply can start.
- Persist approval evidence in `apply-progress.md` so started changes are auditable.
- Validate the shape of that evidence with the existing dependency-free harness validator.
- Keep the model lightweight enough that small changes do not become ceremony-heavy.

**Non-Goals:**

- Cryptographically proving that a human approved the change in chat.
- Adding a new OpenSpec phase or alternate state engine.
- Blocking planning artifact creation; the gate applies before implementation edits.
- Changing product runtime behavior or adding dependencies.

## Decisions

### Approval Packet as Conversational Gate

Before the first implementation edit, the orchestrator presents a compact packet containing:

- change ID and linked requirement status
- readiness summary
- intended scope and non-goals
- design summary
- task execution plan
- delegation plan and editable roots
- expected files or file families
- risks, open questions, and verification plan

The agent then stops. If the operator asks for changes, planning artifacts are updated before the gate is presented again. If the operator approves explicitly, apply may proceed.

Alternative considered: rely only on `proposal.md`, `design.md`, and `tasks.md`. Rejected because the operator would still need to infer the execution plan from multiple files, and agents could skip the explicit pause.

### Durable `approvalCheckpoint`

`apply-progress.md` gains an `approvalCheckpoint` object under `Current Snapshot`:

```json
{
  "schemaVersion": 1,
  "status": "approved",
  "approvedBy": "human-operator",
  "approvedAt": "2026-07-16",
  "approvalSource": "chat",
  "packetSummary": "Implementation Approval Packet reviewed and approved before edits.",
  "artifactsReviewed": ["proposal.md", "design.md", "tasks.md", "specs/workflow/spec.md"]
}
```

The validator checks that the object exists for any started OpenSpec change, uses schema version 1, has status `approved`, identifies a human operator, lists reviewed artifacts, and records a non-empty packet summary.

Alternative considered: create a separate `approval.md`. Rejected because `apply-progress.md` already owns cumulative implementation evidence and is already parsed by the validator.

### Validation Boundaries

Mechanical validation can prove that approval evidence was recorded before archive and during continuous validation after implementation starts. It cannot prove the chat event itself. Guidance will state this limitation clearly to avoid false confidence.

### Delegation

This change touches orchestrator governance and verifier-owned validation evidence. Implementation is performed with owner-tagged tasks and a persisted delegation plan. Because subagents are available in this runtime, final verification is delegated to the verifier role rather than silently done in the orchestrator thread.

## Risks / Trade-offs

- [Risk] Agents may fabricate approval text in `apply-progress.md`. -> Mitigation: require explicit instruction text in the harness and document that the validator checks evidence shape, not human honesty.
- [Risk] The approval packet becomes too long. -> Mitigation: keep the required packet fields compact and allow summaries rather than full artifact duplication.
- [Risk] Existing active changes without approval evidence fail validation once implementation starts. -> Mitigation: the change starts from no active changes today; future active changes must add the checkpoint when resumed before edits continue.
- [Risk] The validator rejects legitimate work when `artifactsReviewed` paths are slightly different. -> Mitigation: validate shape and safe non-empty strings, not exact path existence for glob-like artifact references.

## Migration Plan

1. Add the workflow delta spec.
2. Update root and `.agent` governance instructions.
3. Update local OpenSpec propose/apply guidance.
4. Extend `apply-progress.md` schema guidance.
5. Extend dependency-free harness validation and tests.
6. Verify with `pnpm verify`.

Rollback is a straight revert of this change's governance, spec, validator, and test edits.

## Open Questions

None. The operator approved proceeding with the harness adjustment on 2026-07-16.

