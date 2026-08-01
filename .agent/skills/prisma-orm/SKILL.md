---
name: prisma-orm
description: Configure or use Prisma ORM with PostgreSQL in this Next.js template. Use only when the user explicitly asks to add, initialize, configure, migrate, seed, test, or use Prisma, or when the repository already contains `prisma`, `@prisma/client`, `prisma/schema.prisma`, or `prisma.config.ts`. Do not use for mock stores, external APIs, or projects without Prisma unless the user asks to introduce it.
---

# Prisma ORM (optional addon)

Use Prisma only after the module's data source has been intentionally chosen.
This skill is an addon to `data-layer`; it does not replace its service/action
boundaries. It is the `prisma-postgresql` stack capability, not a lifecycle
assurance profile.

## Workflow

1. Confirm that Prisma/PostgreSQL is requested or already present. Otherwise,
   keep the existing mock or external-API pattern.
2. Read `.agent/reference/prisma-postgresql/README.md`, `COMPATIBILITY.md`,
   `AUTHORIZATION.md`, and `STATIC-VALIDATION.md` before adopting it. Copy
   shared configuration and output policy into the application root; never
   place schema, migrations, seed, or the singleton in a business module.
3. In an adopted project, keep the Prisma CLI, client, and PostgreSQL adapter
   on aligned Prisma 7 majors. Run its static `db:validate` command after
   schema or generator changes; it validates and generates only, and does not
   replace human review of live database work.
4. Define models, relations, field mappings, constraints, and indexes before
   creating a migration. Migrations, seeds, resets, and deployment commands
   are high-risk, human-operated work: they are outside this addon's static
   verification path.
5. Keep Prisma calls in a Node-runtime, `server-only` module service. Actions
   validate then delegate; hooks call actions. Resolve the actor from a
   project-owned server boundary, apply an explicit authorization scope,
   select only needed fields, map database values to module DTOs, use
   transactions for coupled operations, and translate stable Prisma errors
   into `ServiceResponse` codes. Never import Prisma client code in Middleware
   or Edge runtime code.
6. When a module needs a concrete pattern, read
   `.agent/reference/widget/lib/services/widget.prisma.services.ts.example`.
   Replace the real module's canonical service implementation with one chosen
   source; never leave mock, API, and Prisma implementations active together.

## References

- Read `references/adoption.md` for installation, config, static validation,
  migration, seed, production, and test decisions.
- Read `references/service-patterns.md` for service boundaries and error
  handling.
- The reusable files in `.agent/reference/prisma-postgresql/` are templates,
  not files to execute in this template.
