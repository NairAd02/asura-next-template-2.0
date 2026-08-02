## Context

The archived optional Prisma/PostgreSQL addon currently contains a Prisma 7
setup: package guidance, schema/config/client/seed templates, generated-output
policy, scripts, and a validator for those exact choices. Those choices belong
to a concrete project and to the current Prisma documentation, not to this
template's durable service architecture.

This is requirementless internal harness work. It uses the `standard-change`
assurance profile because it modifies the accepted optional-stack-addons
contract, but it adds no runtime dependency, database, credential, or external
verification.

## Goals / Non-Goals

**Goals:**

- Keep only the Prisma-in-service conventions that are specific to this
  template: project-owned persistence boundary, server-only use, canonical
  module service, DTO/error mapping, explicit actor/policy scope, and coupled
  transaction semantics.
- Route every Prisma installation, initialization, schema, generator, adapter,
  environment, migration, seed, deployment, and version decision to the
  current official Prisma documentation for the adopting project.
- Keep a small dependency-free static check for the retained service
  architecture only.

**Non-Goals:**

- Encoding a replacement Prisma setup, version, package list, database
  provider, script, generated-output path, or configuration fallback.
- Installing Prisma, opening official documentation automatically, connecting
  to a database, or testing migrations and integration behavior.
- Implementing authentication, authorization policy, Better Auth, or a
  project persistence client.

## Decisions

### 1. Official documentation owns Prisma setup; the harness owns service use

The `prisma-orm` skill will begin with a setup handoff: if Prisma must be
introduced or reconfigured, the agent reads the current official Prisma
documentation and adapts that setup to the project. If that documentation is
unavailable, it reports the block instead of reviving stale local setup
instructions.

Once the project exposes a working Prisma client boundary, the skill supplies
only the template's service conventions. This avoids treating an old local
template as a source of truth for a fast-moving ORM.

Alternative considered: retain a version-pinned “known good” setup. Rejected
because it duplicates upstream maintenance and conflicts with the operator's
decision to use the latest official documentation per project.

### 2. Remove configuration references rather than maintain a partial mirror

Remove `.agent/reference/prisma-postgresql/` configuration artifacts,
including schema, config, client, seed, scripts, compatibility, static
validation, generated-output ignore, and setup README material. Move the
durable authorization/service-boundary teaching into the Prisma skill's
service-pattern reference, and retain the module-local widget Prisma service
example.

The existing capability path may remain for routing compatibility, but it will
describe service architecture and the official-docs handoff rather than a
PostgreSQL configuration recipe.

### 3. Make the service example configuration-agnostic

The widget Prisma service example will import through project-owned persistence
boundaries rather than prescribe a generated-client output path. Its comments
will state that those boundaries are supplied by the project's official Prisma
setup and that the example does not define them. It will retain `server-only`,
project-owned current-actor enforcement, explicit policy scope, typed mapping,
stable errors, a single canonical service source, and transaction callbacks
for coupled bulk operations.

Alternative considered: replace the service example with pseudocode. Rejected
because a TypeScript reference is more useful for the conventions the harness
is deliberately preserving.

### 4. Keep only architecture-level static validation

Replace the current broad Prisma-reference fixture with a small validator that
checks the retained skill/reference/service contract. It will not require a
Prisma package, schema/config file, environment variable, script, specific
version, database provider, generated path, or external command. It will
enforce the absence of a local setup mirror and guard the service patterns
that are the template's own architecture.

## Risks / Trade-offs

- [Agents may need current upstream guidance] -> The skill makes that explicit
  and must surface unavailable official documentation rather than guess.
- [A service example still needs imports] -> Treat them as project-owned
  persistence boundaries, not as generated-client setup instructions.
- [Removing static setup checks reduces configuration coverage] -> That is
  intentional: configuration correctness is delegated to Prisma documentation
  and the adopting project's own verification.

## Migration Plan

1. Rewrite profile and Prisma skill routing around the official-docs handoff
   and retained service architecture.
2. Remove local setup artifacts and migrate the useful auth/service teaching
   into the service-pattern reference and widget example.
3. Replace configuration-shape validation and fixtures with architecture-only
   checks, then update the accepted delta specification.
4. Run dependency-free harness checks, reference typecheck, and the one final
   repository verification runner. Rollback is a normal revert; no data or
   external state exists.

## Open Questions

- None. The operator has selected official current documentation for setup and
  retained only service-architecture guidance in the harness.
