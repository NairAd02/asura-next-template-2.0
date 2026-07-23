---
name: verification-harness
description: Run risk-proportional checks and the single authoritative final runner, then persist PASS/FAIL and snapshot evidence.
---

# Verification Harness

## Preflight

For a change, run `openspec status --change <id> --json`; OpenSpec 1.6 has no
instructions verify artifact. Read and reconcile proposal, specs, design,
tasks, schema-v3 progress, approval digest, and linked brief when applicable.
Check accepted/delta `MODIFIED` identities before expensive gates.

For `no-change`, cite the preserved accepted contract/internal scope, skip
change state/progress/report, and select affected checks: docs coherence;
harness fixtures/validation; focused tests plus applicable typecheck/lint for a
repair; build only for route/build/dependency/configuration risk.
`standard-change` uses focused coverage and final gates. `high-risk` adds
applicable independent boundaries and risk-specific evidence.

## Final runner

Freeze implementation first. Execute exactly one:

`pnpm verify`

The dependency-free runner streams and times these gates once, in order, and
fails fast:

1. `pnpm validate:specs`
2. `pnpm test:unit:run`
3. `pnpm typecheck`
4. `pnpm lint`
5. `pnpm build`

`pnpm verify:fast` is provisional only. Do not replay successful final gates
to manufacture evidence. A failing verifier reports the failure and does not
repair implementation.

## Evidence

Write `verify-report.md` with conformance, warnings, verdict, and the exact
runner JSON under `## Verification Run`. PASS requires schema
`HARNESS_VERIFY_RESULT_V1`, aggregate duration, and five ordered passed gates
with zero exit codes, durations, and summaries.

Finalize the verification task and schema-v3 progress before generating:

`node scripts/validate-harness.mjs --snapshot <change-id>`

Place it under `## Evidence Snapshot`; any covered edit invalidates both final
evidence and requires a new runner invocation.

Run native status and strict readiness:

`node scripts/validate-harness.mjs --archive-ready <change-id>`

Unchecked tasks, unreconciled progress, stale approval/evidence, incompatible
deltas, missing linked documentation outcome, or any failed gate blocks
archive. No confirmation or pre-existing failure overrides this.

Return the structured phase-handoff output. Archive and post-archive
requirement updates remain orchestrator work.
