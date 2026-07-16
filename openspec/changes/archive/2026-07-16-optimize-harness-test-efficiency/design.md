## Context

REQ-005 follows the suppliers pilot. The current `pnpm verify` takes about 160 seconds for specs/harness, non-incremental typecheck, lint, and build but contains no application behavior tests. The original pilot therefore pushed almost every scenario into a long integrated-browser pass.

The first implementation attempt confirmed that full E2E frameworks conflict with the user's simplicity and installation-speed goal: both Playwright and Cypress require additional browser/application binaries. The approved revision keeps Vitest for high-value deterministic regressions and reduces browser work to one short integrated-browser smoke using tooling already available to the agent.

## Goals / Non-Goals

**Goals:**

- Add fast unit/component feedback and keep final local verification below 15 minutes.
- Catch the original pagination and `DataTable` regressions without browser traversal.
- Retain a small real-browser confidence check for runtime, localization, and responsive composition.
- Keep governance and evidence understandable enough that future agents do not over-test routine changes.

**Non-Goals:**

- Playwright, Cypress, another E2E framework, downloaded browser binaries, CI, browser matrices, visual snapshots, coverage thresholds, test-only routes, or durable persistence.
- Removing final non-incremental typecheck, full lint, production build, snapshot freshness, or strict archive readiness.

## Decisions

### 1. Keep only fast and final command tiers

`verify:fast` runs a single Vitest pass, incremental application TypeScript with its build info under `.cache/`, and cached application/reference lint. The final `verify` runs OpenSpec/harness validation, Vitest, non-incremental application/reference TypeScript, full application/reference lint, and `next build` sequentially.

The browser smoke is a short verifier task after the command, not another package script. This makes `pnpm verify` deterministic and avoids server/process orchestration.

Alternative: retain `verify:static`, `verify:full`, and an E2E runner. Rejected as unnecessary robustness and installation cost.

### 2. Vitest owns deterministic behavior

Use Vitest with jsdom, Testing Library, React plugin, and TypeScript path resolution. Alias `server-only` to a zero-effect test shim so Node can exercise server services without weakening the production boundary. Add a supplier store reset export used only by tests through module imports.

Cover schemas/actions, filter conversion/sanitation, list search/sort/pagination, normalized CRUD/error behavior, and deterministic reset. One `DataTable` component test rerenders with a newly allocated initial visibility object, checks localStorage-backed visibility, and fails on maximum-depth console errors.

### 3. Integrated browser is deliberately small

After `pnpm verify`, the verifier starts the existing application through the normal repository command and performs only three checks in the integrated browser:

1. EN desktop: route renders, explicit inactive filter persists through refresh, and one created record can be viewed and deleted.
2. ES desktop: localized labels and required-field validation render.
3. Mobile 390x844: cards are visible, the desktop table is hidden, and a card detail action opens.

No repeated smoke, full locale/viewport matrix, restart-reset traversal, or exhaustive CRUD script is required. The deterministic parts live in Vitest.

### 4. Executors own tests; verifier owns evidence

Add `.agent/skills/behavior-testing/SKILL.md` and register it for behavior-changing data/UI work and verification. Executors add the closest valuable unit/component test; the verifier reports source failures rather than fixes them. Manual browser tasks are required only when the change has integration or visual risk.

`verify-report.md` records five command categories—specs/harness, unit/component, typecheck, lint, and build—plus a concise optional browser-smoke section and durations. Test source/config belongs in `filesChanged`; `.cache/` and generated test reports are excluded.

### 5. Supplier production behavior stays stable

Only the mock store gains a reset helper and test/config surfaces are added. Routes, service responses, UI, persistence semantics, and messages remain unchanged.

## Interfaces

- `pnpm test:unit` -> Vitest watch mode for humans.
- `pnpm test:unit:run` -> deterministic single run.
- `pnpm typecheck:fast` -> incremental application typecheck using `.cache/`.
- `pnpm lint:fast` -> cached application/reference lint.
- `pnpm verify:fast` -> unit/component tests plus fast typecheck and lint.
- `pnpm verify` -> specs/harness, unit/component, final typecheck, full lint, and build.

## Risks / Trade-offs

- [Manual smoke is not fully reproducible] -> Keep it to three explicit assertions and use it only for boundaries not covered efficiently by Vitest.
- [Component mocks hide Next.js integration] -> Retain the short real-browser smoke.
- [Fast caches conceal stale results] -> Use caches only in `verify:fast`; final typecheck/lint remain uncached/full.
- [New dependencies still require package resolution] -> Keep the list to Vitest, jsdom, Testing Library, and required Vite adapters; install no browser package.
- [Build rewrites `next-env.d.ts`] -> Check the worktree after final build and restore only generated drift before evidence.

## Migration Plan

1. Install the lightweight Vitest stack and add configs, ignores, and command scripts.
2. Add the supplier reset helper, focused unit tests, and one `DataTable` component regression test.
3. Add and validate the behavior-testing skill; update roles, registry, verification guidance, human guide, and validator expectations.
4. Run `verify:fast` twice, timed `verify`, and the three-check integrated-browser smoke.
5. Reconcile tasks/progress and create normal PASS evidence plus strict archive readiness.

Rollback reverts those dependencies, tests, scripts, skill, and governance/spec deltas. No production migration is required.

## Responsibility and Skills

- Requirements/architecture inline: `.agent/skills/requirements-curation/SKILL.md`, `.agent/skills/spec-driven-development/SKILL.md`.
- Test infrastructure/governance inline: new `.agent/skills/behavior-testing/SKILL.md`, `.agent/skills/implementation-progress/SKILL.md`.
- Supplier data tests/reset inline: `.agent/skills/data-layer/SKILL.md`, behavior-testing, implementation-progress.
- Verification inline: `.agent/skills/verification-harness/SKILL.md`, behavior-testing, implementation-progress.
- All summaries use `.agent/contracts/phase-handoff.md`; executors do not redelegate.

## Open Questions

None.
