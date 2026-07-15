---
name: verification-harness
description: Load at the end of every implementation to run the four gates, persist evidence, and check archive readiness.
---

# Verification Harness

## Native Preflight

Before verification, run:

openspec status --change <change-id> --json

Current OpenSpec versions do not expose instructions verify. Status is the native authority; do not create a second state file.

Read proposal, specs, design, tasks, apply-progress.md, and the linked requirement brief when one applies. Reconcile progress with tasks.md before running gates.

## Four Gates

Run in this order through the repository scripts:

1. pnpm validate:specs
2. pnpm typecheck
3. pnpm lint
4. pnpm build

The aggregate command is:

pnpm verify

Typecheck must remain tsc --noEmit --incremental false. Build must not suppress TypeScript errors.

## Evidence

Create openspec/changes/<change-id>/verify-report.md. The report SHALL contain:

- conformance against proposal, specs, design, and tasks
- each gate command, exit code, and concise summary
- relevant warnings
- PASS or FAIL verdict
- report invalidation rule

A warning is recorded but does not make a successful command FAIL unless it violates the change contract.

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

## Handoff

Use .agent/contracts/phase-handoff.md. The verifier writes only verification artifacts and task/progress state within its allowed roots; implementation fixes return to the owning role.
