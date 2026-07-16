## 1. Accepted Verification Contract

- [x] 1.1 Update the workflow and suppliers contracts so automated `pnpm verify` evidence is the sole required final gate and browser exploration is explicitly out of band.
- [x] 1.2 Preserve the existing deterministic command interface, lightweight dependency policy, SHA-256 snapshot, and fail-closed archive requirements without adding browser tooling.

## 2. Governance and Operator Guidance

- [x] 2.1 Update SDD, behavior-testing, verification, progress, registry, and agent-role guidance to require focused deterministic tests and remove browser-smoke tasks, report fields, and invalidation conditions.
- [x] 2.2 Update repository, developer, and human-operator documentation to describe optional browser diagnosis and automated-only closure consistently.

## 3. Verification and Evidence

- [x] 3.1 Run OpenSpec/harness validation and the complete automated `pnpm verify` gate without launching a browser.
- [x] 3.2 Reconcile task/progress state and confirm the active change can produce fresh automated evidence and pass strict archive-readiness validation without a browser smoke.
