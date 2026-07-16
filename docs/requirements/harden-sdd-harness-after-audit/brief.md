# Requirement Brief: Harden the SDD Harness After Audit

> **ID:** REQ-003  
> **Status:** implemented  
> **Priority:** high  
> **Source:** `docs/project-context.md#functional-requirements`, `docs/project-context.md#proposed-architecture`, and user-approved harness audit plan (2026-07-15)  
> **OpenSpec change:** `archive/2026-07-16-harden-sdd-harness-after-audit`

## Intent

Make the hybrid `docs -> OpenSpec -> .agent -> implementation -> verification -> archive` workflow enforce the guarantees it documents. Close the contradictions found by the post-pilot audit, make invalid close/archive states fail mechanically where practical, and bring the maintained widget reference and local environment into the same reproducible quality gates as the application.

## Actors

- Human operator
- Orchestrator
- Requirements curator
- Architect
- Data and UI implementers
- Verifier
- Maintainer updating the local OpenSpec integration

## Scope

- Align the local OpenSpec propose, apply, and archive skills with requirement classification, readiness checks, exact-skill handoffs, cumulative progress, verification evidence, and the native OpenSpec archive command.
- Detect when an OpenSpec update has overwritten the repository-specific skill integration.
- Reconcile the written lifecycle contract so apply, verify, no-change work, and archive have one unambiguous sequence.
- Add a dependency-free harness validator that checks the exact supported OpenSpec version, active-change artifacts, tasks/progress reconciliation, PASS evidence, evidence freshness, and safe local skill integration.
- Add automated negative cases proving that incomplete tasks, missing progress, failed or stale verification, and an unsafe archive skill are rejected.
- Include the widget reference module in explicit typecheck and lint gates and complete it as a trustworthy implementation example.
- Ensure the widget reference demonstrates server-boundary validation, `NOT_FOUND` handling, complete responsive views, and internationalized validation and visible text.
- Make dependency resolution and builds reproducible by versioning the pnpm lockfile and removing build-time Google Fonts downloads.
- Retain four top-level verification gates covering specifications plus harness validation, application plus reference typechecking, application plus reference linting, and production build.
- Document audit findings and clearly identify safeguards that remain conventions rather than mechanically enforceable controls.

## Out of Scope

- Rewriting historical archived changes or their inconsistent evidence.
- Replacing OpenSpec as the executable change and accepted-spec authority.
- Adding a second state engine, package dependency, test framework, browser automation framework, or database.
- Automatically proving the semantic quality of a proposal, design, handoff, implementation, or human approval.
- Making delegation, role boundaries, or honest evidence collection fully enforceable outside the capabilities of the running agent environment.
- Changing unrelated application behavior or introducing the suppliers pilot in this change.

## Candidate Flows

### Flow 1 - Prepare and apply a behavior change

1. The orchestrator classifies the request and curates a requirement when applicable.
2. Propose creates the required OpenSpec artifacts and links the requirement context.
3. Before implementation, the orchestrator checks native OpenSpec status and apply instructions, rereads the artifacts, resolves exact skills, and establishes bounded handoffs.
4. Implementers follow `tasks.md` and cumulatively reconcile their work in `apply-progress.md`.

### Flow 2 - Verify and archive a completed change

1. All implementable and verifiable tasks and progress are finalized.
2. The verifier runs the four gates and records a PASS report with a freshness snapshot.
3. Archive preflight rejects incomplete artifacts, task/progress mismatches, missing or failed evidence, and stale evidence.
4. The orchestrator invokes the native OpenSpec archive command, updates the linked requirement and index, and validates accepted specs after archive.

### Flow 3 - Reject an invalid close state

1. A change contains pending tasks, absent progress, a FAIL report, stale evidence, or unsafe local archive integration.
2. The harness validator identifies the exact violated invariant.
3. Verification or archive stops until the invariant is corrected and fresh evidence is produced.

### Flow 4 - Verify work that needs no OpenSpec change

1. The entry point classifies internal documentation, refactor, or other non-contract work as `no-change`.
2. The applicable technical checks run without inventing OpenSpec status, progress, or verification artifacts.
3. The result is reported through the normal task handoff rather than an artificial change lifecycle.

## Rules and Constraints

- OpenSpec 1.6.0 is the exact supported global CLI prerequisite and remains the only executable change-state authority.
- `openspec instructions apply` is used only before implementation; native `openspec status` is the preflight before verification and archive.
- Archive requires complete artifacts and tasks, reconciled progress, and a fresh PASS report. Pre-existing failures do not permit an override.
- Archive must use `openspec archive <change-id> --yes --json`; manual directory creation or movement and confirmation-based bypasses are prohibited.
- `tasks.md` covers implementable and verifiable work, not report creation or the archive filesystem movement itself.
- Evidence freshness is represented by a SHA-256 snapshot of the implementation and change artifacts covered by verification.
- The validator and its negative tests use native Node.js facilities and add no package dependency.
- The widget reference is quality-gated but remains reference material, not an executable specification.
- Builds must not depend on downloading Google Fonts.
- `pnpm-lock.yaml` must be versioned.
- Some controls remain conventions: agents can still ignore instructions, provide low-quality handoffs, or fabricate claims; automation can validate structure, reconciliation, commands, and freshness, but cannot establish intent or truth on its own.

## Dependencies

- REQ-001 / archived `integrate-openspec-agent-workflow` baseline.
- REQ-002 / archived `strengthen-sdd-harness` operating contracts.
- Existing `.agent` skills, handoff contract, widget reference, and verification scripts.
- Global OpenSpec CLI 1.6.0 and the repository's supported Node.js and pnpm environment.

## Open Questions

- None. The audit plan, enforcement boundary, supported CLI version, gate composition, and archive policy were approved on 2026-07-15.

## Suggested OpenSpec Change

- **Change ID:** `harden-sdd-harness-after-audit`
- **Affected domain/spec:** `workflow`
- **Notes for proposal/spec/design/tasks:** Treat the audit findings as corrections to the existing workflow contract. Specify mechanically testable preflights separately from human/agent conventions, preserve historical archives, and finish with a clean four-gate verification before native archive.
