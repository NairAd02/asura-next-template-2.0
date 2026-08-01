# Prisma PostgreSQL compatibility

This reference targets Prisma ORM 7 with the `prisma-client` generator, a
custom generated-client output, `prisma.config.ts`, and `@prisma/adapter-pg`.
It assumes the Node.js runtime declared by the adopting Next.js project.

## Version boundary

- Keep `prisma`, `@prisma/client`, and `@prisma/adapter-pg` on aligned major
  versions; the adopting lockfile records the exact compatible releases.
- When changing their major, reread the Prisma upgrade notes, update this
  reference deliberately, and run the adopter's `pnpm db:validate` command.
- The custom output is `lib/generated/prisma`. It is generated, ignored, and
  recreated by the activated project's build or CI path; it is not committed
  reference source.

## Runtime boundary

`lib/prisma.ts` and every service importing it are Node-runtime server code.
They are not valid imports for client components, Middleware, or Edge runtime
routes. A project that deliberately targets another runtime must choose and
validate its own supported adapter/runtime design instead of copying this
reference unchanged.

## Static boundary

`pnpm db:validate` runs schema validation and client generation only. It can
need a syntactically valid `DATABASE_URL` while `prisma.config.ts` loads, but
it does not require a reachable database and does not replace operator review
of migrations, seeds, resets, or live behavior.
