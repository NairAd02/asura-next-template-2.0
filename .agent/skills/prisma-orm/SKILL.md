---
name: prisma-orm
description: Configure or use Prisma ORM with PostgreSQL in this Next.js template. Use only when the user explicitly asks to add, initialize, configure, migrate, seed, test, or use Prisma, or when the repository already contains `prisma`, `@prisma/client`, `prisma/schema.prisma`, or `prisma.config.ts`. Do not use for mock stores, external APIs, or projects without Prisma unless the user asks to introduce it.
---

# Prisma ORM (optional addon)

Use Prisma only after the module's data source has been intentionally chosen.
This skill is an addon to `data-layer`; it does not replace its service/action boundaries.

## Workflow

1. Confirm that Prisma is requested or already present. Otherwise, keep the existing mock or external-API pattern.
2. Read `.agent/reference/prisma-postgresql/README.md` before adding the shared configuration. Copy its setup, schema, singleton, scripts, and seed templates into the application root; never place them in a business module.
3. Define models, relations, field mappings, constraints, and indexes in the schema before creating a migration. Generate the client after every schema change, commit generated migration SQL, and deploy only committed migrations outside development.
4. Keep Prisma calls in a `server-only` module service. Actions validate then delegate; hooks call actions. Select only needed fields, map database values to module DTOs, use transactions for coupled reads/writes, and translate stable Prisma errors into `ServiceResponse` codes.
5. When a module needs a concrete pattern, read `.agent/reference/widget/lib/services/widget.prisma.services.ts.example`. Copy one source implementation for the real module; never switch among mock, API, and Prisma at runtime.

## References

- Read `references/adoption.md` for installation, config, migration, seed, production, and test decisions.
- Read `references/service-patterns.md` for service boundaries and error handling.
- The reusable files in `.agent/reference/prisma-postgresql/` are templates, not files to execute in this template.
