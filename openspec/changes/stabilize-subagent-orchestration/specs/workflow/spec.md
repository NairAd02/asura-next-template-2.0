## ADDED Requirements

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

## MODIFIED Requirements

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

#### Scenario: Runtime lacks native subagents

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

### Requirement: Delegation Gate Before Implementation

The workflow SHALL require the orchestrator to decide and record specialized
role ownership and proportional execution mode before implementation starts for
an OpenSpec change.

#### Scenario: Mandatory bootstrap loads the correct role

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

#### Scenario: Owner-tagged task lacks a delegation plan

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

#### Scenario: Root and executor bootstrap regress

- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if root instructions do not contain the
  root/executor split or if executor role definitions require orchestrator
  bootstrap and root classification
- **AND** it SHALL verify that required Codex custom-agent definitions point to
  portable role contracts.
