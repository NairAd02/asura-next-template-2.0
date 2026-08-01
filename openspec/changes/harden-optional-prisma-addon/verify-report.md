# Verification Report

## Conformance

- The approved change remains static-only: the base template has no Prisma
  packages, Prisma scripts, PostgreSQL service, Docker dependency, credential,
  migration, seed, reset, live-query, or integration-test requirement.
- The optional capability documents its compatibility, generated output,
  Node-only runtime, canonical service, and project-owned authentication and
  authorization boundaries.
- The dependency-free harness validator and focused positive/negative fixtures
  cover the reference contract without contacting a database.
- All tasks and schema-v3 progress evidence are reconciled. No linked product
  requirement brief applies.
- The final runner executed its five required gates exactly once, in order,
  and no gate failed.

## Warnings

- Next.js reported that `metadataBase` is not set and used
  `http://localhost:3000` for social-image URL resolution. This existing
  application warning is outside the accepted harness scope and did not
  suppress a verification gate.

## Verdict

PASS

## Verification Run

```json
{
  "schemaVersion": 1,
  "kind": "HARNESS_VERIFY_RESULT_V1",
  "status": "PASS",
  "startedAt": "2026-08-01T16:36:41.516Z",
  "finishedAt": "2026-08-01T16:38:28.445Z",
  "durationMs": 106929,
  "gates": [
    {
      "id": "specs-harness",
      "command": "pnpm validate:specs",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 2438,
      "summary": "\u2139 skipped 0 | \u2139 todo 0 | \u2139 duration_ms 649.3214 | Harness validation passed: continuous repository invariants and active progress reconciliation are coherent."
    },
    {
      "id": "unit-component",
      "command": "pnpm test:unit:run",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 2567,
      "summary": "Test Files  4 passed (4) | Tests  19 passed (19) | Start at  12:36:44 | Duration  1.92s (transform 406ms, setup 763ms, import 1.60s, tests 155ms, environment 3.24s)"
    },
    {
      "id": "typecheck",
      "command": "pnpm typecheck",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 11829,
      "summary": "> next-template@0.1.0 typecheck:app D:\\My workspace\\Me\\next-template | > tsc --noEmit --incremental false | > next-template@0.1.0 typecheck:reference D:\\My workspace\\Me\\next-template | > tsc --project tsconfig.reference.json --noEmit --incremental false"
    },
    {
      "id": "lint",
      "command": "pnpm lint",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 17391,
      "summary": "> next-template@0.1.0 lint D:\\My workspace\\Me\\next-template | > eslint . && eslint .agent/reference/widget --no-ignore"
    },
    {
      "id": "build",
      "command": "pnpm build",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 72703,
      "summary": "\u2514 \u25cb /auth/error | \u0192 Proxy (Middleware) | \u25cb  (Static)   prerendered as static content | \u0192  (Dynamic)  server-rendered on demand"
    }
  ]
}
```

## Invalidation

Any later covered implementation, test, configuration, planning, task,
progress, or linked-requirement edit invalidates this PASS and requires a new
authoritative final run plus snapshot.

## Evidence Snapshot

```json
{
  "schemaVersion": 1,
  "algorithm": "sha256",
  "paths": [
    ".agent/profiles/nextjs-prisma-postgresql.md",
    ".agent/profiles/README.md",
    ".agent/README.md",
    ".agent/reference/prisma-postgresql/.gitignore.prisma.example",
    ".agent/reference/prisma-postgresql/AUTHORIZATION.md",
    ".agent/reference/prisma-postgresql/COMPATIBILITY.md",
    ".agent/reference/prisma-postgresql/lib/prisma.ts.example",
    ".agent/reference/prisma-postgresql/package.prisma-scripts.example.json",
    ".agent/reference/prisma-postgresql/README.md",
    ".agent/reference/prisma-postgresql/STATIC-VALIDATION.md",
    ".agent/reference/widget/lib/services/widget.prisma.services.ts.example",
    ".agent/reference/widget/README.md",
    ".agent/skill-registry.md",
    ".agent/skills/data-layer/SKILL.md",
    ".agent/skills/prisma-orm/references/adoption.md",
    ".agent/skills/prisma-orm/references/service-patterns.md",
    ".agent/skills/prisma-orm/SKILL.md",
    "openspec/changes/harden-optional-prisma-addon/.openspec.yaml",
    "openspec/changes/harden-optional-prisma-addon/apply-progress.md",
    "openspec/changes/harden-optional-prisma-addon/design.md",
    "openspec/changes/harden-optional-prisma-addon/proposal.md",
    "openspec/changes/harden-optional-prisma-addon/specs/optional-stack-addons/spec.md",
    "openspec/changes/harden-optional-prisma-addon/tasks.md",
    "scripts/harness-validation.mjs",
    "scripts/harness-validation.test.mjs"
  ],
  "digest": "7b6f6d3b01dba2b51c85ae6f29d97921a26ceec0b2754ebc88df7d09a1e56420"
}
```
