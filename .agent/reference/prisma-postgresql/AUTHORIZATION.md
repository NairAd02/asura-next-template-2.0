# Prisma authorization boundary

This reference intentionally does not implement an authentication provider or
authorization policy. Before a Prisma service is enabled, the adopting project
must provide a server-only `@/lib/auth/current-actor` module with a real
current-actor implementation, for example a `requireCurrentActor()` function
that returns a typed actor with an `id` or rejects an unauthenticated request.

The service reference imports that boundary instead of declaring a function
that disappears at runtime. There is no default fallback to copy.

## Required adoption decisions

1. Define how the server resolves the actor from the selected authentication
   capability; never accept an actor ID from client input.
2. Define the policy that authorizes each read and mutation. Audit fields such
   as `createdById` and `updatedById` do not authorize access by themselves.
3. Apply the policy's owner, role, organization, or tenant scope to every
   Prisma `where` clause before enabling the service.
4. Return the project's stable unauthenticated/forbidden response codes rather
   than leaking provider or database errors.

If Better Auth is later selected, add a composition overlay that owns this
adapter and the identity-table boundary. Do not merge its schema with the
illustrative `User` model by convention alone.
