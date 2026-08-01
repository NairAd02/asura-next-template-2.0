## Why

The optional Prisma/PostgreSQL guidance establishes useful boundaries, but its
selection terminology, generated-client policy, static validation path, and
authentication boundary are not yet explicit enough for reliable reuse. The
base Next.js template must remain lightweight: it must not require PostgreSQL,
Docker, external credentials, or Prisma packages merely to validate the
harness.

## What Changes

- Define optional stack capability profiles as distinct from lifecycle
  assurance profiles, and document how future capabilities and their
  composition overlays are selected lazily.
- Harden the Prisma/PostgreSQL optional addon with an explicit Prisma 7
  compatibility boundary, generated-client ignore/build policy, Node-only
  runtime boundary, and a static adopter verification path.
- Add dependency-free harness validation and focused fixtures for the
  copyable Prisma reference contract; the optional adopter command may run
  Prisma validation and client generation, but it must not connect to a
  database.
- Replace unsafe copy-paste ambiguities in the Prisma service reference with
  an explicit server-side actor/authorization boundary, canonical service
  adoption rule, and consistent coupled-mutation semantics.
- Document that migrations, seeds, resets, live connections, and integration
  testing are intentionally outside this harness validation scope.

## Capabilities

### New Capabilities

- `optional-stack-addons`: Lightweight, lazily selected stack-capability
  guidance and static contract validation for optional Prisma/PostgreSQL
  adoption.

### Modified Capabilities

- None.

## Impact

Affected areas are `.agent` skills, profiles, references, the harness
validator/tests, and package scripts. No application runtime dependency,
PostgreSQL service, Docker image, credential, migration, seed execution, or
integration suite is added. The change uses the `standard-change` assurance
profile because it adds accepted harness behavior and validation.
