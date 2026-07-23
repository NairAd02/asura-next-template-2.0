---
name: behavior-testing
description: Add focused Vitest unit or component coverage when deterministic behavior changes affect data, services, schemas, URL state, client state, localization, or local component behavior. Use during implementation and verification to select the smallest test layer that proves the changed contract.
---

# Behavior Testing

## Select the Smallest Valuable Layer

- Test pure functions, schemas, services, actions, filters, pagination, and state transitions with Vitest.
- Test local React behavior and regressions with Testing Library in jsdom.

Prefer a few contract-shaped cases over broad permutations. Include the regression that motivated the change and the important branch boundaries; do not add arbitrary coverage targets or snapshots.

## Executor Workflow

1. Map each changed behavior to the cheapest layer that can fail when the contract regresses.
2. Create the test with the production change, within the executor's allowed roots.
3. Reset mutable in-memory stores in `beforeEach` through a module helper. Do not add HTTP endpoints used only by tests.
4. Run the smallest relevant Vitest target while editing, then `pnpm verify:fast` before handoff.
5. Freeze production and test code before final verification. The verifier reports failures to the owning executor and does not repair implementation code.

## Commands and Evidence

- `pnpm test:unit` is the watch-mode authoring loop.
- `pnpm test:unit:run` is the deterministic unit/component gate.
- `pnpm verify:fast` is provisional implementation feedback; it is not archive evidence.
- `pnpm verify` is the single timed final runner for specs/harness,
  unit/component tests, non-incremental typecheck, full lint, and production
  build. Execute it exactly once after implementation is frozen.

Persist the runner's structured commands, exit codes, durations, summaries, and
warnings in `verify-report.md`; do not replay successful gates. Include test
and configuration files in `filesChanged` and the SHA-256 snapshot; exclude
caches and generated runtime artifacts.

## Optional Manual Exploration

An operator may inspect a completed change in a browser for diagnosis or exploratory confidence. This work is outside OpenSpec tasks, `verify-report.md`, PASS criteria, snapshot invalidation, and archive readiness. A discovered deterministic regression belongs in a new iteration with focused automated coverage.
