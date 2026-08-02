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

The repository SHALL validate only the optional Prisma service-architecture
reference through dependency-free, static harness checks. Those checks SHALL
not install Prisma, prescribe or validate Prisma configuration, connect to a
database, read external credentials, start Docker, execute a migration, seed,
reset, or integration suite.

#### Scenario: Normal harness validation runs

- **WHEN** `pnpm validate:harness` validates the repository
- **THEN** it SHALL verify the retained Prisma service-architecture contract
- **AND** it SHALL complete without a Prisma package, PostgreSQL service,
  `DATABASE_URL`, or access to the official documentation.

#### Scenario: A project needs Prisma configuration

- **WHEN** a project deliberately needs Prisma installation or configuration
- **THEN** the harness SHALL route that work to current official Prisma
  documentation
- **AND** its local guidance SHALL not provide a version-pinned setup, schema,
  config, generated-client, script, migration, seed, or deployment recipe.

#### Scenario: An adopter wants Prisma CLI validation

- **WHEN** an adopting project wants to run Prisma CLI validation or client
  generation after choosing its own setup
- **THEN** the harness SHALL direct that command choice to current official
  Prisma documentation and the adopting project's verification process
- **AND** it SHALL not provide a local Prisma CLI script template.

### Requirement: Safe Prisma Reference Adoption

The optional Prisma reference SHALL make its server boundary, canonical
module-service adoption, project-owned persistence boundary, and
authentication/authorization decision points explicit. It SHALL not prescribe
the project's Prisma-generated-client path or setup shape.

#### Scenario: An agent adopts the Prisma module service

- **WHEN** an agent replaces a module's selected source with the Prisma
  reference implementation after the project has configured its own client
- **THEN** it SHALL install the implementation at the module's canonical
  service boundary rather than leave multiple active source variants
- **AND** it SHALL require a project-owned server actor and authorization
  policy before persistence operations are enabled.

#### Scenario: A service uses the project persistence boundary

- **WHEN** the reference service imports its Prisma client and types
- **THEN** it SHALL treat those imports as project-owned boundaries supplied by
  the project's own setup
- **AND** it SHALL not prescribe a generated-client output path, generator,
  config file, or build/CI generation procedure
- **AND** it SHALL keep Prisma client code out of Edge runtime and Middleware.

#### Scenario: Generated client is produced for an adopted project

- **WHEN** an adopting project's own Prisma setup produces a generated client
- **THEN** the harness SHALL treat its imports as project-owned persistence
  boundaries
- **AND** it SHALL not prescribe the generated output path, ignore policy, or
  build/CI generation procedure.

#### Scenario: Coupled bulk mutation is copied

- **WHEN** the reference reports both the existing records and the result of a
  bulk persistence mutation
- **THEN** it SHALL perform the coupled operations in one transaction
- **AND** it SHALL return stable application-level results without exposing
  raw Prisma errors.

### Requirement: Prisma Configuration Delegation

The harness SHALL delegate Prisma installation, initialization, schema,
generator, adapter, environment, migration, seed, deployment, and version
decisions to the current official Prisma documentation for the adopting
project. It SHALL NOT retain a local copyable setup recipe or configuration
fallback for those decisions.

#### Scenario: A project needs Prisma setup or reconfiguration

- **WHEN** an agent is asked to introduce or reconfigure Prisma for a project
- **THEN** the harness SHALL direct it to read the current official Prisma
  documentation before making project-specific setup choices
- **AND** it SHALL not infer those choices from a harness-owned schema, config,
  package, script, seed, or version template.

