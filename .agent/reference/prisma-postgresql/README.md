# Prisma + PostgreSQL reference

This is a copyable, non-executable addon for a project that deliberately
adopts Prisma ORM. It is not installed or active in `next-template`.

Read `COMPATIBILITY.md`, `AUTHORIZATION.md`, and `STATIC-VALIDATION.md` before
copying anything. They establish the Prisma 7, project-auth, generated-output,
and no-live-service boundaries for this reference.

## Adoption order

1. Add `@prisma/client`, `@prisma/adapter-pg`, and `pg`; add the Prisma CLI,
   `dotenv`, `tsx`, and PostgreSQL types as development dependencies. Keep the
   Prisma CLI, client, and adapter on aligned majors in the adopting lockfile.
2. Copy `schema.prisma.example`, `prisma.config.ts.example`, and
   `lib/prisma.ts.example` to the corresponding application-wide paths.
3. Merge `.gitignore.prisma.example` into the adopted project's `.gitignore`.
   The generated client is not source of record; generate it in the adopted
   build or CI path.
4. Add the scripts from `package.prisma-scripts.example.json`, set the private
   `DATABASE_URL`, and run `pnpm db:validate`. This static command validates
   the schema and generates the client without querying a database.
5. After a reviewed schema change, run `pnpm db:migrate -- --name
   <migration-name>`, then commit the generated SQL. Copy the seed and run
   `pnpm db:seed` explicitly only when the operator decides to do so. Use
   `pnpm db:deploy` only for committed migrations in a deliberate deployment
   process.

The schema demonstrates a minimal `User`/`Widget` relation for the widget
service example. Replace it with the approved domain model in a real project.
If an authentication capability owns identity tables, use a composition overlay
instead of copying this illustrative `User` model unchanged.

## Deliberate exclusions

The base harness and its validation do not install Prisma, connect to
PostgreSQL, read credentials, run migrations, seed data, reset a database,
start Docker, or execute integration tests. Those are conscious
project/operator decisions after this optional capability is active.
