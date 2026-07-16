## Why

The current harness requires a manual integrated-browser smoke after otherwise deterministic verification, even though the final command already completes the automated suite, typecheck, lint, and production build in about 80 seconds. That extra gate slows routine changes and makes archive readiness depend on non-reproducible agent browser work.

Driving requirement: none. This is a requirementless technical governance change; the archived REQ-005 record remains historical and is not modified.

## What Changes

- Make `pnpm verify` and its automated evidence the only mandatory final verification and archive gate.
- Remove browser-smoke requirements from accepted workflow and supplier contracts, verification guidance, agent roles, and operator documentation.
- Keep focused Vitest/Testing Library coverage mandatory for deterministic behavior, while allowing human browser exploration only as optional diagnosis outside OpenSpec tasks and archive evidence.
- Preserve fail-closed snapshots, strict archive readiness, the existing deterministic command composition, and the lightweight no-E2E-dependency profile.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow`: Replace the conditional browser-smoke close requirement with automated-only final evidence.
- `suppliers`: Remove the supplier-specific browser smoke from its accepted verification contract while retaining deterministic Vitest evidence.

## Impact

- **Governance and documentation:** `.agent` skills, roles, registry wording, repository README, and developer/operator guides.
- **Accepted contracts:** workflow and suppliers OpenSpec delta specifications.
- **Verification interface:** no package scripts, dependencies, Vitest configuration, or harness-validator behavior change; `pnpm verify` remains the final command.
- **Residual risk:** manual browser exploration may still discover real-runtime responsive, hydration, or provider-wiring issues, but it is not required for PASS or archive.

## Success Criteria

- `pnpm verify` is the sole required final verification command in accepted specs and active guidance.
- PASS evidence, snapshot invalidation, and archive readiness have no browser-smoke prerequisite.
- Deterministic changed behavior continues to require focused Vitest or Testing Library coverage.
- `pnpm validate:specs` and `pnpm verify` pass without opening a browser or changing the lightweight dependency profile.

## Non-Goals

- Adding browser automation, E2E dependencies, coverage thresholds, CI configuration, or visual snapshot testing.
- Relaxing OpenSpec validation, final non-incremental typechecking, full lint, production build, SHA-256 evidence, or fail-closed archive readiness.

## Dependencies and Open Questions

- Depends on the existing Vitest-based verification setup from archived `optimize-harness-test-efficiency`.
- Open questions: none. Human browser exploration is explicitly optional and outside the archive workflow.

## Rollback Strategy

Restore the previous workflow/suppliers requirements and matching guidance that select a bounded browser smoke after `pnpm verify`. No production data, schema, or dependency rollback is required.
