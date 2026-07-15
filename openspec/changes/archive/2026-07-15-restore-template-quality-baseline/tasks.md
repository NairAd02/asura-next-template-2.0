## 1. Remove Orphaned Product Surface

- [x] 1.1 Delete the orphaned campaigns route and CameraScanner component and confirm no production imports remain.
- [x] 1.2 Replace campaign-specific landing examples with items, categories, users, and dashboard copy and icons.
- [x] 1.3 Remove stale campaign-related imports and verify the production tree contains no Campaigns, CameraScanner, MRZ, or Tesseract references.

## 2. Restore Type-Safe Framework Behavior

- [x] 2.1 Change `getItemById` to return a failed `ServiceResponse<ItemDetails>` with `NOT_FOUND` for missing IDs.
- [x] 2.2 Rename `middleware.ts` to `proxy.ts` while preserving the next-intl export and matcher.
- [x] 2.3 Remove `typescript.ignoreBuildErrors`, delete tracked `tsconfig.tsbuildinfo`, and preserve its ignore rule.

## 3. Make Verification Reproducible

- [x] 3.1 Add `validate:specs`, non-incremental `typecheck`, and ordered `verify` package scripts.
- [x] 3.2 Declare pnpm 10.30.2 and Node.js 20.19.0 or newer in package metadata.
- [x] 3.3 Replace the inherited README with template setup, architecture, SDD operation, and verification documentation.

## 4. Verify and Close

- [x] 4.1 Run `openspec doctor --json` and record the result.
- [x] 4.2 Run OpenSpec validation and record the command, exit code, and summary.
- [x] 4.3 Run non-incremental TypeScript checking and record the command, exit code, and summary.
- [x] 4.4 Run ESLint and record the command, exit code, warnings, and summary.
- [x] 4.5 Run the Next.js production build and record the command, exit code, warnings, and summary.
- [x] 4.6 Reconcile `tasks.md`, create a PASS `verify-report.md`, and archive the accepted change.

