# Prisma static validation

The base harness validates this reference as files and contracts only. Running
`pnpm validate:harness` does not install Prisma, does not require `DATABASE_URL`,
does not start PostgreSQL or Docker, does not run a migration, seed or reset
data, and does not issue database queries or execute an integration suite.

After a project deliberately installs the Prisma/PostgreSQL capability, it
may run the copied `pnpm db:validate` script. The command is intentionally
limited to `prisma validate` and `prisma generate`; it checks the schema and
generated-client contract without issuing database queries. A syntactically
valid local URL can still be necessary while `prisma.config.ts` loads.

Live connections, migrations, seeds, resets, performance checks, and
integration tests are deliberately human-operated project work. They are not
required for this template's static harness verification.
