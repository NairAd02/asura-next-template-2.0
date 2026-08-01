## Context

The current harness keeps Prisma/PostgreSQL out of the base runtime and models
it as an optional profile. Its references are copyable rather than executable,
so the normal harness checks do not prove that their adoption rules remain
coherent. The user explicitly excludes database-backed integration testing,
host PostgreSQL, Docker, and credential-dependent verification from this
change.

## Goals / Non-Goals

**Goals:**

- Keep the base template dependency- and service-free while making the
  optional Prisma addon mechanically reviewable.
- Make capability selection, Prisma 7 compatibility, generated-client
  lifecycle, server/auth boundaries, and static adopter checks unambiguous.
- Preserve the module service contract while preventing a mock, API, and
  Prisma implementation from being active together.
- Give future Better Auth or payment guidance a composable pattern without
  pre-installing or implementing those technologies.

**Non-Goals:**

- Installing Prisma, PostgreSQL, Docker, Testcontainers, or any new package in
  the base template.
- Running migrations, seeds, reset commands, live queries, or integration
  tests from `pnpm verify` or `pnpm validate:harness`.
- Providing a default authentication provider, authorization policy, tenant
  model, or Better Auth implementation.
- Renaming the existing `.agent/profiles/` directory; terminology changes are
  sufficient and avoid needless path churn.

## Decisions

### 1. Keep optional stack guidance as lazy capability profiles

The existing directory is described consistently as **stack capability
profiles**. Lifecycle `no-change`, `standard-change`, and `high-risk` remain
**assurance profiles**. A capability is selected only by an explicit request
or durable repository evidence; it does not install packages or change
runtime behavior. Cross-capability concerns (for example, Better Auth plus
Prisma) use a small composition overlay rather than duplicating either core
skill.

This retains the current low-context, registry-driven design. A
machine-readable stack manifest is deliberately deferred: at the present
scale, it would create another state source and validator without adding
enough value.

### 2. Use two static validation layers, neither database-backed

`pnpm validate:harness` gains a dependency-free validator for the repository
reference contract. It checks required reference artifacts and invariants such
as the Prisma 7 generator/configuration shape, generated-client ignore
fragment, static-only script, canonical service adoption instructions, and the
absence of an erased runtime authentication declaration.

An adopted Prisma project receives a `db:validate` script template that runs
`prisma validate` and `prisma generate`. That command is opt-in, requires the
adopter's already-installed Prisma CLI and a syntactically valid configuration
environment, and must not execute a migration, seed, reset, or query. The
base package does not add the script or dependencies.

An isolated Prisma fixture or a live PostgreSQL service would test more, but
both introduce package/service management that the user has explicitly chosen
to keep outside the harness.

### 3. Make generated client and runtime boundaries explicit

The reference continues to generate into `lib/generated/prisma`, supplies a
copyable ignore fragment for that exact output, and directs adopters to run
generation in their activated build/CI path. It documents Prisma ORM 7 as the
compatibility target and requires aligned Prisma CLI, client, and adapter
major versions recorded by the adopting project's lockfile.

The shared client remains `server-only` and Node-runtime-only. Prisma client
code is forbidden in Middleware or Edge runtime code. No default build hook is
added to the base template because it would make inactive projects depend on
Prisma.

### 4. Replace the erased actor placeholder with a required project boundary

The Prisma service reference imports a project-owned server auth boundary
instead of declaring a function that erases at runtime. The addon documents
that an adopter must implement current-actor resolution and authorization
scope before copying the service. Identity/audit fields alone do not grant
access; reads and mutations require a project-specific policy and scope.

The generic reference cannot safely prescribe owner-, role-, or tenant-based
authorization, so it provides an explicit decision checklist rather than an
unsafe permissive fallback. A Better Auth composition overlay may later own
the concrete adapter and identity tables.

### 5. Make reference mutation semantics internally consistent

The copyable bulk service methods use a transaction for their coupled
existence check and mutation, or otherwise explicitly declare best-effort
semantics. This change selects transactions so the existing service guidance
and example agree. Reset, migration, and seed instructions remain clearly
human-operated, high-risk actions outside static validation.

## Risks / Trade-offs

- [Static checks cannot prove generated Prisma APIs] -> The harness validates
  its own reference contract; an adopter runs `db:validate` after selecting
  pinned dependencies. Live database behavior remains consciously human-run.
- [Documentation could drift from files] -> The dependency-free validator and
  focused negative fixture enforce the important paths and phrases.
- [A generic authorization sample could imply a policy] -> The reference
  names the boundary and requires an adopter decision instead of shipping a
  permissive implementation.
- [Extra documents could increase context] -> They are lazy references loaded
  only through the optional Prisma capability.

## Migration Plan

1. Update the capability/profile terminology and optional Prisma skill.
2. Add lightweight compatibility, authorization, generated-output, and static
   verification reference material; update the Prisma service example.
3. Extend the existing Node-only harness validator and its tests.
4. Run scoped validation. No data migration, package installation, or runtime
   deployment occurs.

Rollback is a normal revert of the affected harness/reference files; no
database state or external resource is created.

## Open Questions

- None. The user explicitly selected static-only verification and human-owned
  live database validation.
