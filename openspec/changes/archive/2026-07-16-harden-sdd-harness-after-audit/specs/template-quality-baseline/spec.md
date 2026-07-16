## MODIFIED Requirements

### Requirement: Generic Template Surface

The production template SHALL contain only generic example domains that are implemented and maintained in the repository, and its maintained code reference SHALL remain compile- and lint-valid.

#### Scenario: Production surface is built

- **GIVEN** the template contains implemented items, categories, users, and dashboard examples
- **WHEN** the production application is built
- **THEN** it SHALL NOT require campaign, CameraScanner, MRZ, or Tesseract code
- **AND** visible examples SHALL use supported generic domains.

#### Scenario: Agent reference is validated

- **GIVEN** `.agent/reference/widget/` is presented as the full module pattern agents should follow
- **WHEN** repository typecheck and lint gates run
- **THEN** the reference SHALL be checked explicitly despite living under `.agent/`
- **AND** it SHALL contain complete desktop table and mobile card examples rather than placeholders.

### Requirement: Deterministic Quality Gates

The repository SHALL provide a single reproducible verification command that executes specification plus harness validation, non-incremental application plus reference typechecking, application plus reference linting, and production build in order.

#### Scenario: Complete verification succeeds

- **GIVEN** the exact supported OpenSpec CLI, Node.js runtime, pnpm version, and tracked lockfile are available
- **WHEN** `pnpm verify` is executed
- **THEN** it SHALL run the four top-level gates sequentially
- **AND** it SHALL return exit code 0 only when every application, harness, and reference sub-check succeeds.

#### Scenario: TypeScript errors reach verification

- **WHEN** TypeScript checking or the Next.js build encounters a type error
- **THEN** verification SHALL fail
- **AND** build configuration SHALL NOT suppress the error
- **AND** typecheck SHALL NOT depend on incremental compiler state.

#### Scenario: Reference errors reach verification

- **WHEN** reference TypeScript or explicit reference lint encounters an error
- **THEN** verification SHALL fail
- **AND** the reference SHALL NOT rely on ignore defaults to bypass the gate.

#### Scenario: Production build runs without font network access

- **WHEN** the production application is built in an environment without access to Google Fonts
- **THEN** the build SHALL use local system font stacks
- **AND** it SHALL NOT attempt to download font assets.

## ADDED Requirements

### Requirement: Reproducible Dependency Resolution

The repository SHALL version the pnpm lockfile and SHALL validate the exact supported global OpenSpec CLI version.

#### Scenario: Dependencies are installed

- **WHEN** a maintainer installs with the declared pnpm version and tracked lockfile
- **THEN** dependency resolution SHALL use the committed lockfile rather than unconstrained manifest ranges.

#### Scenario: Unsupported OpenSpec CLI is used

- **GIVEN** the globally resolved OpenSpec CLI is not version 1.6.0
- **WHEN** harness validation runs
- **THEN** validation SHALL fail with the expected and actual versions.
