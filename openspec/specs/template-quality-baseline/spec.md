# template-quality-baseline Specification

## Purpose
Defines the reusable template's supported generic surface and the deterministic quality baseline required for trustworthy local and AI-assisted development.
## Requirements
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

The repository SHALL provide fast and final verification commands that execute
focused behavior tests and the existing reproducible specification,
static-quality, and production-build checks at the appropriate cadence, and
the final command SHALL expose evidence from one execution of each gate.

#### Scenario: Fast implementation verification succeeds

- **GIVEN** implementation is still changing
- **WHEN** `pnpm verify:fast` is executed with warm caches
- **THEN** it SHALL run unit/component tests, incremental application
  typecheck, and cached application/reference lint
- **AND** it SHOULD target approximately 90 seconds on the current development
  machine.

#### Scenario: Complete verification succeeds

- **GIVEN** the supported OpenSpec CLI, Node.js runtime, pnpm version, tracked
  lockfile, and dependencies are available
- **WHEN** `pnpm verify` is executed
- **THEN** one dependency-free runner SHALL execute OpenSpec plus harness
  validation, unit/component tests, non-incremental application plus reference
  typechecking, application plus reference linting, and production build
  sequentially
- **AND** it SHALL execute each required gate exactly once
- **AND** it SHALL emit machine-readable exact commands, exit codes, per-gate
  durations, summaries, aggregate duration, and final status
- **AND** it SHALL return exit code 0 only when every application, harness,
  reference, and test sub-check succeeds
- **AND** it SHALL complete in less than 15 minutes on the current development
  machine.

#### Scenario: TypeScript errors reach verification

- **WHEN** final TypeScript checking or the Next.js build encounters a type
  error
- **THEN** verification SHALL fail
- **AND** build configuration SHALL NOT suppress the error
- **AND** final typecheck SHALL NOT depend on incremental compiler state.

#### Scenario: Reference errors reach verification

- **WHEN** reference TypeScript or explicit reference lint encounters an error
- **THEN** verification SHALL fail
- **AND** the reference SHALL NOT rely on ignore defaults to bypass the gate.

#### Scenario: Behavior regression reaches verification

- **WHEN** a unit or component expectation fails
- **THEN** `pnpm verify` SHALL fail before later gates or PASS evidence can be
  created
- **AND** generated timing output, test reports, and caches SHALL remain outside
  the SHA-256 source path set.

#### Scenario: Production build runs without font network access

- **WHEN** the production application is built in an environment without access
  to Google Fonts
- **THEN** the build SHALL use local system font stacks
- **AND** it SHALL NOT attempt to download font assets.

### Requirement: Missing Item Lookup Semantics

The item service SHALL represent a missing item as a failed service response rather than successful nullable data.

#### Scenario: Item ID does not exist

- **GIVEN** no item matches the requested ID
- **WHEN** `getItemById` is called
- **THEN** it SHALL return `success: false`
- **AND** the response code SHALL be `NOT_FOUND`
- **AND** the success branch SHALL remain typed as `ItemDetails`.

### Requirement: Supported Locale Request Entry Point

The template SHALL use the supported Next.js Proxy file convention for locale request handling while preserving the configured next-intl matcher.

#### Scenario: Locale proxy is discovered

- **WHEN** Next.js builds or runs the application
- **THEN** it SHALL discover the locale handler from `proxy.ts`
- **AND** the existing next-intl routing behavior and exclusions SHALL remain active
- **AND** no deprecated middleware convention warning SHALL be emitted.

### Requirement: Reproducible Dependency Resolution

The repository SHALL version the pnpm lockfile and SHALL validate the exact supported global OpenSpec CLI version.

#### Scenario: Dependencies are installed

- **WHEN** a maintainer installs with the declared pnpm version and tracked lockfile
- **THEN** dependency resolution SHALL use the committed lockfile rather than unconstrained manifest ranges.

#### Scenario: Unsupported OpenSpec CLI is used

- **GIVEN** the globally resolved OpenSpec CLI is not version 1.6.0
- **WHEN** harness validation runs
- **THEN** validation SHALL fail with the expected and actual versions.

