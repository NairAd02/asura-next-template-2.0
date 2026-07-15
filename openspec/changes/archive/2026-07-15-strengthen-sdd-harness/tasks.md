## 1. Bootstrap and Common Contracts

- [x] 1.1 Add a root AGENTS.md that loads the SDD skill and skill registry before classifying work.
- [x] 1.2 Add the shared phase-handoff contract with required input, output, skill-resolution, and no-redelegation fields.
- [x] 1.3 Add the implementation-progress skill for cumulative progress, reconciliation, evidence, and archive readiness.

## 2. Activate the Existing Harness

- [x] 2.1 Update the skill registry with exact progress-skill paths and phase ownership.
- [x] 2.2 Update the SDD skill with task classification, native state preflights, readiness review, inline fallback, and close behavior.
- [x] 2.3 Update the verification skill with PASS or FAIL reports, invalidation, archive gates, and current reproducible commands.
- [x] 2.4 Update orchestrator, architect, curator, data, UI, and verifier roles to use bounded handoffs, allowed roots, progress, and no redelegation.

## 3. Strengthen OpenSpec and Operator Guidance

- [x] 3.1 Enrich openspec/config.yaml with proposal success and rollback criteria, design decision/interface/migration requirements, and small traceable tasks.
- [x] 3.2 Update the human operator guide, .agent README, docs index, and requirements guidance with the active harness flow and technical-task path.
- [x] 3.3 Ensure root and operator documentation state the current OpenSpec instruction limitation for verify and archive without creating alternate state.

## 4. Pilot Progress and Evidence

- [x] 4.1 Create and maintain apply-progress.md while implementing this change.
- [x] 4.2 Demonstrate active-change recovery from native status, tasks, and apply-progress.
- [x] 4.3 Simulate a small documentation-only technical task and record that it does not require a requirement brief.
- [x] 4.4 Re-read all proposed artifacts and verify existence, scope coherence, valid paths, and no blocking questions before approval.

## 5. Verify and Archive

- [x] 5.1 Run openspec doctor --json and record the result.
- [x] 5.2 Run OpenSpec validation and record command, exit code, and summary.
- [x] 5.3 Run non-incremental TypeScript checking and record command, exit code, and summary.
- [x] 5.4 Run ESLint and record command, exit code, warnings, and summary.
- [x] 5.5 Run the Next.js production build and record command, exit code, warnings, and summary.
- [x] 5.6 Reconcile tasks and progress, create a PASS verify-report.md, update REQ-002, and archive the change.

