# Delta for Workflow

## ADDED Requirements

### Requirement: Hybrid OpenSpec and `.agent` Workflow

The system SHALL use OpenSpec as the executable change/spec layer while using
`.agent` as the project-specific technical governance layer.

#### Scenario: Candidate requirement becomes an OpenSpec change

- GIVEN project source material exists in `docs/project-context.md`
- AND a curated requirement brief exists under `docs/requirements/`
- WHEN the user chooses that requirement for development
- THEN the AI SHALL create or update an OpenSpec change under `openspec/changes/<change-id>/`
- AND the change SHALL contain proposal, delta specs, design, and tasks.

#### Scenario: Implementation follows OpenSpec and `.agent`

- GIVEN an active OpenSpec change has tasks
- WHEN implementation begins
- THEN the AI SHALL follow `tasks.md`
- AND apply the relevant `.agent` skills for architecture, data, UI, i18n, and verification.

#### Scenario: Accepted behavior is archived

- GIVEN the implementation is complete
- WHEN verification passes or preexisting failures are documented
- THEN the OpenSpec change SHALL be synced or archived
- AND accepted behavior SHALL live under `openspec/specs/`.

### Requirement: Requirements Curation

The system SHALL curate source material into candidate requirement briefs before
creating executable OpenSpec changes when product intent is broad or ambiguous.

#### Scenario: Curator extracts a candidate requirement

- GIVEN the user has updated `docs/project-context.md`
- WHEN requirement discovery is requested
- THEN `agent-requirements-curator` SHALL create or update a brief under `docs/requirements/`
- AND the brief SHALL include a stable ID, source reference, scope, out-of-scope notes, flows, constraints, dependencies, open questions, and suggested OpenSpec change ID.

### Requirement: OpenSpec Is the Only Executable Spec Layer

The system SHALL use OpenSpec as the only executable spec layer for new work.

#### Scenario: New feature work starts

- GIVEN a new product behavior change is requested
- WHEN the user wants to develop it
- THEN the AI SHALL use `docs/project-context.md`, `docs/requirements/`, and OpenSpec
- AND SHALL NOT create executable specs outside OpenSpec.
