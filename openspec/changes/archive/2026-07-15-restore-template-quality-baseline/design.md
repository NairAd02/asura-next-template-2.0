## Context

The template mixes a reusable items/categories/users example with unimplemented campaign and document-scanning remnants. TypeScript errors are hidden from `next build`, incremental compiler state is tracked, and the repository lacks one command that proves the complete baseline. The change crosses application code, service contracts, framework configuration, package metadata, and documentation, so the decisions need to be explicit before implementation.

## Goals / Non-Goals

**Goals:**

- Restore a generic production surface that uses only implemented template domains.
- Make missing item lookup results type-safe and unambiguous.
- Make OpenSpec, typecheck, lint, and build reproducible through package scripts.
- Use the supported Next.js Proxy convention without changing locale routing.
- Document the actual template and harness operating model.

**Non-Goals:**

- Introduce automated unit, integration, E2E, or coverage tooling.
- Rebuild campaign or scanning functionality.
- Redesign the landing page, module architecture, or SDD orchestration.

## Decisions

### Remove orphaned vertical code instead of stubbing it

Campaign routes and scanner code will be deleted. Landing examples will reuse the template's implemented items, categories, users, and dashboard vocabulary.

- **Rationale:** A reusable baseline should demonstrate supported capabilities and must not carry unresolved imports or implied dependencies.
- **Alternative considered:** Add empty campaign and MRZ modules or install Tesseract. Rejected because it would preserve project-specific scope and add maintenance without a requirement.

### Preserve the discriminated service response contract

`getItemById` will return `ServiceResponse<ItemDetails>`. A missing record will use the existing failed response branch with `code: "NOT_FOUND"`; successful responses always contain `ItemDetails`.

- **Interface:** `getItemById(id: string): Promise<ServiceResponse<ItemDetails>>`.
- **Rationale:** Callers can narrow on `success` without accepting `null` in the success branch.
- **Alternative considered:** Keep `success: true, data: null`. Rejected because it contradicts the existing service-response semantics and caused the action type error.

### Use package scripts as the reproducible gate interface

The repository will expose `validate:specs`, `typecheck`, and `verify`. `verify` runs OpenSpec validation, non-incremental TypeScript, ESLint, and Next.js build sequentially. Build-time TypeScript suppression will be removed.

- **Rationale:** A single local and CI-compatible interface produces deterministic evidence without adding dependencies.
- **Alternative considered:** Add a custom verification runner. Rejected because package scripts already provide ordering, exit propagation, and portability.

### Adopt the framework-native Proxy filename

`middleware.ts` will become `proxy.ts`, retaining the default next-intl middleware export and matcher configuration.

- **Rationale:** This removes the framework deprecation warning while preserving request behavior.
- **Alternative considered:** Keep the deprecated filename until a future upgrade. Rejected because the migration is mechanical and directly improves the quality baseline.

### Treat compiler build info as generated state

The tracked `tsconfig.tsbuildinfo` file will be removed while the existing ignore rule remains.

- **Rationale:** Verification must not depend on machine-specific incremental state.

## Skills and Responsibility Boundaries

- `.agent/skills/spec-driven-development/SKILL.md` governs the OpenSpec lifecycle.
- `.agent/skills/data-layer/SKILL.md` governs the item service contract.
- `.agent/skills/i18n-conventions/SKILL.md` governs visible landing copy.
- `.agent/skills/verification-harness/SKILL.md` governs the final gates.

No SSR, form, modal, or URL-filter behavior changes are required.

## Migration Plan

1. Remove orphaned routes/components and replace campaign-specific examples.
2. Tighten the item service contract.
3. migrate `middleware.ts` to `proxy.ts` and enable strict build-time type checking.
4. Add runtime metadata, verification scripts, and real documentation.
5. Run OpenSpec doctor plus all four verification gates and persist the results.

Rollback is a source revert; there is no data migration or dependency state to unwind.

## Verification Approach

- Search production sources for `campaign`, `CameraScanner`, `MRZ`, and `Tesseract` after cleanup.
- Run `openspec doctor --json`.
- Run `pnpm verify`, which must execute the four gates in the documented order.
- Confirm build output has no middleware deprecation warning and TypeScript runs with `--incremental false`.

## Risks / Trade-offs

- **Risk:** Landing copy loses a visually concrete vertical example. → **Mitigation:** Replace it with coherent examples from domains already implemented by the template.
- **Risk:** A hidden consumer expects nullable successful item data. → **Mitigation:** Typecheck and build the entire repository after tightening the interface.
- **Risk:** Global OpenSpec versions vary between machines. → **Mitigation:** Document a version preflight and the minimum Node.js runtime.

## Open Questions

None.
