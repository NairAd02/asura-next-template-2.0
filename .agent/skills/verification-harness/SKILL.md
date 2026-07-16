---
name: verification-harness
description: Load at the end of every implementation to run the final specs, unit/component, typecheck, lint, and build gates, persist evidence, and check archive readiness.
---

# Verification Harness

## Native Preflight

Before verification, run:

openspec status --change <change-id> --json

Current OpenSpec versions do not expose instructions verify. Status is the native authority; do not create a second state file.

Read proposal, specs, design, tasks, apply-progress.md, and the linked requirement brief when one applies. Reconcile progress with tasks.md before running gates.

For work explicitly classified `no-change`, skip change status and do not create `apply-progress.md` or `verify-report.md`. Run only applicable checks and return command evidence in the handoff/final result.

## Final Gates

Run in this order through the repository scripts:

1. pnpm validate:specs
2. pnpm test:unit:run
3. pnpm typecheck
4. pnpm lint
5. pnpm build

The aggregate command is:

pnpm verify

Typecheck must remain tsc --noEmit --incremental false. Build must not suppress TypeScript errors.

`pnpm verify:fast` is provisional executor feedback only and is never final or archive evidence.

## Evidence

Create openspec/changes/<change-id>/verify-report.md. The report SHALL contain:

- conformance against proposal, specs, design, and tasks
- each gate command, exit code, duration, and concise summary
- relevant warnings
- PASS or FAIL verdict
- report invalidation rule

A warning is recorded but does not make a successful command FAIL unless it violates the change contract.

After all implementation and verification task checkboxes are complete, set the progress snapshot to `ready-for-archive`, generate snapshot JSON with `node scripts/validate-harness.mjs --snapshot <change-id>`, and place it under `## Evidence Snapshot` in the PASS report. Any covered edit requires the final command and snapshot again.

If a gate fails, record FAIL, identify the cause, and return a blocked handoff. Do not declare completion.

## Archive Readiness

Before archive, run:

openspec status --change <change-id> --json

Archive is blocked when any condition is true:

- tasks.md has unchecked tasks
- apply-progress.md is absent or disagrees with tasks.md
- verify-report.md is missing or verdict is not PASS
- implementation or change artifacts changed after the report
- a linked requirement brief or requirements index cannot be updated coherently

For behavior work, update the linked brief and index to implemented with the archived change reference. For an explicitly requirementless technical change, record no requirement as applicable.

Run `node scripts/validate-harness.mjs --archive-ready <change-id>` before native archive. PASS has no exception for failures that existed before the change.

## Handoff

Use .agent/contracts/phase-handoff.md. The verifier writes only verification artifacts and task/progress state within its allowed roots; implementation fixes return to the owning role.
