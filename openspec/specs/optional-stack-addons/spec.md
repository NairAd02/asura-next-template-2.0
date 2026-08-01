# optional-stack-addons Specification

## Purpose
TBD - created by archiving change harden-optional-prisma-addon. Update Purpose after archive.
## Requirements
### Requirement: Optional Stack Capability Selection

The harness SHALL distinguish lifecycle assurance profiles from lazy stack
capability profiles. A stack capability profile SHALL be selected only when a
user explicitly requests it or durable repository evidence establishes it,
and it SHALL NOT install packages or activate runtime behavior by itself.

#### Scenario: Base project has no Prisma evidence

- **WHEN** a task concerns a mock- or API-backed module and the repository has
  no Prisma request or durable Prisma configuration
- **THEN** the harness SHALL keep the Prisma/PostgreSQL capability inactive
- **AND** it SHALL NOT require Prisma packages, credentials, or a database
  service.

#### Scenario: Future capabilities interact

- **WHEN** an adopter selects two optional capabilities with an integration
  concern, such as authentication and Prisma persistence
- **THEN** the harness SHALL describe their integration as a composition
  overlay
- **AND** it SHALL NOT duplicate either capability's core rules or make either
  capability globally active.

### Requirement: Prisma Static Reference Validation

The repository SHALL validate the optional Prisma/PostgreSQL reference through
dependency-free, static harness checks. Those checks SHALL not install Prisma,
connect to PostgreSQL, read external credentials, start Docker, execute a
migration, execute a seed, execute a reset, or run an integration suite.

#### Scenario: Normal harness validation runs

- **WHEN** `pnpm validate:harness` validates the repository
- **THEN** it SHALL verify the required Prisma reference contract and its
  static-only adoption rules
- **AND** it SHALL complete without a PostgreSQL service or `DATABASE_URL`.

#### Scenario: An adopter wants Prisma CLI validation

- **WHEN** a project has deliberately installed and activated the
  Prisma/PostgreSQL capability
- **THEN** its copyable script guidance SHALL provide a static command that
  runs Prisma schema validation and client generation only
- **AND** it SHALL document that migrations, seeds, resets, live connections,
  and integration verification remain human-operated and out of scope.

### Requirement: Safe Prisma Reference Adoption

The optional Prisma reference SHALL make its generated-client lifecycle,
server boundary, canonical module-service adoption, and authentication
decision points explicit.

#### Scenario: An agent adopts the Prisma module service

- **WHEN** an agent replaces a module's selected source with the Prisma
  reference implementation
- **THEN** it SHALL install the implementation at the module's canonical
  service boundary rather than leave multiple active source variants
- **AND** it SHALL require a project-owned server actor and authorization
  policy before persistence operations are enabled.

#### Scenario: Generated client is produced for an adopted project

- **WHEN** an adopter uses the reference's custom Prisma client output
- **THEN** the reference SHALL provide an ignore policy for that output and
  direct generation through the activated project's build or CI path
- **AND** it SHALL keep Prisma client code out of Edge runtime and Middleware.

#### Scenario: Coupled bulk mutation is copied

- **WHEN** the reference reports both the existing records and the result of a
  bulk persistence mutation
- **THEN** it SHALL perform the coupled operations in one transaction
- **AND** it SHALL return stable application-level results without exposing
  raw Prisma errors.

