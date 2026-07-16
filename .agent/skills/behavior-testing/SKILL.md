---
name: behavior-testing
description: Add focused Vitest unit or component coverage and a bounded integrated-browser smoke when a behavior change affects data, services, schemas, URL state, client state, localization, or responsive composition. Use during implementation and verification to select the smallest test layer that proves the changed contract.
---

# Behavior Testing

## Select the Smallest Valuable Layer

- Test pure functions, schemas, services, actions, filters, pagination, and state transitions with Vitest.
- Test local React behavior and regressions with Testing Library in jsdom.
- Use the integrated browser only for composition that the lower layers cannot prove, such as localization wiring, responsive layout, or a critical route-to-action flow.
- Do not repeat deterministic unit or component scenarios in the browser.

Prefer a few contract-shaped cases over broad permutations. Include the regression that motivated the change and the important branch boundaries; do not add arbitrary coverage targets, snapshots, or browser matrices.

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
- `pnpm verify` is the final aggregate for specs/harness, unit/component tests, non-incremental typecheck, full lint, and production build.
- Run a bounded integrated-browser smoke after `pnpm verify` only when the accepted behavior has an integration or visual risk that lower layers cannot express.

Record exact commands, exit codes, durations, warnings, and any browser checklist in `verify-report.md`. Include test and configuration files in `filesChanged` and the SHA-256 snapshot; exclude caches and generated runtime artifacts.

## Browser Guardrail

Define the smoke as a short checklist in the active change before running it. Keep it to the minimum representative locale, viewport, and action flows needed by the accepted contract. Use the browser for diagnosis when a lower-level check fails, but do not turn diagnosis into a mandatory exhaustive traversal.
