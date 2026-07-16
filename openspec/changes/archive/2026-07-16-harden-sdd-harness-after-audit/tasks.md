## 1. Mechanical Harness Validation

- [x] 1.1 Add dependency-free harness validation helpers, repository CLI, and Node negative tests.
- [x] 1.2 Validate exact OpenSpec 1.6.0, safe local-skill markers, unsupported command guidance, and active-change lifecycle invariants.
- [x] 1.3 Add SHA-256 snapshot creation and freshness validation for PASS evidence.
- [x] 1.4 Integrate harness validation into the existing specification gate without adding a top-level gate.

## 2. OpenSpec and Governance Alignment

- [x] 2.1 Harden local propose, apply, sync, and archive skills with the repository integration marker and fail-closed native behavior.
- [x] 2.2 Update SDD, implementation-progress, verification, registry, roles, and handoff guidance for current progress, persisted handoffs, snapshots, no-change, and terminal ordering.
- [x] 2.3 Align root/developer/operator documentation and OpenSpec configuration with supported commands, PASS-only archive, and close-operation task boundaries.
- [x] 2.4 Add the durable audit report and document residual convention-only limitations without editing historical archives.

## 3. Reference Quality Gates

- [x] 3.1 Add a dedicated reference tsconfig and package scripts for application plus reference typecheck/lint under the four top-level gates.
- [x] 3.2 Repair widget NOT_FOUND semantics, types, hooks, server-boundary Zod validation, and localized validation factories.
- [x] 3.3 Implement complete widget desktop table and mobile card reference views and remove placeholder/unused logic.
- [x] 3.4 Correct reference/skill documentation paths and examples so they match the quality-gated implementation.

## 4. Reproducible Baseline

- [x] 4.1 Track pnpm-lock.yaml and preserve the declared pnpm/Node prerequisites.
- [x] 4.2 Replace build-time Google font imports with local system font stacks.
- [x] 4.3 Prepare validated workflow and template-quality delta specs for native archive synchronization.

## 5. Progress and Verification

- [x] 5.1 Create and maintain a current apply-progress.md with cumulative handoff evidence for this change.
- [x] 5.2 Run harness negative tests and record that each invalid fixture fails for the intended invariant.
- [x] 5.3 Run OpenSpec plus harness validation and record the exit code and summary.
- [x] 5.4 Run non-incremental application plus reference TypeScript checks and record the exit code and summary.
- [x] 5.5 Run application plus reference ESLint checks and record the exit code, warnings, and summary.
- [x] 5.6 Run the production build, confirm no Google Fonts fetch, and record the exit code and warnings.
- [x] 5.7 Reconcile every task with current progress and prepare REQ-003/index data for the native close operation.
