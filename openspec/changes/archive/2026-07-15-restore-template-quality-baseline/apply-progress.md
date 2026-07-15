# Apply Progress

## Status

`ready-for-archive`

## Completed Tasks

None.

## Files Changed

- `openspec/changes/restore-template-quality-baseline/proposal.md`
- `openspec/changes/restore-template-quality-baseline/design.md`
- `openspec/changes/restore-template-quality-baseline/specs/template-quality-baseline/spec.md`
- `openspec/changes/restore-template-quality-baseline/tasks.md`
- `openspec/changes/restore-template-quality-baseline/apply-progress.md`

## Decisions and Deviations

- This technical baseline has no driving product requirement brief.
- The change adopts the progress artifact planned for the strengthened harness so the mechanism is exercised before it becomes mandatory.
- No deviations from proposal or design.

## Problems

None.

## Remaining Tasks

- Tasks 1.1 through 4.6 in `tasks.md`.

## Skills Loaded

- `.agent/skills/spec-driven-development/SKILL.md`
- `.agent/skills/data-layer/SKILL.md`
- `.agent/skills/i18n-conventions/SKILL.md`
- `.agent/skills/verification-harness/SKILL.md`

## Update: Baseline Implementation

- Completed tasks: 1.1 through 3.3.
- Deleted the campaign route, CameraScanner, and tracked compiler build info.
- Replaced campaign landing copy with supported item, category, user, and dashboard examples.
- Changed getItemById to return NOT_FOUND through the failed ServiceResponse branch.
- Renamed middleware.ts to proxy.ts without changing the next-intl handler or matcher.
- Removed TypeScript build suppression, added reproducible scripts and runtime metadata, removed the scanner-only ZXing dependency, and replaced the README.
- Initial non-incremental typecheck: PASS after deleting stale .next route types for the removed campaign page.

### Files Changed in This Update

- app/[locale]/(protected)/campaigns/page.tsx (deleted)
- components/camera-scanner.tsx (deleted)
- modules/items/lib/services/item.services.ts
- modules/landing/landing-content.tsx and landing components
- routes/groups-routes/groups-routes.tsx
- middleware.ts renamed to proxy.ts
- next.config.mjs, package.json, .gitignore, README.md
- tsconfig.tsbuildinfo (deleted)

### Decision and Issue Log

- No product requirement brief applies to this technical baseline.
- A partial landing-wide i18n refactor is outside this focused baseline; no new i18n pattern was introduced.
- The stale .next validator was generated state inside this workspace. It was removed before the clean typecheck.

### Remaining Work

- Run and record the final doctor, OpenSpec validation, typecheck, lint, and build gates.
- Reconcile tasks.md and create verify-report.md before archive.

## Update: Verification Complete

- OpenSpec doctor: PASS.
- pnpm verify: PASS (OpenSpec validation, non-incremental TypeScript, ESLint, and Next.js build).
- Post-build pnpm typecheck: PASS.
- No production references to campaign, CameraScanner, MRZ, or Tesseract remain.
- verify-report.md is present with verdict PASS.
- tasks.md and apply-progress.md are reconciled; no implementation tasks remain.
