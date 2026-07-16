# workflow Specification

## Purpose
Defines the repository's hybrid development workflow: `docs/` stores source
material and curated requirements, OpenSpec stores executable changes and
accepted behavior, and `.agent` stores project-specific technical governance.
## Requirements
### Requirement: Hybrid OpenSpec and `.agent` Workflow

The system SHALL use OpenSpec as the executable change/spec layer while using `.agent` as the project-specific technical governance layer.

#### Scenario: Candidate requirement becomes an OpenSpec change

- GIVEN project source material or an explicitly approved user requirement exists
- AND a curated requirement brief exists when product intent requires one
- WHEN the user chooses that requirement for development
- THEN the AI SHALL create or update an OpenSpec change under `openspec/changes/<change-id>/`
- AND the change SHALL contain proposal, delta specs, design, and tasks.

#### Scenario: Implementation follows OpenSpec and `.agent`

- GIVEN an active OpenSpec change has tasks
- WHEN implementation begins
- THEN the AI SHALL follow `tasks.md`
- AND apply the relevant `.agent` skills for architecture, data, UI, i18n, progress, and verification.

#### Scenario: Accepted behavior is archived

- GIVEN implementation and verification tasks are complete
- AND progress is reconciled
- AND a fresh verification report has verdict PASS
- WHEN archive readiness succeeds
- THEN the native OpenSpec archive command SHALL sync or archive the change
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

### Requirement: Harness Bootstrap and Task Classification

The repository SHALL provide a root entry instruction that loads the local SDD skill and skill registry before classifying work.

#### Scenario: Broad product intent is received

- **GIVEN** the request is broad, ambiguous, or product-discovery work
- **WHEN** the entry point classifies the task
- **THEN** it SHALL route the work to requirement curation before creating executable OpenSpec behavior.

#### Scenario: Ready behavior change is received

- **GIVEN** a behavior change has clear intent and scope
- **WHEN** the entry point classifies the task
- **THEN** it SHALL create or update an OpenSpec change
- **AND** it SHALL use the linked requirement brief when one exists.

#### Scenario: Active change is received

- **GIVEN** the request identifies an active OpenSpec change
- **WHEN** work resumes
- **THEN** the entry point SHALL recover context from native status, tasks, and apply-progress artifacts
- **AND** it SHALL continue from the recorded phase rather than create another change.

#### Scenario: Internal technical work is received

- **GIVEN** a refactor or documentation task does not change an accepted behavior contract
- **WHEN** the entry point classifies the task
- **THEN** it SHALL use .agent governance with OpenSpec optional
- **AND** it SHALL NOT force a requirement brief.

### Requirement: Native State, Skills, and Handoffs

The workflow SHALL use OpenSpec as the only executable change-state authority and SHALL use bounded, exact-path handoffs for specialized work.

#### Scenario: Implementation starts

- **GIVEN** a change is proposed for implementation
- **WHEN** the operator approves apply
- **THEN** it SHALL inspect `openspec status --change <id> --json`
- **AND** it SHALL inspect `openspec instructions apply --change <id> --json`
- **AND** it SHALL reread the linked requirement and every context file returned by OpenSpec
- **AND** it SHALL pass only the exact applicable skill paths, allowed roots, and structured context to the executor.

#### Scenario: Local OpenSpec skill is invoked

- **GIVEN** propose, apply, sync, or archive is invoked through a local OpenSpec skill
- **WHEN** that skill operates in this repository
- **THEN** it SHALL preserve the repository requirement, readiness, progress, verification, and archive policies
- **AND** the repository validator SHALL reject a generated skill that has lost its local integration marker.

#### Scenario: Subagents are unavailable

- **GIVEN** a runtime does not support subagents
- **WHEN** specialized work is required
- **THEN** the orchestrator SHALL execute the role inline
- **AND** it SHALL preserve the same role boundaries, allowed roots, and no-redelegation rule.

#### Scenario: Handoff completes

- **WHEN** a specialized role returns work
- **THEN** its handoff SHALL contain status, summary, artifacts, files changed, completed tasks, risks, next phase, and skill-resolution method
- **AND** implemented changes SHALL persist the handoff summary in cumulative progress evidence.

### Requirement: Implementation Readiness and Persistent Progress

The workflow SHALL validate readiness before implementation and maintain a current, cumulative change-local progress record without replacing `tasks.md`.

#### Scenario: Artifacts are ready for implementation

- **GIVEN** an implementation is about to be approved
- **WHEN** the operator reviews readiness
- **THEN** it SHALL reread proposal, specs, design, tasks, and the linked requirement when applicable
- **AND** it SHALL verify artifact existence, coherent scope, valid paths, and no blocking open question
- **AND** it SHALL block apply when a required planning artifact is missing.

#### Scenario: Implementation changes a file

- **GIVEN** an implemented OpenSpec change is in progress
- **WHEN** implementation completes one or more tasks
- **THEN** it SHALL update `apply-progress.md` with a current status, completed tasks, files changed, decisions or deviations, problems, remaining tasks, skills loaded, and handoff history
- **AND** it SHALL update `tasks.md` as the authority for completion.

#### Scenario: Progress and tasks diverge

- **GIVEN** the current progress summary and `tasks.md` disagree
- **WHEN** work is resumed, verified, or prepared for archive
- **THEN** the repository validator and operator SHALL reject the state
- **AND** the discrepancy SHALL be reconciled before continuing.

### Requirement: Verification Evidence and Archive Readiness

The workflow SHALL persist reproducible final verification evidence across specification, automated behavior, static quality, and production-build gates and SHALL block archive when completion evidence is incomplete, failed, or stale.

#### Scenario: Final verification runs

- **GIVEN** implementation and automated behavior tasks are complete
- **WHEN** verification begins
- **THEN** the verifier SHALL inspect native OpenSpec status
- **AND** it SHALL run OpenSpec plus harness validation, unit/component tests, non-incremental application plus reference typechecking, application plus reference linting, and the production build through `pnpm verify`
- **AND** it SHALL finalize verification task checkboxes and progress before writing the report
- **AND** it SHALL create `verify-report.md` with conformance, exact commands, exit codes, durations, warnings, handoffs, verdict, and a SHA-256 snapshot of covered files.

#### Scenario: A verified change is modified

- **GIVEN** `verify-report.md` has a PASS verdict and snapshot
- **WHEN** a covered implementation, test, configuration, planning, task, progress, or linked requirement file changes
- **THEN** archive readiness validation SHALL fail
- **AND** `pnpm verify` and the report SHALL be regenerated.

#### Scenario: Archive is requested

- **GIVEN** an OpenSpec change is ready to close
- **WHEN** archive readiness is evaluated
- **THEN** the workflow SHALL block archive if artifacts or tasks are incomplete, progress is absent or unreconciled, automated evidence is absent or not PASS, the snapshot is stale, or a linked requirement cannot be reconciled
- **AND** it SHALL NOT permit confirmation to override a failed readiness check
- **AND** it SHALL use `openspec archive <id> --yes --json` rather than manual filesystem movement
- **AND** it SHALL update the linked requirement and index as part of the close operation
- **AND** it SHALL validate accepted specs after archive.

#### Scenario: OpenSpec instruction phase is unavailable

- **GIVEN** OpenSpec 1.6.0 does not expose instructions for verify or archive
- **WHEN** verification or archive is prepared
- **THEN** the workflow SHALL use `openspec status --change <id> --json` as the native preflight
- **AND** it SHALL NOT invoke or emulate unsupported instruction phases.

### Requirement: Mechanical Harness Validation

The repository SHALL provide dependency-free validation for mechanically observable harness invariants while keeping OpenSpec as the state authority.

#### Scenario: Invalid active change is validated

- **GIVEN** an active change has started implementation
- **WHEN** tasks are pending, progress is missing or divergent, evidence is FAIL, or evidence is stale
- **THEN** `pnpm validate:harness` SHALL exit non-zero
- **AND** it SHALL identify the violated invariant.

#### Scenario: Unsafe local archive integration is validated

- **GIVEN** the local archive skill permits bypassing readiness or manually moves the change directory
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail before archive can be considered ready.

#### Scenario: Negative fixtures run

- **WHEN** the harness validator tests run with Node's built-in test runner
- **THEN** fixtures for pending tasks, missing progress, FAIL evidence, stale evidence, and unsafe archive integration SHALL be rejected.

### Requirement: No-Change Verification

Internal non-contract work SHALL run applicable verification without inventing an OpenSpec change lifecycle.

#### Scenario: Internal task has no change

- **GIVEN** a refactor, documentation update, or internal task is classified as `no-change`
- **WHEN** verification runs
- **THEN** it SHALL NOT call change-specific OpenSpec status
- **AND** it SHALL NOT create `apply-progress.md` or `verify-report.md`
- **AND** it SHALL return applicable command evidence through the handoff or final result.

### Requirement: Tiered Feedback and Test Ownership

The workflow SHALL provide fast implementation feedback separately from reproducible automated final evidence, and the executor that implements deterministic behavior SHALL own its focused automated tests.

#### Scenario: Executor checks behavior during implementation

- **GIVEN** implementation or test source is still changing
- **WHEN** an executor invokes `pnpm verify:fast`
- **THEN** unit/component tests, incremental app typecheck, and cached lint SHALL run
- **AND** the result SHALL NOT be represented as final archive evidence.

#### Scenario: Behavior is assigned to a specialized executor

- **WHEN** an implementation task changes deterministic data, UI, validation, URL, or component behavior
- **THEN** its owning executor SHALL add or update the smallest valuable automated test
- **AND** the verifier SHALL report implementation failures back to the owning role rather than repair source code.

#### Scenario: Browser smoke is selected

- **WHEN** an operator chooses to inspect a completed change in a browser for diagnosis or exploratory confidence
- **THEN** that inspection SHALL remain outside OpenSpec tasks, `verify-report.md`, PASS criteria, snapshot invalidation, and archive readiness
- **AND** a discovered defect SHALL be handled in a subsequent iteration with focused automated regression coverage when the behavior is deterministic.

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

