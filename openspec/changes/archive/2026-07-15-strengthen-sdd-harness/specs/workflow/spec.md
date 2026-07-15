## ADDED Requirements

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
- **THEN** it SHALL inspect openspec status --change <id> --json
- **AND** it SHALL inspect openspec instructions apply --change <id> --json
- **AND** it SHALL pass only the exact applicable skill paths, allowed roots, and structured context to the executor.

#### Scenario: Subagents are unavailable

- **GIVEN** a runtime does not support subagents
- **WHEN** specialized work is required
- **THEN** the orchestrator SHALL execute the role inline
- **AND** it SHALL preserve the same role boundaries, allowed roots, and no-redelegation rule.

#### Scenario: Handoff completes

- **WHEN** a specialized role returns work
- **THEN** its handoff SHALL contain status, summary, artifacts, files changed, completed tasks, risks, next phase, and skill-resolution method.

### Requirement: Implementation Readiness and Persistent Progress

The workflow SHALL validate readiness before implementation and maintain change-local progress without replacing tasks.md.

#### Scenario: Artifacts are ready for implementation

- **GIVEN** an implementation is about to be approved
- **WHEN** the operator reviews readiness
- **THEN** it SHALL reread proposal, specs, design, tasks, and the linked requirement when applicable
- **AND** it SHALL verify artifact existence, coherent scope, valid paths, and no blocking open question
- **AND** it SHALL block apply when a required planning artifact is missing.

#### Scenario: Implementation changes a file

- **GIVEN** an implemented OpenSpec change is in progress
- **WHEN** implementation completes one or more tasks
- **THEN** it SHALL update apply-progress.md cumulatively with status, completed tasks, files changed, decisions or deviations, problems, remaining tasks, and skills loaded
- **AND** it SHALL update tasks.md as the authority for completion.

#### Scenario: Progress and tasks diverge

- **GIVEN** apply-progress.md and tasks.md disagree
- **WHEN** work is resumed or prepared for verification
- **THEN** the operator SHALL reconcile the discrepancy before continuing.

### Requirement: Verification Evidence and Archive Readiness

The workflow SHALL persist final verification evidence and SHALL block archive when completion evidence is incomplete.

#### Scenario: Final verification runs

- **GIVEN** implementation tasks are complete
- **WHEN** verification begins
- **THEN** the verifier SHALL inspect native OpenSpec status
- **AND** it SHALL create verify-report.md with conformance against proposal, specs, design, and tasks
- **AND** it SHALL record command, exit code, and summary for OpenSpec validation, typecheck, lint, and build
- **AND** it SHALL record relevant warnings and a PASS or FAIL verdict.

#### Scenario: A verified change is modified

- **GIVEN** verify-report.md has a PASS verdict
- **WHEN** an implementation file or change artifact is modified
- **THEN** the report SHALL be invalid
- **AND** the four verification gates SHALL run again before archive.

#### Scenario: Archive is requested

- **GIVEN** an OpenSpec change is ready to close
- **WHEN** archive readiness is evaluated
- **THEN** the workflow SHALL block archive if tasks.md contains pending work, apply-progress.md is missing or unreconciled, verify-report.md is absent or not PASS, or a linked requirement cannot be updated coherently
- **AND** it SHALL update a linked requirement brief and index to implemented before or with archive
- **AND** it SHALL allow a requirementless technical change to record no requirement as applicable.

#### Scenario: OpenSpec instruction phase is unavailable

- **GIVEN** the installed OpenSpec schema does not expose an instructions artifact for verify or archive
- **WHEN** verification or archive is prepared
- **THEN** the workflow SHALL use openspec status --change <id> --json as the authoritative native preflight
- **AND** it SHALL NOT create a second state engine to emulate the missing instruction phase.
