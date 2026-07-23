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

### Requirement: OpenSpec Is the Only Executable Spec Layer

The system SHALL use OpenSpec as the only executable spec layer for new work.

#### Scenario: New feature work starts

- GIVEN a new product behavior change is requested
- WHEN the user wants to develop it
- THEN the AI SHALL use `docs/project-context.md`, `docs/requirements/`, and OpenSpec
- AND SHALL NOT create executable specs outside OpenSpec.

### Requirement: Harness Bootstrap and Task Classification

The repository SHALL provide distinct root-orchestrator and non-root-executor
entry instructions before task work begins.

#### Scenario: Root thread enters the harness

- **GIVEN** the current agent is the root orchestrator and no executor handoff
  marker is present
- **WHEN** a task enters the repository harness
- **THEN** it SHALL read the SDD skill, skill registry, and orchestrator role
  profile in order
- **AND** it SHALL classify the request before planning or implementation.

#### Scenario: Non-root executor enters the harness

- **GIVEN** the runtime identifies the current thread as non-root or the handoff
  contains the portable executor marker
- **WHEN** specialized work starts
- **THEN** the executor SHALL read the phase-handoff contract, its exact role
  profile, and only the skills listed in the handoff
- **AND** it SHALL NOT repeat root task classification, requirements curation,
  orchestrator bootstrap, or the Implementation Approval Packet.

#### Scenario: Broad product intent is received

- **GIVEN** the request is broad, ambiguous, or product-discovery work
- **WHEN** the root entry point classifies the task
- **THEN** it SHALL route the work to requirement curation before creating
  executable OpenSpec behavior.

#### Scenario: Ready behavior change is received

- **GIVEN** a behavior change has clear intent and scope
- **WHEN** the root entry point classifies the task
- **THEN** it SHALL create or update an OpenSpec change
- **AND** it SHALL use the linked requirement brief when one exists.

#### Scenario: Active change is received

- **GIVEN** the request identifies an active OpenSpec change
- **WHEN** work resumes
- **THEN** the root entry point SHALL recover context from native status, tasks,
  and apply-progress artifacts
- **AND** it SHALL continue from the recorded phase rather than create another
  change.

#### Scenario: Internal technical work is received

- **GIVEN** a refactor or documentation task does not change an accepted
  behavior contract
- **WHEN** the root entry point classifies the task
- **THEN** it SHALL use `.agent` governance with OpenSpec optional
- **AND** it SHALL NOT force a requirement brief.

### Requirement: Native State, Skills, and Handoffs

The workflow SHALL use OpenSpec as the only executable change-state authority
and SHALL use bounded, exact-path handoffs for specialized work without
conflating skill resolution with execution mode.

#### Scenario: Implementation starts

- **GIVEN** a change is proposed for implementation
- **WHEN** the operator approves apply
- **THEN** it SHALL inspect `openspec status --change <id> --json`
- **AND** it SHALL inspect
  `openspec instructions apply --change <id> --json`
- **AND** it SHALL reread the linked requirement and every context file
  returned by OpenSpec
- **AND** it SHALL pass only the exact applicable skill paths, allowed roots,
  structured context, execution mode, budget class, and exclusive artifacts to
  the executor.

#### Scenario: Local OpenSpec skill is invoked

- **GIVEN** propose, apply, sync, or archive is invoked through a local OpenSpec
  skill
- **WHEN** that skill operates in this repository
- **THEN** it SHALL preserve the repository requirement, readiness, progress,
  verification, archive, and proportional-execution policies
- **AND** the repository validator SHALL reject a generated skill that has lost
  its local integration marker.

#### Scenario: Subagents are unavailable

- **GIVEN** a runtime does not support subagents
- **WHEN** the task is suitable for inline execution
- **THEN** the orchestrator SHALL plan execution mode `inline`
- **AND** it SHALL preserve the same role boundaries, allowed roots, and
  no-redelegation rule without recording a false failure.

#### Scenario: Handoff completes

- **WHEN** a specialized role returns work
- **THEN** its handoff SHALL contain status, summary, artifacts, files changed,
  completed tasks, verification, risks, next phase, skill resolution,
  execution mode, lifecycle milestones, budget outcome, and fallback reason
  when applicable
- **AND** implemented changes SHALL persist the handoff summary in cumulative
  progress evidence.

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
role ownership and proportional execution mode before implementation starts for
an OpenSpec change.

#### Scenario: Mandatory bootstrap loads the orchestrator role

- **WHEN** a task enters the root repository harness
- **THEN** the entry point SHALL load the root SDD, registry, and orchestrator
  instructions before classification
- **AND** every later executor SHALL receive the executor marker, exact role,
  bounded task, execution mode, budget, roots, artifacts, and exact skills
  instead of repeating the root bootstrap.

#### Scenario: Multi-role change starts implementation

- **GIVEN** an active OpenSpec change has implementation tasks that touch more
  than one specialized owner, both data and UI roots, visible text plus
  behavior, a new module workflow, or final verification
- **WHEN** implementation is about to begin
- **THEN** the orchestrator SHALL create a delegation plan with required roles,
  bounded tasks, task IDs, allowed roots, exact skill paths, execution mode,
  budget class, lifecycle expectations, and exclusive artifacts
- **AND** each required role SHALL receive a phase handoff before that role's
  task is completed.

#### Scenario: Simple single-role work remains lightweight

- **GIVEN** an active OpenSpec change has one bounded owner or a small
  critical-path planning artifact
- **WHEN** implementation or planning begins
- **THEN** the orchestrator MAY select execution mode `inline`
- **AND** it SHALL still record the role boundary, exact applicable skills,
  budget class, and owned artifacts when implementation progress is created.

### Requirement: Owner Tags and Delegation Evidence

The workflow SHALL use owner-tagged tasks and durable progress evidence to make
role ownership, execution mode, and recovery decisions auditable.

#### Scenario: Specialized task is planned

- **WHEN** a task maps to a specialized registry owner
- **THEN** `tasks.md` SHALL tag that task with exactly one owner tag such as
  `[orchestrator]`, `[agent-data]`, `[agent-ui]`, `[agent-architect]`, or
  `[agent-verifier]`
- **AND** the tag SHALL identify responsibility without forcing a particular
  execution mechanism.

#### Scenario: Delegation plan is persisted

- **WHEN** implementation progress is created for an OpenSpec change with
  owner-tagged tasks
- **THEN** `apply-progress.md` SHALL include a current `delegationPlan` snapshot
  listing required roles, task IDs, allowed roots, exact skills, execution
  mode, budget class, expected milestones, and exclusive artifacts
- **AND** `Handoff History` SHALL contain the detailed phase-handoff outputs.

#### Scenario: Inline fallback is used

- **GIVEN** an active delegation plan or handoff uses the legacy
  `inline-fallback` skill-resolution value
- **WHEN** schema-v2 harness validation runs
- **THEN** validation SHALL reject the obsolete value
- **AND** the workflow SHALL represent deliberate inline work as execution mode
  `inline` and a failed planned subagent as `runtime-fallback`.

#### Scenario: Planned inline execution is used

- **GIVEN** a role is intentionally planned as `inline`
- **WHEN** the orchestrator executes that role
- **THEN** its handoff SHALL record `Execution mode: inline`
- **AND** no fallback reason SHALL be required.

#### Scenario: Runtime fallback is used

- **GIVEN** a role was planned as `subagent` but cannot complete through that
  mode
- **WHEN** the orchestrator takes over or selects another mechanism
- **THEN** its handoff SHALL record `Execution mode: runtime-fallback`
- **AND** it SHALL record the concrete triggering condition and recovery
  evidence before marking owned tasks complete.

### Requirement: Delegation Coverage Validation

The repository validator SHALL mechanically reject started active changes whose
role, execution-mode, ownership, or handoff evidence is incomplete or
internally inconsistent.

#### Scenario: Owner-tagged task lacks delegation plan

- **GIVEN** an active OpenSpec change has started implementation
- **AND** `tasks.md` contains one or more owner-tagged tasks
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `apply-progress.md` does not contain a
  current `delegationPlan` snapshot covering those owners
- **AND** the failure SHALL identify the missing delegation evidence.

#### Scenario: Delegation plan entry is incomplete

- **GIVEN** a required role appears in the delegation plan
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if execution mode, task IDs, roots, skills,
  budget class, expected milestones, or exclusive artifacts are missing or
  malformed
- **AND** it SHALL distinguish planned inline work from runtime fallback.

#### Scenario: Completed owner task lacks handoff coverage

- **GIVEN** an owner-tagged task is checked complete
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `Handoff History` lacks a matching role
  handoff with execution mode and lifecycle outcome
- **AND** the failure SHALL identify the uncovered owner.

#### Scenario: Runtime fallback lacks evidence

- **GIVEN** a role records execution mode `runtime-fallback`
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if the triggering condition, prior planned
  mode, recovery attempt, or fallback reason is absent
- **AND** validation SHALL remain independent of actual runtime tool
  availability.

#### Scenario: Inline fallback lacks reason

- **GIVEN** an active change contains the legacy `inline-fallback` resolution
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL reject it as unsupported whether or not a reason is
  present
- **AND** the failure SHALL direct the change to planned `inline` or evidenced
  `runtime-fallback` schema-v2 fields.

#### Scenario: Root and executor bootstrap regress

- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if root instructions do not contain the
  root/executor split or if executor role definitions require orchestrator
  bootstrap and root classification
- **AND** it SHALL verify that required Codex custom-agent definitions point to
  portable role contracts.

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

### Requirement: Proportional Specialized Execution

The workflow SHALL separate specialized role ownership from the mechanism used
to execute that role and SHALL select an execution mode proportional to the
task's independence, critical-path position, write scope, and coordination
cost.

#### Scenario: Small critical-path planning artifact stays inline

- **GIVEN** a specialized planning artifact is bounded to one file and depends
  on context already held by the orchestrator
- **WHEN** delegation would add more coordination latency than independent value
- **THEN** the delegation plan SHALL use execution mode `inline`
- **AND** inline execution SHALL be treated as a planned mode rather than a
  fallback failure.

#### Scenario: Independent investigation uses a subagent

- **GIVEN** architecture, research, triage, or review can run independently
- **WHEN** a subagent can return a bounded recommendation without competing for
  a critical-path artifact
- **THEN** the orchestrator SHALL prefer execution mode `subagent`
- **AND** the orchestrator SHALL synthesize the returned evidence into the
  authoritative planning artifact unless delegated authorship is explicitly
  justified.

#### Scenario: Planned subagent becomes unusable

- **GIVEN** the delegation plan selected execution mode `subagent`
- **WHEN** the runtime lacks the capability, the agent reports a blocker, or
  evidence-based recovery is exhausted
- **THEN** the role SHALL transition to `runtime-fallback`
- **AND** the handoff and progress evidence SHALL record the concrete reason.

### Requirement: Delegation Lifecycle, Budgets, and Recovery

The workflow SHALL observe delegated work through semantic lifecycle milestones
and task-class budgets, and SHALL NOT treat an empty polling interval or a
missing final artifact as proof that an agent is hung.

#### Scenario: Delegated work reports lifecycle milestones

- **WHEN** a subagent performs bounded work
- **THEN** its runtime adapter SHALL map available activity to the portable
  milestones `started`, `context-loaded`, `recommendation-ready`,
  `artifact-written`, `completed`, or `blocked`
- **AND** the final handoff SHALL report the milestones actually reached.

#### Scenario: Poll returns no final result

- **GIVEN** a delegated agent is still reported as running
- **WHEN** one or more waits return without a final result
- **THEN** the orchestrator SHALL continue observing within the task budget
- **AND** it SHALL NOT interrupt, retry, or declare fallback solely because the
  expected artifact does not yet exist.

#### Scenario: Default task budgets are assigned

- **WHEN** a delegation plan is created without a task-specific override
- **THEN** planning and curation SHALL receive a 10-minute observation budget
- **AND** implementation SHALL receive a 20-minute observation budget
- **AND** verification SHALL receive a 15-minute observation budget
- **AND** polling intervals SHALL remain independent from those budgets.

#### Scenario: Recovery is required

- **GIVEN** the task budget is exhausted without completion
- **WHEN** the agent has not reported `blocked` and no terminal runtime error is
  available
- **THEN** the orchestrator SHALL perform at most one bounded recovery attempt
- **AND** it SHALL interrupt and confirm the previous writer is stopped before
  starting another writer or executing the role inline.

#### Scenario: Early interruption is justified

- **WHEN** an agent reports `blocked`, emits a terminal error, violates its
  allowed roots, or the operator cancels the task
- **THEN** the orchestrator MAY interrupt before the budget expires
- **AND** progress evidence SHALL record the triggering condition.

### Requirement: Single Writer Ownership

The workflow SHALL prevent concurrent agents from owning the same authoritative
artifact or overlapping write target.

#### Scenario: Replacement agent is considered

- **GIVEN** a delegated writer has not completed
- **WHEN** the orchestrator considers a replacement or inline takeover
- **THEN** it SHALL interrupt the existing writer and confirm terminal status
- **AND** only then MAY it assign the same artifact to another execution.

#### Scenario: Delegation plan contains duplicate artifact ownership

- **WHEN** two concurrently executable role entries claim the same exclusive
  artifact
- **THEN** harness validation SHALL fail
- **AND** the failure SHALL identify the duplicated artifact and owners.

### Requirement: Bounded Architecture Consultation

Architecture work SHALL have an explicit purpose, bounded inputs, a research
budget, and a stopping condition.

#### Scenario: Architect is used as an advisor

- **GIVEN** an existing module or workflow needs design evidence but not a new
  architecture boundary
- **WHEN** architecture work is delegated
- **THEN** the handoff SHALL default to a read-heavy recommendation covering
  seams, alternatives, risks, and affected files
- **AND** the orchestrator SHALL author the authoritative `design.md`.

#### Scenario: Architect authors the design

- **GIVEN** delegated design authorship has independent value
- **WHEN** the architect receives ownership of `design.md`
- **THEN** the handoff SHALL provide exact input paths, exclusive artifact
  ownership, a design template, a maximum research-round count, and an explicit
  completion condition
- **AND** the architect SHALL stop and report `blocked` before exceeding the
  research bound without enough evidence.

### Requirement: Portable Runtime Adapter Boundary

The harness SHALL keep portable role and handoff semantics under `.agent` while
placing runtime-specific agent registration, spawning, permission, progress,
and interruption mappings in explicit adapters.

#### Scenario: Codex project agents are available

- **WHEN** Codex loads the repository
- **THEN** project-scoped custom agents SHALL be registered under
  `.codex/agents/*.toml`
- **AND** each custom agent SHALL reference the corresponding portable
  `.agent/agents/<role>.md` contract
- **AND** role-specific model or reasoning defaults MAY be applied without
  duplicating the portable contract.

#### Scenario: Another runtime uses the harness

- **WHEN** a non-Codex runtime executes the harness
- **THEN** its adapter SHALL map its native capabilities to the portable
  execution modes and milestones
- **AND** unsupported features SHALL select planned `inline` or documented
  `runtime-fallback` rather than pretending Codex-specific tools exist.

