## Why

REQ-003 records a post-pilot audit showing that the hybrid SDD harness is useful but can still be bypassed by its generated OpenSpec skills, can archive semantically inconsistent evidence, and excludes its primary code reference from the quality gates. The harness must make its enforceable guarantees mechanical before it is trusted to validate a new product module.

## Intent

Make `docs -> OpenSpec -> .agent -> implementation -> verification -> archive` internally coherent, reproducible, and fail-closed where repository tooling can enforce it, while documenting the controls that necessarily remain human or agent conventions.

## What Changes

- Align the local propose, apply, sync, and archive skills with requirement curation, readiness, bounded handoffs, progress evidence, and the native OpenSpec archive command.
- Add a dependency-free harness validator with negative tests for unsafe skills, incomplete tasks, missing or divergent progress, non-PASS reports, and stale SHA-256 evidence.
- Define one terminal sequence for tasks, progress, verification, report creation, native archive, requirement reconciliation, and post-archive validation.
- Define a complete `no-change` verification route that does not invent OpenSpec state or artifacts.
- Include the widget reference in explicit TypeScript and ESLint checks, repair its responsive views and service semantics, and demonstrate shared client/server Zod validation with localized client messages.
- Version the pnpm lockfile and remove build-time Google Fonts downloads while retaining the four top-level verification gates.
- Correct the live workflow and template-quality specs, operator/developer documentation, registry, roles, and evidence guidance without rewriting historical archives.
- Add an audit report that distinguishes mechanically enforced safeguards from residual conventions.

## Scope

Root/package verification configuration, local OpenSpec skills, `.agent` governance and reference material, workflow documentation, active-change validation tooling, font loading, accepted workflow/template-quality contracts, and REQ-003 lifecycle evidence.

## Non-goals

- Rewriting historical archived changes or retroactively making their reports valid.
- Adding dependencies, an automated browser framework, a database, a second OpenSpec state engine, or suppliers functionality.
- Mechanically proving semantic quality, honest agent reporting, human approval, or runtime enforcement of editable-root boundaries.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow`: Makes local propose/apply/archive behavior fail-closed, defines mechanical validation and evidence freshness, clarifies `no-change`, and establishes an unambiguous close sequence.
- `template-quality-baseline`: Extends the deterministic quality baseline to the maintained reference module, lockfile, and offline-safe font configuration.

## Dependencies

- `docs/requirements/harden-sdd-harness-after-audit/brief.md` (REQ-003).
- REQ-001 and REQ-002 archived workflow baselines.
- Global OpenSpec CLI 1.6.0, Node.js 20.19.0 or newer, and pnpm 10.30.2.

## Success Criteria

- Native OpenSpec status and the repository validator reject unsafe archive integration and invalid active-change evidence with actionable errors.
- Negative tests cover pending tasks, absent progress, FAIL evidence, stale evidence, and unsafe archive instructions.
- The widget reference passes its explicit non-incremental typecheck and lint checks with complete desktop/mobile list examples.
- `pnpm-lock.yaml` is versioned and `pnpm build` does not fetch Google Fonts.
- The live specs and all current guides agree that archive requires fresh PASS evidence and uses `openspec archive`.
- `pnpm verify` exits 0 with the same four top-level gates after all changes.

## Rollback

Revert this change as a unit. Restore the previous package scripts, font configuration, local skills, governance documents, validator files, reference files, and accepted specs; no runtime data or dependency migration is involved.

## Open Questions

None. Scope, enforcement boundaries, supported versions, and residual limitations were approved in REQ-003.

## Impact

Affected areas include `.codex/skills/`, `.agent/`, `docs/`, `openspec/`, package and TypeScript/ESLint configuration, the locale layout/font tokens, and dependency-lock metadata. No public application route, persisted data, or package dependency is added.
