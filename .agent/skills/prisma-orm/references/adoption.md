# Prisma PostgreSQL adoption

Use this addon only for a project that will persist data with Prisma. Install
the packages in the adopted project, align the Prisma CLI/client/adapter major,
create the shared `prisma/` and `lib/prisma.ts` files from the reference
templates, and set a private `DATABASE_URL` there.

Copy the generated-client ignore fragment and integrate `pnpm db:generate` in
the adopted project's build or CI path. `pnpm db:validate` runs only `prisma
validate` and `prisma generate`; it does not issue queries, migrations, seeds,
or resets. Configuration loading can require a syntactically valid local URL,
but the static command does not require a reachable PostgreSQL service.

Use `prisma migrate dev --name <name>` only after the schema has been reviewed.
Commit the schema and generated SQL. Run `prisma migrate deploy` only through
the project's deliberate deployment process. Prisma 7 does not seed
automatically during migration commands; run `prisma db seed` explicitly when
the operator decides it is appropriate.

This harness intentionally does not prescribe integration testing. If an
adopter later chooses it, the human operator owns the disposable database,
credentials, cleanup, and verification process; it must never point at a
development or production URL by accident.

Read `.agent/reference/prisma-postgresql/README.md` for concrete commands and
copyable files, and `AUTHORIZATION.md` before enabling a service.
