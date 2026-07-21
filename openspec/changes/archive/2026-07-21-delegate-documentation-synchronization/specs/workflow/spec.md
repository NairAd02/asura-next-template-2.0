## ADDED Requirements

### Requirement: Delegated Documentation Synchronization

The workflow SHALL isolate documentation synchronization for a new product
capability in a bounded `agent-requirements-curator` handoff and SHALL use the
documentation inventory to determine the maintained documents to review.

#### Scenario: New product intent lacks source documentation

- **GIVEN** a requested product capability is absent from
  `docs/project-context.md` and `docs/requirements/`
- **WHEN** the orchestrator classifies the request for development
- **THEN** it SHALL send `agent-requirements-curator` a documentation-only
  handoff before OpenSpec planning
- **AND** the curator SHALL update applicable source material, create or update
  the brief and index, and record each reviewed document's result and rationale
  in the brief.

#### Scenario: Curator context remains isolated

- **GIVEN** a documentation synchronization handoff is assigned
- **WHEN** `agent-requirements-curator` performs it
- **THEN** it SHALL receive only the feature intent, documentation inventory,
  relevant source material, and explicit documentation roots
- **AND** it SHALL NOT implement code, author executable specifications, verify,
  archive, or redelegate work.

#### Scenario: Product change is reconciled before verification

- **GIVEN** an OpenSpec product change is linked to a requirement brief
- **WHEN** its implementation is ready for final verification
- **THEN** `tasks.md` SHALL contain a preceding
  `[agent-requirements-curator]` documentation-reconciliation task
- **AND** the completed curator handoff SHALL be persisted in
  `apply-progress.md`
- **AND** documentation edits from that review SHALL occur before `pnpm verify`.

## MODIFIED Requirements

### Requirement: Requirements Curation

The system SHALL curate source material into candidate requirement briefs before
creating executable OpenSpec changes when product intent is broad or ambiguous,
and SHALL synchronize applicable maintained documentation before curating a new
product capability that lacks existing source material.

#### Scenario: Curator synchronizes a new capability's source material

- **GIVEN** a user requests a product capability absent from
  `docs/project-context.md` and the requirements index
- **WHEN** requirement discovery is requested
- **THEN** `agent-requirements-curator` SHALL review
  `docs/documentation-inventory.md` and synchronize applicable project
  documentation before creating the requirement brief
- **AND** it SHALL record each reviewed document as `updated`, `no-change`, or
  `not-applicable` with a rationale in the brief.

#### Scenario: Curator extracts a candidate requirement

- **GIVEN** applicable project source material has been synchronized
- **WHEN** requirement discovery is requested
- **THEN** `agent-requirements-curator` SHALL create or update a brief under
  `docs/requirements/`
- **AND** the brief SHALL include a stable ID, source reference, scope,
  out-of-scope notes, flows, constraints, dependencies, open questions,
  suggested OpenSpec change ID, and documentation synchronization record.
