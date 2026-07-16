## Why

REQ-005 responds to the suppliers pilot, where a realistic module took roughly two hours largely because almost all behavioral confidence depended on long integrated-browser passes and repeated correction cycles. The harness needs fast deterministic feedback during implementation and a much shorter final browser check without adding heavy browser automation.

Driving requirement: `docs/requirements/optimize-harness-test-efficiency/brief.md` (REQ-005).

## What Changes

- Add Vitest, Testing Library, jsdom, and supporting Vite adapters for focused unit and component tests.
- Add only `verify:fast` and an expanded `verify` command while preserving non-incremental final typecheck, full lint, production build, fresh SHA-256 evidence, and strict archive readiness.
- Retrofit suppliers with deterministic tests for filters, validation, CRUD, pagination, and `DataTable` stability.
- Keep one short integrated-browser smoke for EN desktop, ES localization, and mobile layout/action evidence without installing an E2E framework or browser binary.
- Add a behavior-testing skill and update role, registry, progress, verification, guide, and accepted-spec language so executors own tests and manual browser work becomes risk-based.
- Record exact command durations and require `pnpm verify` to finish below 15 minutes on the current development machine.

## Capabilities

### New Capabilities

None. The testing facilities are part of the existing development workflow and template-quality contract.

### Modified Capabilities

- `workflow`: Replace mandatory broad manual-browser evidence with focused automated tests, explicit test ownership, and a bounded risk-based browser smoke.
- `template-quality-baseline`: Expand the reproducible verification interface from four static gates to unit/component tests plus the existing static gates.
- `suppliers`: Preserve accepted behavior while replacing the exhaustive browser matrix with focused Vitest coverage and a short integrated-browser smoke.

## Impact

- **Dependencies:** new development-only Vitest, Vite, Testing Library, and jsdom packages; no Cypress, Playwright, or downloaded browser binary.
- **Commands/configuration:** package scripts, Vitest setup/config, generated-output ignores, and TypeScript test exclusions where required.
- **Application/tests:** suppliers store reset helper used only through module imports and focused unit/component suites; no test-only route or runtime dependency.
- **Governance:** new behavior-testing skill plus updates to registry, roles, SDD/progress/verification policies, workflow documentation, harness validator expectations, and accepted OpenSpec contracts.
- **Compatibility:** `pnpm verify` remains the default final command and gains Vitest; the integrated-browser smoke stays a verifier task outside the command. No application API, route, database, or production deployment changes.

## Success Criteria

- Warm `pnpm verify:fast` targets approximately 90 seconds and the final `pnpm verify` completes below 15 minutes on the same machine.
- Unit/component tests fail when either the out-of-range pagination regression or unstable `DataTable` visibility dependency is reintroduced.
- A short integrated-browser smoke covers EN desktop CRUD/filter persistence, ES localization, and mobile card/action behavior once after `pnpm verify`.
- OpenSpec validation, strict lifecycle validation, fresh evidence snapshot, and archive readiness remain fail-closed.

## Non-Goals

- Cypress, Playwright, any installed E2E framework or browser binary, CI configuration, browser matrices, screenshot baselines, coverage thresholds, database persistence, or test-only HTTP endpoints.
- Removing final non-incremental typecheck, complete lint, production build, report invalidation, or SHA-256 snapshot requirements.

## Dependencies and Open Questions

- Depends on REQ-003 and REQ-004 accepted workflow/suppliers behavior and on installing the approved lightweight Vitest development packages.
- Open questions: none; the user explicitly replaced browser-framework automation with a simpler Vitest plus integrated-browser smoke approach.

## Rollback Strategy

Revert the test dependencies, configuration, suites, package scripts, behavior-testing skill, and governance/spec deltas. Restore the prior four-gate `pnpm verify`; no production data or schema migration needs rollback.
