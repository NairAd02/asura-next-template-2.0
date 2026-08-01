## 1. Capability terminology and routing

- [x] 1.1 [orchestrator] Distinguish lifecycle assurance profiles from lazy stack capability profiles in the root harness, registry, and profile guidance without renaming existing paths.
- [x] 1.2 [orchestrator] Document compositional overlays and the explicit static-only, no-external-service boundary for future optional capabilities.

## 2. Prisma static adoption references

- [x] 2.1 [orchestrator] Add copyable Prisma 7 compatibility, generated-client ignore, static-validation, and authorization-boundary reference material with no default auth implementation.
- [x] 2.2 [orchestrator] Update the Prisma skill, profile, adoption instructions, scripts template, shared-client guidance, and widget Prisma service so canonical adoption, Node-only use, actor/policy decisions, and coupled bulk transactions are unambiguous.

## 3. Dependency-free harness coverage

- [x] 3.1 [orchestrator] Extend the Node-only harness validator to enforce the optional Prisma reference contract while ensuring the base package remains free of Prisma scripts and dependencies.
- [x] 3.2 [orchestrator] Add focused positive and negative validator tests for the static-only Prisma contract without installing packages or accessing a database.

## 4. Verification and evidence

- [x] 4.1 [orchestrator] Run OpenSpec validation plus focused harness and reference typecheck checks; confirm no PostgreSQL service, Docker, credential, migration, seed, reset, or integration suite is used.
- [x] 4.2 [orchestrator] Freeze the approved scope and run the single authoritative `pnpm verify` runner exactly once; reconcile task and schema-v3 progress evidence.
