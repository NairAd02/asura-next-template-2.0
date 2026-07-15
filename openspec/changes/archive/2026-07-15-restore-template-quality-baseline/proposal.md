## Why

The reusable template cannot currently pass typecheck or build because it contains orphaned, project-specific campaign and scanner code, and its build configuration suppresses TypeScript failures. Restoring a deterministic green baseline is required before the SDD harness can treat verification evidence as trustworthy.

## Intent

Provide a generic, reproducible quality baseline for the template without adding new product features or dependencies.

## What Changes

- Remove orphaned campaign, CameraScanner, MRZ, and Tesseract production code and replace campaign-specific landing examples with generic items, categories, users, and dashboard examples.
- Make `getItemById` return a failed `ServiceResponse<ItemDetails>` with `NOT_FOUND` when an item does not exist.
- Migrate the deprecated Next.js `middleware.ts` convention to `proxy.ts` while preserving the next-intl matcher behavior.
- Stop ignoring TypeScript build errors and keep incremental compiler state out of version control.
- Add reproducible OpenSpec, typecheck, lint, build, and aggregate verification scripts with explicit Node.js and pnpm runtime requirements.
- Replace the inherited v0 README with documentation for this template and its hybrid SDD workflow.

## Scope

The change covers the current production source tree, package scripts and metadata, Next.js configuration, compiler artifacts, and repository README.

## Non-goals

- Adding Vitest, E2E tests, or coverage enforcement.
- Adding replacements for the removed campaign or scanner features.
- Changing the SDD orchestration protocol; that is handled by `strengthen-sdd-harness`.

## Capabilities

### New Capabilities

- `template-quality-baseline`: Defines the generic template surface, service not-found semantics, and reproducible quality gates required for a trustworthy baseline.

### Modified Capabilities

None.

## Dependencies

- Node.js 20.19.0 or newer.
- pnpm 10.30.2.
- A globally available OpenSpec CLI compatible with the repository schema.

## Success Criteria

- `openspec doctor --json` and `pnpm verify` exit with code 0.
- Typecheck runs without incremental cache and Next.js build does not ignore TypeScript errors.
- Production sources contain no campaign, CameraScanner, MRZ, or Tesseract references.
- The Next.js middleware deprecation warning is absent.

## Rollback

Revert this change as a unit. No data migration or dependency rollback is required because the removed code is unreferenced and no new package is introduced.

## Open Questions

None.

## Impact

Affected areas are `app/`, `components/`, `modules/landing/`, item services/actions, Next.js and TypeScript configuration, package metadata, and repository documentation. The service contract becomes stricter for missing item IDs; existing action callers already consume the discriminated `ServiceResponse` shape.
