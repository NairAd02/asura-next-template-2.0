# Next Template

A reusable Next.js application template with a project-specific AI development harness based on Spec-Driven Development (SDD). It combines a working App Router application with explicit product context, executable OpenSpec changes, technical skills, specialized roles, and deterministic verification gates.

## Included

- Next.js 16 App Router, React 19, and strict TypeScript.
- Tailwind CSS, shadcn/ui, and Radix UI primitives.
- next-intl locale routing with English and Spanish messages.
- Authentication and role-aware navigation examples.
- Generic items, categories, users, and dashboard modules backed by in-memory data.
- React Hook Form + Zod, TanStack Table, and Sonner conventions.
- A hybrid SDD harness under docs/, openspec/, and .agent/.

## Prerequisites

- Node.js 20.19.0 or newer.
- pnpm 10.30.2.
- The OpenSpec CLI available globally. Run openspec --version before starting; this repository was verified with OpenSpec 1.6.0.

## Installation

~~~bash
pnpm install
pnpm dev
~~~

Open http://localhost:3000. For local HTTPS, run pnpm dev:https.

## Quality commands

~~~bash
pnpm validate:specs  # validate active changes and accepted specs
pnpm validate:harness # run Node negative tests and mechanical harness checks
pnpm test:unit:run   # deterministic Vitest unit/component tests
pnpm verify:fast     # cached implementation feedback
pnpm typecheck       # TypeScript without incremental cache
pnpm lint            # ESLint
pnpm build           # production Next.js build with TypeScript errors enabled
pnpm verify          # run specs, tests, typecheck, lint, and build in order
~~~

pnpm verify stops at the first failing gate and returns a non-zero exit code. `verify:fast` is provisional and never archive evidence. Browser exploration is optional human diagnosis outside PASS and archive readiness; generated TypeScript build state is ignored and must not be committed.

## SDD architecture

~~~text
docs/ -> OpenSpec -> .agent -> implementation -> verification -> archive
~~~

- docs/project-context.md is the canonical product context.
- docs/documentation-inventory.md bounds the documentation reviewed before a
  new product capability is proposed.
- docs/requirements/ contains curated, stable requirement briefs for broad product intent.
- openspec/changes/<change-id>/ contains an executable proposal, delta specs, design, tasks, implementation progress, and verification evidence.
- openspec/specs/ contains accepted behavior after a change is archived.
- .agent/skill-registry.md maps work to exact technical skills.
- .agent/agents/ defines narrow research, architecture, data, UI, and verification responsibilities.
- .agent/runtime-adapters/ defines portable execution modes, milestones,
  budgets, and runtime mappings.
- .codex/agents/ registers the portable roles as project-scoped native Codex
  custom agents.
- .agent/reference/ contains examples only; it is not a second executable spec layer.

OpenSpec owns change state and executable behavior. .agent supplies project-specific technical judgment. The harness does not duplicate OpenSpec's state machine.

## Operating the harness

1. Classify the request. Broad or ambiguous product intent starts with requirement curation; when a new capability is absent from project context and requirements, first delegate documentation synchronization to the curator. Behavior ready to implement starts or resumes an OpenSpec change. Internal refactors or documentation can use .agent directly when no contract changes.
2. Before apply, run openspec status --change <change-id> --json and openspec instructions apply --change <change-id> --json. Before verify/archive, use status only; OpenSpec 1.6.0 has no instructions for those phases.
3. Implement only the unchecked tasks in tasks.md, using the smallest applicable set of skills from .agent/skill-registry.md.
4. Keep apply-progress.md aligned with tasks.md while work is active. Delegation
   schema v2 separates role ownership, skill resolution, and proportional
   execution (`inline`, `subagent`, or evidenced `runtime-fallback`) with
   10/20/15-minute default observation budgets and one-writer artifacts.
5. For a linked product brief, complete the curator's documentation-reconciliation task before verification. Then finalize tasks/progress, run pnpm verify, persist a PASS verify-report.md with `node scripts/validate-harness.mjs --snapshot <change-id>`, and require `--archive-ready` before native `openspec archive <change-id> --yes --json`.

For an internal task classified `no-change`, run applicable checks and report them directly; do not invent change status, progress, or report artifacts.

Start with [the developer harness guide](harness-docs/developer-harness-guide.md), [the human operator guide](harness-docs/human-operator-guide.md), [the documentation index](docs/README.md), and [the agent harness guide](.agent/README.md).

## Project structure

~~~text
app/          Next.js routes and layouts
components/   shared UI and form primitives
modules/      domain modules and landing experience
messages/     English and Spanish next-intl messages
routes/       typed navigation configuration
docs/         product context and curated requirements
harness-docs/ harness usability guides (developer, operator, audit)
openspec/     active changes and accepted executable specs
.agent/       technical skills, roles, contracts, and references
.codex/       project-scoped native Codex settings and agent adapters
~~~

## Extending the template

Use existing shared components and module patterns before creating new abstractions. Keep visible text in both locale files, use discriminated ServiceResponse<T> results for fallible service calls, and add only dependencies approved by the change design.
