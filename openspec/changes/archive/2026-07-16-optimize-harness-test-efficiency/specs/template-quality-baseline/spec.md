## MODIFIED Requirements

### Requirement: Deterministic Quality Gates

The repository SHALL provide fast and final verification commands that execute focused behavior tests and the existing reproducible specification, static-quality, and production-build checks at the appropriate cadence.

#### Scenario: Fast implementation verification succeeds

- **GIVEN** implementation is still changing
- **WHEN** `pnpm verify:fast` is executed with warm caches
- **THEN** it SHALL run unit/component tests, incremental application typecheck, and cached application/reference lint
- **AND** it SHOULD target approximately 90 seconds on the current development machine.

#### Scenario: Complete verification succeeds

- **GIVEN** the supported OpenSpec CLI, Node.js runtime, pnpm version, tracked lockfile, and dependencies are available
- **WHEN** `pnpm verify` is executed
- **THEN** it SHALL run OpenSpec plus harness validation, unit/component tests, non-incremental application plus reference typechecking, application plus reference linting, and production build sequentially
- **AND** it SHALL return exit code 0 only when every application, harness, reference, and test sub-check succeeds
- **AND** it SHALL complete in less than 15 minutes on the current development machine.

#### Scenario: TypeScript errors reach verification

- **WHEN** final TypeScript checking or the Next.js build encounters a type error
- **THEN** verification SHALL fail
- **AND** build configuration SHALL NOT suppress the error
- **AND** final typecheck SHALL NOT depend on incremental compiler state.

#### Scenario: Reference errors reach verification

- **WHEN** reference TypeScript or explicit reference lint encounters an error
- **THEN** verification SHALL fail
- **AND** the reference SHALL NOT rely on ignore defaults to bypass the gate.

#### Scenario: Behavior regression reaches verification

- **WHEN** a unit or component expectation fails
- **THEN** `pnpm verify` SHALL fail before PASS evidence can be created
- **AND** generated test reports and caches SHALL remain outside the SHA-256 source path set.

#### Scenario: Production build runs without font network access

- **WHEN** the production application is built in an environment without access to Google Fonts
- **THEN** the build SHALL use local system font stacks
- **AND** it SHALL NOT attempt to download font assets.
