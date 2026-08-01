# Verification Report

## Conformance

- The harness no longer contains a local Prisma configuration mirror, package
  list, version pin, schema, generator, script, seed, or generated-client
  output recipe.
- Prisma setup is explicitly delegated to the current official documentation
  for each adopting project.
- The retained guidance covers template-owned service architecture only:
  server boundary, canonical service selection, DTO/error mapping,
  project-owned actor and authorization policy, and coupled transactions.
- The static validator and its fixtures remain dependency-free and do not
  install Prisma, access official documentation, use credentials, start Docker,
  or contact a database.
- All tasks and schema-v3 progress evidence are reconciled. No linked product
  requirement brief applies.

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
  "startedAt": "2026-08-01T23:47:40.943Z",
  "finishedAt": "2026-08-01T23:48:54.604Z",
  "durationMs": 73660,
  "gates": [
    {
      "id": "specs-harness",
      "command": "pnpm validate:specs",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 3089,
      "summary": "\u2139 skipped 0 | \u2139 todo 0 | \u2139 duration_ms 687.0682 | Harness validation passed: continuous repository invariants and active progress reconciliation are coherent."
    },
    {
      "id": "unit-component",
      "command": "pnpm test:unit:run",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 2726,
      "summary": "Test Files  4 passed (4) | Tests  19 passed (19) | Start at  19:47:44 | Duration  2.03s (transform 436ms, setup 833ms, import 1.43s, tests 171ms, environment 3.64s)"
    },
    {
      "id": "typecheck",
      "command": "pnpm typecheck",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 9978,
      "summary": "> next-template@0.1.0 typecheck:app D:\\My workspace\\Me\\next-template | > tsc --noEmit --incremental false | > next-template@0.1.0 typecheck:reference D:\\My workspace\\Me\\next-template | > tsc --project tsconfig.reference.json --noEmit --incremental false"
    },
    {
      "id": "lint",
      "command": "pnpm lint",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 17945,
      "summary": "> next-template@0.1.0 lint D:\\My workspace\\Me\\next-template | > eslint . && eslint .agent/reference/widget --no-ignore"
    },
    {
      "id": "build",
      "command": "pnpm build",
      "status": "passed",
      "exitCode": 0,
      "durationMs": 39922,
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
    ".agent/reference/widget/lib/services/widget.prisma.services.ts.example",
    ".agent/reference/widget/README.md",
    ".agent/skill-registry.md",
    ".agent/skills/data-layer/SKILL.md",
    ".agent/skills/prisma-orm/references/adoption.md",
    ".agent/skills/prisma-orm/references/service-patterns.md",
    ".agent/skills/prisma-orm/SKILL.md",
    "openspec/changes/refocus-prisma-service-guidance/.openspec.yaml",
    "openspec/changes/refocus-prisma-service-guidance/apply-progress.md",
    "openspec/changes/refocus-prisma-service-guidance/design.md",
    "openspec/changes/refocus-prisma-service-guidance/proposal.md",
    "openspec/changes/refocus-prisma-service-guidance/specs/optional-stack-addons/spec.md",
    "openspec/changes/refocus-prisma-service-guidance/tasks.md",
    "scripts/harness-validation.mjs",
    "scripts/harness-validation.test.mjs"
  ],
  "digest": "26e4ea64885e360d67a98ef8e5cf96ebbec7a3f4c7a741649afd2e2ca44147e1"
}
```
