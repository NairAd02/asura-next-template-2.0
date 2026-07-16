## 1. Planning Contract

- [x] 1.1 [orchestrator] Add the workflow delta spec and planning artifacts for the approval gate.
- [x] 1.2 [orchestrator] Record the implementation approval checkpoint and delegation plan before implementation edits.

## 2. Governance Instructions

- [x] 2.1 [orchestrator] Update root, `.agent`, local OpenSpec skill, and guide instructions to require the Implementation Approval Packet and explicit stop.
- [x] 2.2 [orchestrator] Update implementation-progress guidance with the `approvalCheckpoint` schema and honest validation boundary.

## 3. Mechanical Validation

- [x] 3.1 [agent-verifier] Extend harness validation to reject started changes without a valid approval checkpoint.
- [x] 3.2 [agent-verifier] Update harness validator tests and fixtures for approval checkpoint acceptance and rejection.

## 4. Verification

- [x] 4.1 [agent-verifier] Run the repository verification gates and report PASS or blockers.
