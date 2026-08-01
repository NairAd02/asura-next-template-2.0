# Prisma + PostgreSQL reference

This is a copyable, non-executable addon for a project that deliberately adopts Prisma ORM. It is not installed or active in `next-template`.

## Adoption order

1. Add `@prisma/client`, `@prisma/adapter-pg`, and `pg`; add the Prisma CLI, `dotenv`, `tsx`, and PostgreSQL types as development dependencies.
2. Copy `schema.prisma.example`, `prisma.config.ts.example`, and `lib/prisma.ts.example` to the corresponding application-wide paths.
3. Add the scripts from `package.prisma-scripts.example.json` and set the private `DATABASE_URL`.
4. Run `pnpm db:generate`; after a reviewed schema change run `pnpm db:migrate -- --name <migration-name>`, then commit the generated SQL.
5. Copy the seed, run `pnpm db:seed` explicitly, and use `pnpm db:deploy` only for committed migrations in deployed environments.

The schema demonstrates a minimal `User`/`Widget` relation for the widget service example. Replace it with the approved domain model in a real project.
