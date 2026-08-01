# Next.js + Prisma + PostgreSQL stack capability

Capability ID: `prisma-postgresql`.

Use this capability only when a Next.js project explicitly adopts Prisma with
PostgreSQL, or when it already has Prisma dependencies/configuration. It
combines the normal core conventions with:

- `.agent/skills/data-layer/SKILL.md`
- `.agent/skills/prisma-orm/SKILL.md`

The capability is inactive by default. A request to add Prisma may activate it
before the packages exist; ordinary mock- or API-backed modules may not. It
does not add dependencies, a `DATABASE_URL`, or a database service to the base
template.

## Shared application artifacts

Prisma configuration is application-wide: `prisma/schema.prisma`, `prisma.config.ts`, `prisma/migrations/`, `prisma/seed.ts`, generated client, and `lib/prisma.ts` live outside `modules/`.

The reference supports only static harness verification. An adopted project
may run its own `db:validate` command to validate the schema and generate the
client; migrations, seeds, resets, live connections, and integration testing
remain deliberate human-operated work outside this profile's base checks.

## Module rule

Each module has one chosen service source for a concrete deployment: mock, external API, or Prisma. Its service exposes the existing typed module contract, while the shared Prisma client and schema remain outside the module.

If an authentication capability is also selected, its composition overlay owns
the current-actor adapter and identity-table boundary. Do not copy the example
`User` model into an authentication provider's schema without an explicit
domain decision.
