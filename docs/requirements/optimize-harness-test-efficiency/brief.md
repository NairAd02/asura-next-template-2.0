# Requirement Brief: Optimize Harness Test Efficiency

> **ID:** REQ-005  
> **Status:** implemented  
> **Priority:** high  
> **Source:** user-approved verification optimization plan (2026-07-16); `docs/project-context.md#non-functional-requirements`  
> **OpenSpec change:** `archive/2026-07-16-optimize-harness-test-efficiency`

## Intent

Reduce the verification time and manual browser burden of realistic module changes without weakening the harness's fail-closed evidence, reproducibility, or archive safeguards.

## Actors

- Application data and UI executors writing behavior alongside tests
- Verifier producing reproducible final evidence
- Human operator running the broad release matrix or targeted visual exploration

## Scope

- Add Vitest and Testing Library for unit and component behavior.
- Use the existing integrated browser for one short smoke instead of installing Playwright, Cypress, or another E2E framework.
- Provide fast and final verification commands with a local target below 15 minutes.
- Convert `suppliers` into the executable pilot for focused service, URL, validation, and component coverage.
- Add project governance for test ownership, evidence, generated artifacts, and when manual browser work remains required.
- Update accepted workflow, template-quality, and suppliers evidence contracts through OpenSpec deltas.

## Out of Scope

- Playwright, Cypress, downloaded browser binaries, CI-provider configuration, browser matrices, screenshot-baseline testing, coverage thresholds, or a second state engine.
- Replacing OpenSpec validation, non-incremental final typecheck, full lint, production build, SHA-256 evidence, or strict archive readiness.
- Adding a test-only HTTP reset endpoint or durable supplier persistence.

## Candidate Flows

### Fast implementation feedback

1. An executor adds or changes application behavior and its colocated tests.
2. The executor runs unit tests, incremental app typecheck, and cached lint through `pnpm verify:fast`.
3. Failures are corrected without repeatedly running the final build and browser matrix.

### Final change verification

1. Implementation and test tasks are frozen and reconciled.
2. `pnpm verify` runs specs/harness, unit/component tests, non-incremental typecheck, full lint, and production build sequentially.
3. The verifier records exact command results and durations, then generates the normal fresh SHA-256 evidence.

### Short browser confidence check

1. After `pnpm verify`, the verifier uses the integrated browser already available in the agent runtime.
2. The verifier checks one EN desktop flow, ES labels/validation, and a mobile card/action.
3. Deterministic filter and CRUD combinations remain covered by Vitest instead of a repeated browser matrix.

## Rules and Constraints

- `pnpm verify` must complete in less than 15 minutes on the current development machine.
- `pnpm verify:fast` should target approximately 90 seconds after caches are warm.
- Final typecheck remains non-incremental and final lint remains complete; caches are confined to the fast tier.
- Integrated-browser work is bounded to explicit integration/visual risk and SHALL NOT duplicate deterministic unit/component coverage.
- Test source and configuration are covered by progress and evidence snapshots; generated reports, traces, screenshots, videos, and caches are excluded.
- Executors own behavior tests for their implementation roots; the verifier does not implement fixes.

## Dependencies

- REQ-003 hardened harness and its lifecycle validator.
- REQ-004 suppliers pilot and its accepted behavior.
- Next.js 16, React 19, TypeScript, pnpm, and OpenSpec 1.6 already used by the repository.
- New approved development dependencies: Vitest, Testing Library, jsdom, and supporting Vite adapters.

## Open Questions

- None. The user explicitly chose simplicity over E2E framework robustness and approved Vitest plus a short integrated-browser smoke.

## Suggested OpenSpec Change

- **Change ID:** `optimize-harness-test-efficiency`
- **Affected domain/spec:** `workflow`, `template-quality-baseline`, `suppliers`
- **Notes for proposal/spec/design/tasks:** preserve final fail-closed evidence while making automated behavior the default and manual browser verification risk-based.
