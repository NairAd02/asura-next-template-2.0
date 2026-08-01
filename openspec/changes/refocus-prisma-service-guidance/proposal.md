## Why

Prisma configuration is version- and project-specific, so encoding its
packages, generator, schema, config, scripts, or database conventions in this
harness risks stale guidance. The harness should instead preserve the stable
service architecture that belongs to this template and direct project-specific
setup to Prisma's current official documentation.

## What Changes

- Remove Prisma configuration, migration, seed, generated-client, version, and
  validation-script templates from the optional harness addon.
- Replace configuration guidance with an explicit instruction to consult the
  current official Prisma documentation when a project chooses to introduce or
  reconfigure Prisma.
- Retain and focus Prisma guidance on the template's service architecture:
  server boundary, canonical service selection, DTO/error mapping, actor and
  authorization boundary, and transactions for coupled operations.
- Reduce the dependency-free harness check to architecture-only service
  conventions; it must not prescribe Prisma configuration or access external
  systems.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `optional-stack-addons`: Refocus the Prisma capability from copyable setup
  configuration to project-agnostic service-architecture guidance.

## Impact

This standard-change affects `.agent` profiles, skills, Prisma references, the
widget Prisma service example, static harness validation/tests, and the
accepted optional-stack-addons specification. It adds no package, service,
credential, migration, seed, or live verification. No product requirement
brief applies because this is internal harness governance.

Success means the harness contains no version-pinned or copyable Prisma setup
instructions, while its service guidance remains mechanically reviewable
without a database. Rollback is a normal revert of these harness-only files;
no application or database state is changed.
