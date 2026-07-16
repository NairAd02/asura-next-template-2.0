## ADDED Requirements

### Requirement: Tiered Feedback and Test Ownership

REQ-005 SHALL provide fast implementation feedback separately from final reproducible evidence, and the executor that implements behavior SHALL own its focused deterministic tests.

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

- **WHEN** a completed behavior change has integration or visual risk not covered efficiently by unit/component tests
- **THEN** the verifier SHALL run a short explicit integrated-browser smoke
- **AND** routine deterministic scenarios SHALL NOT be duplicated into an exhaustive browser matrix.

## MODIFIED Requirements

### Requirement: Verification Evidence and Archive Readiness

The workflow SHALL persist reproducible final verification evidence across specification, automated behavior, static quality, and production-build gates and SHALL block archive when completion evidence is incomplete, failed, or stale.

#### Scenario: Final verification runs

- **GIVEN** implementation and automated behavior tasks are complete
- **WHEN** verification begins
- **THEN** the verifier SHALL inspect native OpenSpec status
- **AND** it SHALL run OpenSpec plus harness validation, unit/component tests, non-incremental application plus reference typechecking, application plus reference linting, and the production build through `pnpm verify`
- **AND** it SHALL perform only explicitly required short browser-smoke assertions after the command
- **AND** it SHALL finalize verification task checkboxes and progress before writing the report
- **AND** it SHALL create `verify-report.md` with conformance, exact commands, exit codes, durations, warnings, browser-smoke results when applicable, handoffs, verdict, and a SHA-256 snapshot of covered files.

#### Scenario: A verified change is modified

- **GIVEN** `verify-report.md` has a PASS verdict and snapshot
- **WHEN** a covered implementation, test, configuration, planning, task, progress, or linked requirement file changes
- **THEN** archive readiness validation SHALL fail
- **AND** `pnpm verify`, applicable smoke assertions, and the report SHALL be regenerated.

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
