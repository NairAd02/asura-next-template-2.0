## ADDED Requirements

### Requirement: Delegation Gate Before Implementation

The workflow SHALL require the orchestrator to decide and record specialized
role ownership before implementation starts for an OpenSpec change.

#### Scenario: Mandatory bootstrap loads the orchestrator role

- **WHEN** a task enters the repository harness
- **THEN** the entry point SHALL read the SDD skill, skill registry, and
  orchestrator role profile before classification or implementation work
- **AND** the orchestrator SHALL resolve specialized roles from the registry
  before assigning implementation work.

#### Scenario: Multi-role change starts implementation

- **GIVEN** an active OpenSpec change has implementation tasks that touch more
  than one specialized owner, both data and UI roots, visible text plus behavior,
  a new module workflow, or final verification
- **WHEN** implementation is about to begin
- **THEN** the orchestrator SHALL create a delegation plan with required roles,
  bounded tasks, task IDs, allowed roots, exact skill paths, and resolution
  method for each role
- **AND** each required role SHALL receive a phase handoff or an explicit
  inline-fallback handoff before that role's task is completed.

#### Scenario: Simple single-role work remains lightweight

- **GIVEN** an active OpenSpec change has only one specialized owner and no
  cross-phase implementation or verification handoff is required yet
- **WHEN** implementation begins
- **THEN** the orchestrator MAY keep the work in one bounded role
- **AND** it SHALL still record the role boundary and exact applicable skill
  paths when implementation progress is created.

### Requirement: Owner Tags and Delegation Evidence

The workflow SHALL use owner-tagged tasks and durable progress evidence to make
delegation decisions auditable.

#### Scenario: Specialized task is planned

- **WHEN** a task maps to a specialized registry owner
- **THEN** `tasks.md` SHALL tag that task with exactly one owner tag such as
  `[orchestrator]`, `[agent-data]`, `[agent-ui]`, `[agent-architect]`, or
  `[agent-verifier]`
- **AND** the tag SHALL identify the role responsible for implementation,
  verification, or planning evidence for that task.

#### Scenario: Delegation plan is persisted

- **WHEN** implementation progress is created for an OpenSpec change with
  owner-tagged tasks
- **THEN** `apply-progress.md` SHALL include a current `delegationPlan` snapshot
  listing required roles, task IDs, allowed roots, exact skills, resolution
  method, and any inline fallback reason
- **AND** `Handoff History` SHALL contain the detailed phase-handoff outputs.

#### Scenario: Inline fallback is used

- **GIVEN** a runtime lacks usable subagents for a required specialized role
- **WHEN** the orchestrator executes that role inline
- **THEN** the corresponding handoff SHALL use `Skill resolution:
  inline-fallback`
- **AND** it SHALL record the concrete fallback reason in progress evidence
  before marking the owned tasks complete.

### Requirement: Delegation Coverage Validation

The repository validator SHALL mechanically reject started active changes whose
delegation evidence does not cover owner-tagged tasks.

#### Scenario: Owner-tagged task lacks delegation plan

- **GIVEN** an active OpenSpec change has started implementation
- **AND** `tasks.md` contains one or more owner-tagged tasks
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `apply-progress.md` does not contain a
  current `delegationPlan` snapshot covering those owners
- **AND** the failure SHALL identify the missing delegation evidence.

#### Scenario: Completed owner task lacks handoff coverage

- **GIVEN** an active OpenSpec change has started implementation
- **AND** an owner-tagged task is checked complete
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `Handoff History` lacks a matching role
  handoff for that owner or its inline fallback
- **AND** the failure SHALL identify the owner whose completed work is
  uncovered.

#### Scenario: Inline fallback lacks reason

- **GIVEN** an active OpenSpec change records a required role as inline fallback
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if the fallback reason is empty or absent
- **AND** validation SHALL remain independent of actual runtime tool
  availability.
