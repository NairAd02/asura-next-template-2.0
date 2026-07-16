## MODIFIED Requirements

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

The workflow SHALL persist reproducible final verification evidence and SHALL block archive when completion evidence is incomplete, failed, or stale.

#### Scenario: Final verification runs

- **GIVEN** implementation and browser-verifiable tasks are complete
- **WHEN** verification begins
- **THEN** the verifier SHALL inspect native OpenSpec status
- **AND** it SHALL run OpenSpec plus harness validation, non-incremental application plus reference typechecking, application plus reference linting, and the production build
- **AND** it SHALL finalize verification task checkboxes and progress before writing the report
- **AND** it SHALL create `verify-report.md` with conformance, commands, exit codes, warnings, handoffs, verdict, and a SHA-256 snapshot of covered files.

#### Scenario: A verified change is modified

- **GIVEN** `verify-report.md` has a PASS verdict and snapshot
- **WHEN** a covered implementation, planning, task, progress, or linked requirement file changes
- **THEN** archive readiness validation SHALL fail
- **AND** the verification gates and report SHALL be regenerated.

#### Scenario: Archive is requested

- **GIVEN** an OpenSpec change is ready to close
- **WHEN** archive readiness is evaluated
- **THEN** the workflow SHALL block archive if artifacts or tasks are incomplete, progress is absent or unreconciled, evidence is absent or not PASS, the snapshot is stale, or a linked requirement cannot be reconciled
- **AND** it SHALL NOT permit confirmation to override a failed readiness check
- **AND** it SHALL use `openspec archive <id> --yes --json` rather than manual filesystem movement
- **AND** it SHALL update the linked requirement and index as part of the close operation
- **AND** it SHALL validate accepted specs after archive.

#### Scenario: OpenSpec instruction phase is unavailable

- **GIVEN** OpenSpec 1.6.0 does not expose instructions for verify or archive
- **WHEN** verification or archive is prepared
- **THEN** the workflow SHALL use `openspec status --change <id> --json` as the native preflight
- **AND** it SHALL NOT invoke or emulate unsupported instruction phases.

## ADDED Requirements

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
