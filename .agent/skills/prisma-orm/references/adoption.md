# Prisma PostgreSQL adoption

Use this addon only for a project that will persist data with Prisma. Install the packages, create the shared `prisma/` and `lib/prisma.ts` files from the reference templates, and set a private `DATABASE_URL` in `.env`.

Use `prisma migrate dev --name <name>` only after the schema has been reviewed. Commit the schema and generated SQL. Run `prisma migrate deploy` in deployment environments. Prisma 7 does not seed automatically during migration commands; run `prisma db seed` explicitly.

Use a separate disposable PostgreSQL database for integration tests. Apply migrations, seed only when the scenario needs fixtures, clean data after each case, and never point tests at a development or production URL.

Read `.agent/reference/prisma-postgresql/README.md` for the concrete commands and copyable files.
