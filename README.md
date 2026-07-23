# Next Template

A Next.js 16 / React 19 template with strict TypeScript, Tailwind, shadcn/Radix,
next-intl, React Hook Form + Zod, TanStack Table, Vitest, and a proportional
spec-driven development harness.

## Setup

Requires Node.js 20.19+, pnpm 10.30.2, and OpenSpec CLI 1.6.0.

```bash
pnpm install
pnpm dev
```

## Quality commands

```bash
pnpm validate:specs   # active OpenSpec and harness invariants
pnpm validate:harness # focused Node contract tests + repository checks
pnpm test:unit:run    # deterministic unit/component tests
pnpm verify:fast      # cached provisional implementation feedback
pnpm typecheck        # non-incremental application/reference TypeScript
pnpm lint             # full ESLint
pnpm build            # production build
pnpm verify           # one timed, fail-fast final run of all five gates
```

`pnpm verify` streams each gate once, writes an ignored structured result under
`.cache/harness/`, and returns non-zero on failure. `verify:fast` is never
archive evidence.

## Harness model

`docs -> OpenSpec -> .agent -> implementation -> verification -> archive`

- `docs/` holds context, inventory, and curated requirement briefs.
- `openspec/changes/` holds executable planning and evidence.
- `openspec/specs/` holds accepted behavior.
- `.agent/` holds portable roles, skills, contracts, and lazy references.
- `.codex/` maps portable roles to native project agents.

The root classifies one assurance profile:

| Profile | Use | Evidence |
|---|---|---|
| `no-change` | Accepted-contract-preserving repair, internal refactor/docs, or read-only work | Cite the preserved contract/scope and run affected checks; no change progress/report. |
| `standard-change` | Normal implementation or accepted behavior | Approval digest, schema-v3 ownership/execution, focused tests, final runner. |
| `high-risk` | Security/permissions, destructive data, migration, dependency/platform, external boundary | Standard controls plus independent/risk-specific verification. |

Before implementation, OpenSpec status/apply instructions and all planning
artifacts are reconciled. The operator approves an Implementation Approval
Packet bound to the exact planning SHA-256:

```bash
node scripts/validate-harness.mjs --planning-digest <change-id>
```

`apply-progress.md` schema 3 separates planned ownership from execution.
Inline work uses compact records; subagents add budgets/milestones; fallback
requires recovery evidence and a stopped prior writer. Skills are loaded
lazily from `.agent/skill-registry.md`.

A linked product change compares approved and implemented documentation impact:
unchanged no-impact scope records a structured no-op; material impact invokes
the curator. Before final gates, the validator protects accepted
requirement/scenario identity for `MODIFIED` deltas.

After exactly one final `pnpm verify`, finalize PASS evidence and snapshot:

```bash
node scripts/validate-harness.mjs --snapshot <change-id>
node scripts/validate-harness.mjs --archive-ready <change-id>
openspec archive <change-id> --yes --json
```

Any covered edit stales evidence. Confirmation or pre-existing failures never
bypass readiness.

See [developer guide](harness-docs/developer-harness-guide.md), [operator
guide](harness-docs/human-operator-guide.md), [harness index](harness-docs/README.md),
and [.agent reference](.agent/README.md).

## Project structure

`app/` routes; `components/` shared UI; `modules/` domain modules; `messages/`
locales; `docs/` product knowledge; `openspec/` executable specs/changes;
`.agent/` governance/references; `.codex/` native adapters.
