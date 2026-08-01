# Next.js + Prisma + PostgreSQL profile

Use this profile only when a Next.js project explicitly adopts Prisma with PostgreSQL, or when it already has Prisma dependencies/configuration. It combines the normal core conventions with:

- `.agent/skills/data-layer/SKILL.md`
- `.agent/skills/prisma-orm/SKILL.md`

The profile is inactive by default. A request to add Prisma may activate it before the packages exist; ordinary mock- or API-backed modules may not.

## Shared application artifacts

Prisma configuration is application-wide: `prisma/schema.prisma`, `prisma.config.ts`, `prisma/migrations/`, `prisma/seed.ts`, generated client, and `lib/prisma.ts` live outside `modules/`.

## Module rule

Each module has one chosen service source for a concrete deployment: mock, external API, or Prisma. Its service exposes the existing typed module contract, while the shared Prisma client and schema remain outside the module.
