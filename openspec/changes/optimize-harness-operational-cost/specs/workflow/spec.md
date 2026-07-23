## ADDED Requirements

### Requirement: Proportional Assurance Profiles

The workflow SHALL select operational rigor from accepted-contract impact and
risk rather than from the mere presence of code or documentation edits.

#### Scenario: Contract-preserving work is classified

- **GIVEN** a defect fix restores behavior already required by an accepted spec
- **OR** an internal refactor or documentation edit does not change an accepted
  behavior contract
- **WHEN** the root classifies the task
- **THEN** it SHALL select assurance profile `no-change`
- **AND** it SHALL cite the accepted contract or internal scope that makes the
  classification safe.

#### Scenario: Standard accepted-contract change is classified

- **GIVEN** work changes an accepted behavior contract
- **AND** the work has bounded scope, no destructive migration, no
  security-critical permission change, and one primary writer
- **WHEN** the root classifies the task
- **THEN** it SHALL select assurance profile `standard-change`
- **AND** it SHALL use OpenSpec planning, approval, persistent progress, full
  final gates, snapshot freshness, and fail-closed archive readiness.

#### Scenario: High-risk accepted-contract change is classified

- **GIVEN** work changes authentication, authorization, destructive data
  migration, external dependencies, multiple architectural boundaries, or
  another operator-designated critical area
- **WHEN** the root classifies the task
- **THEN** it SHALL select assurance profile `high-risk`
- **AND** it SHALL require the applicable independent architecture,
  implementation, documentation, and verification boundaries.

#### Scenario: Classification is uncertain

- **GIVEN** available evidence does not establish whether accepted behavior or
  a high-risk boundary changes
- **WHEN** the root must choose an assurance profile
- **THEN** it SHALL select the more rigorous applicable profile
- **AND** it SHALL preserve the uncertainty as an open question rather than
  silently downgrade assurance.

### Requirement: Compact Normative Context

The harness SHALL keep lifecycle policy authoritative in a minimal set of
files and SHALL load examples lazily so repeated guidance does not dominate
task context.

#### Scenario: Root bootstrap loads governance

- **WHEN** the root bootstrap executes
- **THEN** the SDD skill SHALL contain the authoritative lifecycle rules
- **AND** the registry and orchestrator profile SHALL contain only their
  non-duplicated mapping and role-specific decisions.

#### Scenario: Executor loads a domain skill

- **WHEN** a domain skill applies to an executor
- **THEN** the skill SHALL contain focused rules, decisions, and a checklist
- **AND** extended code examples SHALL be referenced from
  `.agent/reference/widget/` and read only when the bounded task needs them.

#### Scenario: Human guidance describes the workflow

- **WHEN** operator or developer guidance repeats a normative rule
- **THEN** it SHALL identify the authoritative contract
- **AND** descriptive guidance SHALL NOT become a second independently
  maintained source of lifecycle truth.

## MODIFIED Requirements

### Requirement: Harness Bootstrap and Task Classification

The repository SHALL provide distinct root-orchestrator and non-root-executor
entry instructions and SHALL select an assurance profile before planning or
implementation work begins.

#### Scenario: Root thread enters the harness

- **GIVEN** the current agent is the root orchestrator and no executor handoff
  marker is present
- **WHEN** a task enters the repository harness
- **THEN** it SHALL read the compact SDD skill, skill registry, and
  orchestrator role profile in order
- **AND** it SHALL classify accepted-contract impact and assurance profile
  before planning or implementation.

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
- **THEN** it SHALL compare the requested behavior with accepted specs
- **AND** it SHALL create or update an OpenSpec change only when the accepted
  contract changes
- **AND** it SHALL use the linked requirement brief when one exists.

#### Scenario: Active change is received

- **GIVEN** the request identifies an active OpenSpec change
- **WHEN** work resumes
- **THEN** the root entry point SHALL recover context from native status, tasks,
  and apply-progress artifacts
- **AND** it SHALL continue from the recorded phase rather than create another
  change.

#### Scenario: Internal technical work is received

- **GIVEN** a defect repair, refactor, or documentation task does not change an
  accepted behavior contract
- **WHEN** the root entry point classifies the task
- **THEN** it SHALL use assurance profile `no-change` and `.agent` governance
  with OpenSpec optional
- **AND** it SHALL NOT force a requirement brief, Implementation Approval
  Packet, progress artifact, or verification report.

### Requirement: Native State, Skills, and Handoffs

The workflow SHALL use OpenSpec as the only executable change-state authority
and SHALL use bounded exact-path handoffs without duplicating planned and
actual execution evidence.

#### Scenario: Implementation starts

- **GIVEN** a change is proposed for implementation
- **WHEN** the operator approves apply
- **THEN** it SHALL inspect `openspec status --change <id> --json`
- **AND** it SHALL inspect
  `openspec instructions apply --change <id> --json`
- **AND** it SHALL load the task-relevant requirement and context files
  returned by OpenSpec
- **AND** it SHALL pass only exact applicable skill paths, allowed roots,
  structured context, execution mode, assurance profile, and exclusive
  artifacts to the executor.

#### Scenario: Local OpenSpec skill is invoked

- **GIVEN** propose, apply, update, sync, or archive is invoked through a local
  OpenSpec skill
- **WHEN** that skill operates in this repository
- **THEN** it SHALL preserve the repository classification, approval, progress,
  verification, archive, and proportional-execution policies
- **AND** the repository validator SHALL reject a generated skill that has lost
  its local integration marker.

#### Scenario: Subagents are unavailable

- **GIVEN** a runtime does not support subagents
- **WHEN** the task is suitable for inline execution
- **THEN** the orchestrator SHALL plan execution mode `inline`
- **AND** it SHALL preserve allowed roots and no-redelegation without recording
  a false failure or subagent-only lifecycle evidence.

#### Scenario: Handoff completes

- **WHEN** a specialized role returns work
- **THEN** its handoff SHALL return one structured execution record containing
  status, role, task IDs, files changed, verification, risks, execution mode,
  roots, skills, and owned artifacts
- **AND** subagent or runtime-fallback execution SHALL additionally return
  lifecycle, budget, and recovery evidence when applicable
- **AND** implemented changes SHALL persist that record once in cumulative
  progress evidence rather than restating it in a prose handoff history.

### Requirement: Implementation Readiness and Persistent Progress

The workflow SHALL validate readiness before implementation and maintain one
machine-readable current record without replacing `tasks.md` or duplicating
execution evidence.

#### Scenario: Artifacts are ready for implementation

- **GIVEN** an implementation is about to be approved
- **WHEN** the operator reviews readiness
- **THEN** it SHALL inspect proposal, specs, design, tasks, and the linked
  requirement when applicable
- **AND** it SHALL verify artifact existence, coherent scope, valid paths, and
  no blocking open question
- **AND** it SHALL calculate a deterministic digest over the reviewed planning
  artifacts
- **AND** it SHALL block apply when a required artifact is missing.

#### Scenario: Implementation changes a file

- **GIVEN** an implemented OpenSpec change is in progress
- **WHEN** implementation completes one or more tasks
- **THEN** `tasks.md` SHALL remain the completion authority
- **AND** `apply-progress.md` SHALL maintain current status, files changed,
  approval digest, assurance profile, planned role ownership, actual execution
  records, decisions or deviations, problems, and remaining tasks
- **AND** it SHALL NOT require a second prose copy of structured execution
  records.

#### Scenario: Progress and tasks diverge

- **GIVEN** current progress and `tasks.md` disagree
- **WHEN** work is resumed, verified, or prepared for archive
- **THEN** the repository validator and operator SHALL reject the state
- **AND** the discrepancy SHALL be reconciled before continuing.

### Requirement: Verification Evidence and Archive Readiness

The workflow SHALL persist reproducible final verification evidence while
executing every required final gate exactly once per authoritative run and
blocking archive on incomplete, failed, or stale evidence.

#### Scenario: Final verification runs

- **GIVEN** implementation and automated behavior tasks are complete
- **WHEN** verification begins
- **THEN** the verifier SHALL inspect native OpenSpec status
- **AND** `pnpm verify` SHALL run OpenSpec plus harness validation,
  unit/component tests, non-incremental application plus reference typechecking,
  application plus reference linting, and the production build sequentially
  through one dependency-free timed runner
- **AND** the runner SHALL emit machine-readable gate names, exact commands,
  exit codes, durations, concise summaries, aggregate duration, and final
  status from that single execution
- **AND** it SHALL stop on the first failed gate
- **AND** the verifier SHALL create `verify-report.md` from that evidence
  without replaying successful gates
- **AND** the report SHALL include conformance, warnings, verdict, execution
  record, and a SHA-256 snapshot of covered files.

#### Scenario: A verified change is modified

- **GIVEN** `verify-report.md` has a PASS verdict and snapshot
- **WHEN** a covered implementation, test, configuration, planning, task,
  progress, or linked requirement file changes
- **THEN** archive readiness validation SHALL fail
- **AND** `pnpm verify` and the report SHALL be regenerated.

#### Scenario: Archive is requested

- **GIVEN** an OpenSpec change is ready to close
- **WHEN** archive readiness is evaluated
- **THEN** the workflow SHALL block archive if artifacts or tasks are
  incomplete, progress is absent or unreconciled, automated evidence is absent
  or not PASS, the snapshot is stale, or a linked requirement cannot be
  reconciled
- **AND** it SHALL NOT permit confirmation to override a failed readiness check
- **AND** it SHALL use `openspec archive <id> --yes --json` rather than manual
  filesystem movement
- **AND** it SHALL update the linked requirement and index as part of the close
  operation
- **AND** it SHALL validate accepted specs after archive.

#### Scenario: OpenSpec instruction phase is unavailable

- **GIVEN** OpenSpec 1.6.0 does not expose instructions for verify or archive
- **WHEN** verification or archive is prepared
- **THEN** the workflow SHALL use
  `openspec status --change <id> --json` as the native preflight
- **AND** it SHALL NOT invoke or emulate unsupported instruction phases.

#### Scenario: Modified accepted behavior is incompatible

- **GIVEN** a delta modifies an accepted requirement
- **WHEN** pre-verification harness validation compares accepted and delta
  requirement/scenario identities
- **THEN** it SHALL fail before typecheck, lint, or build if required identities
  needed by native archive are missing
- **AND** the failure SHALL identify the incompatible capability, requirement,
  or scenario.

### Requirement: Mechanical Harness Validation

The repository SHALL provide dependency-free validation for mechanically
observable harness invariants, assurance profiles, compact execution evidence,
planning digests, and final-run structure while keeping OpenSpec as the state
authority.

#### Scenario: Invalid active change is validated

- **GIVEN** an active change has started implementation
- **WHEN** tasks are pending, progress is missing or divergent, approval digest
  is absent or stale, execution evidence is incoherent, evidence is FAIL, or
  evidence is stale
- **THEN** `pnpm validate:harness` SHALL exit non-zero
- **AND** it SHALL identify the violated invariant.

#### Scenario: Unsafe local archive integration is validated

- **GIVEN** the local archive skill permits bypassing readiness or manually
  moves the change directory
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail before archive can be considered ready.

#### Scenario: Negative fixtures run

- **WHEN** the harness validator tests run with Node's built-in test runner
- **THEN** fixtures for invalid profiles, planning-digest mismatch, incomplete
  execution records, pending tasks, missing progress, FAIL evidence, stale
  evidence, incompatible delta identities, duplicated final gates, and unsafe
  archive integration SHALL be rejected.

#### Scenario: Verification runner definition is validated

- **WHEN** harness validation inspects the final runner and package scripts
- **THEN** it SHALL fail if a required gate is missing, duplicated, reordered,
  configured as incremental/cached final evidence, or replayed by
  `pnpm verify`
- **AND** it SHALL require structured per-gate timing output.

### Requirement: No-Change Verification

Contract-preserving work SHALL run scoped applicable verification without
inventing an OpenSpec change lifecycle.

#### Scenario: Internal task has no change

- **GIVEN** a defect repair, refactor, documentation update, or internal task
  is classified as `no-change`
- **WHEN** verification runs
- **THEN** it SHALL cite why accepted behavior is unchanged
- **AND** it SHALL select checks from the affected roots: documentation
  coherence for documentation-only work, harness fixtures and validation for
  governance work, focused tests plus applicable typecheck/lint for
  implementation repair, and production build only when route, build,
  dependency, or configuration risk requires it
- **AND** it SHALL NOT call change-specific OpenSpec status
- **AND** it SHALL NOT create `apply-progress.md` or `verify-report.md`
- **AND** it SHALL return exact command evidence through the handoff or final
  result.

### Requirement: Owner Tags and Delegation Evidence

The workflow SHALL use owner-tagged tasks, one planned ownership map, and one
actual execution record per completed role boundary.

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
- **THEN** `apply-progress.md` SHALL include a current schema-v3 ownership plan
  listing assurance profile, required roles, task IDs, allowed roots, exact
  skills, planned execution mode, and exclusive artifacts
- **AND** completed role work SHALL be covered by a structured
  `executionRecords` entry
- **AND** inline entries SHALL remain compact while subagent/fallback entries
  include their conditional lifecycle, budget, and recovery fields.

#### Scenario: Inline fallback is used

- **GIVEN** an active ownership plan or execution record uses the legacy
  `inline-fallback` skill-resolution value
- **WHEN** schema-v3 harness validation runs
- **THEN** validation SHALL reject the obsolete value
- **AND** the workflow SHALL represent deliberate inline work as execution mode
  `inline` and a failed planned subagent as `runtime-fallback`.

#### Scenario: Planned inline execution is used

- **GIVEN** a role is intentionally planned as `inline`
- **WHEN** the orchestrator executes that role
- **THEN** its execution record SHALL identify mode `inline`, task IDs, status,
  roots, skills, files, verification, risks, and owned artifacts
- **AND** it SHALL NOT require subagent observation budget, lifecycle, fallback,
  or recovery fields.

#### Scenario: Runtime fallback is used

- **GIVEN** a role was planned as `subagent` but cannot complete through that
  mode
- **WHEN** the orchestrator takes over or selects another mechanism
- **THEN** its execution record SHALL identify mode `runtime-fallback`
- **AND** it SHALL record the planned mode, concrete trigger, lifecycle,
  observation budget, recovery attempt, and prior-writer terminal evidence.

### Requirement: Delegation Coverage Validation

The repository validator SHALL mechanically reject started active changes whose
profile, role ownership, execution record, or conditional recovery evidence is
incomplete or internally inconsistent.

#### Scenario: Owner-tagged task lacks delegation plan

- **GIVEN** an active OpenSpec change has started implementation
- **AND** `tasks.md` contains one or more owner-tagged tasks
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `apply-progress.md` does not contain a
  current schema-v3 ownership plan covering those owners
- **AND** the failure SHALL identify the missing ownership evidence.

#### Scenario: Delegation plan entry is incomplete

- **GIVEN** a required role appears in the ownership plan
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if task IDs, roots, skills, planned execution
  mode, assurance profile, or exclusive artifacts are missing or malformed
- **AND** it SHALL apply lifecycle, budget, fallback, and recovery requirements
  only to execution modes that need them.

#### Scenario: Completed owner task lacks handoff coverage

- **GIVEN** an owner-tagged task is checked complete
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `executionRecords` lacks a matching role
  record with status and verification outcome
- **AND** the failure SHALL identify the uncovered task and owner.

#### Scenario: Runtime fallback lacks evidence

- **GIVEN** a role records execution mode `runtime-fallback`
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if planned mode, triggering condition,
  lifecycle, budget, recovery attempt, or prior-writer terminal confirmation
  is absent
- **AND** validation SHALL remain independent of actual runtime tool
  availability.

#### Scenario: Inline fallback lacks reason

- **GIVEN** an active change contains the legacy `inline-fallback` resolution
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL reject it as unsupported whether or not a reason is
  present
- **AND** the failure SHALL direct the change to compact planned `inline` or
  fully evidenced `runtime-fallback` schema-v3 fields.

#### Scenario: Root and executor bootstrap regress

- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if root instructions lose assurance-profile
  classification or the root/executor split, if compact executor roles require
  root classification, or if Codex agent definitions stop pointing to
  portable role contracts
- **AND** it SHALL preserve exact skill and allowed-root boundaries.

### Requirement: Implementation Approval Gate

The workflow SHALL require explicit operator approval after readiness review
and bind that approval to the exact planning artifacts reviewed before the
first implementation edit.

#### Scenario: Approval packet is presented before implementation

- **GIVEN** an OpenSpec change has proposal, delta specs, design, and tasks ready
  for implementation
- **WHEN** the orchestrator completes readiness review
- **THEN** it SHALL present an Implementation Approval Packet containing change
  ID, assurance profile, requirement status, readiness, intended scope, design,
  tasks, ownership plan, editable roots, expected file families, risks, open
  questions, verification plan, and deterministic planning digest
- **AND** it SHALL stop before implementation edits until the operator
  explicitly approves or requests planning adjustments.

#### Scenario: Operator requests planning adjustments

- **GIVEN** the Implementation Approval Packet has been presented
- **WHEN** the operator requests a scope, design, task, ownership, or
  verification adjustment
- **THEN** the workflow SHALL update the applicable planning artifacts
- **AND** it SHALL calculate a new digest and present the packet again before
  apply proceeds.

#### Scenario: Approval checkpoint is persisted

- **GIVEN** the operator explicitly approves implementation
- **WHEN** apply begins for a started OpenSpec change
- **THEN** `apply-progress.md` SHALL include an approval checkpoint with schema
  version, approved status, operator identity, approval source, reviewed
  artifacts, assurance profile, packet summary, and planning digest
- **AND** the checkpoint SHALL be created before or with the first
  implementation edit.

#### Scenario: Started change lacks approval checkpoint

- **GIVEN** an active OpenSpec change has started implementation
- **WHEN** `pnpm validate:harness` runs
- **THEN** validation SHALL fail if `apply-progress.md` lacks a valid approval
  checkpoint or its planning digest does not match the current reviewed
  artifacts
- **AND** the failure SHALL identify missing, malformed, or stale approval
  evidence.

#### Scenario: Mechanical validation remains honest

- **GIVEN** approval checkpoint evidence is present
- **WHEN** harness validation evaluates the change
- **THEN** validation SHALL prove artifact/digest consistency and record shape
- **AND** it SHALL NOT claim to cryptographically prove that a human approved
  the chat interaction.

#### Scenario: Approved packet is reused without changes

- **GIVEN** the current conversation or execution context already presented an
  approved packet
- **WHEN** apply recomputes the planning digest and it matches the approved
  checkpoint
- **THEN** the orchestrator SHALL NOT require a duplicate packet
- **AND** a resumed or context-insufficient executor SHALL still load the
  task-relevant OpenSpec files needed to implement safely.

### Requirement: Delegated Documentation Synchronization

The workflow SHALL isolate material documentation synchronization in a bounded
curator handoff and SHALL record a mechanically supported no-op when planned
and implemented documentation impact is unchanged.

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
- **THEN** it SHALL receive only feature intent, documentation inventory,
  relevant source material, and explicit documentation roots
- **AND** it SHALL NOT implement code, author executable specifications,
  verify, archive, or redelegate work.

#### Scenario: Product change is reconciled before verification

- **GIVEN** an OpenSpec product change is linked to a requirement brief
- **WHEN** implementation is ready for final verification
- **THEN** progress SHALL compare the planned documentation-impact record,
  implemented scope, and maintained-document changes
- **AND** an unchanged scope with no maintained-document impact SHALL record a
  structured `no-change` reconciliation without spawning a curator
- **AND** any scope or maintained-document impact SHALL require the bounded
  curator reconciliation before `pnpm verify`
- **AND** resulting documentation edits or no-op evidence SHALL be persisted
  before final verification.
