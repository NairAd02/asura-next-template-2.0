# Prisma service pattern

The shared `lib/prisma.ts` owns the only `PrismaClient` singleton. Import it from a server-only module service; do not construct a client per request or expose it to client components.

Define reusable `select` objects with `satisfies Prisma.<Model>Select`, derive payload types from them, and map dates, enums, and relations to the module DTO. Build `where` and ordering from an allow-list, not raw client strings. Use `$transaction` for a list/count pair and for coupled mutations. Map known errors such as unique conflicts and missing records to stable service errors; log unexpected failures without leaking database details.

The widget Prisma service template demonstrates these rules while preserving the same exports as the mock reference service.
