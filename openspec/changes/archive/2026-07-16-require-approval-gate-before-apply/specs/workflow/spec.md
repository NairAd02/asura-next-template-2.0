## ADDED Requirements

### Requirement: Implementation Approval Gate
The workflow SHALL require an explicit operator approval gate after implementation readiness is reviewed and before the first implementation edit for an OpenSpec change.

#### Scenario: Approval packet is presented before implementation
- **GIVEN** an OpenSpec change has proposal, delta specs, design, and tasks ready for implementation
- **WHEN** the orchestrator completes readiness review
- **THEN** it SHALL present an Implementation Approval Packet containing the change ID, linked requirement status, readiness summary, intended scope, design summary, task execution plan, delegation plan, editable roots, expected file families, risks, open questions, and verification plan
- **AND** it SHALL stop before implementation edits until the operator explicitly approves or requests planning adjustments.

#### Scenario: Operator requests planning adjustments
- **GIVEN** the Implementation Approval Packet has been presented
- **WHEN** the operator requests a scope, design, task, delegation, or verification adjustment
- **THEN** the workflow SHALL update the applicable planning artifacts before implementation
- **AND** it SHALL present the approval packet again before apply proceeds.

#### Scenario: Approval checkpoint is persisted
- **GIVEN** the operator explicitly approves implementation
- **WHEN** apply begins for a started OpenSpec change
- **THEN** `apply-progress.md` SHALL include a `Current Snapshot.approvalCheckpoint` object with schema version, approved status, operator identity, approval source, reviewed artifacts, and packet summary
- **AND** the checkpoint SHALL be created before or with the first implementation edit.

#### Scenario: Started change lacks approval checkpoint
- **GIVEN** an active OpenSpec change has started implementation
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `apply-progress.md` lacks a valid approval checkpoint
- **AND** the failure SHALL identify the missing or malformed approval evidence.

#### Scenario: Mechanical validation remains honest
- **GIVEN** approval checkpoint evidence is present
- **WHEN** harness validation evaluates the change
- **THEN** validation SHALL check the recorded evidence shape
- **AND** it SHALL NOT claim to cryptographically prove that a human approved the chat interaction.

