# template-quality-baseline Specification

## Purpose
TBD - created by archiving change restore-template-quality-baseline. Update Purpose after archive.
## Requirements
### Requirement: Generic Template Surface

The production template SHALL contain only generic example domains that are implemented and maintained in the repository.

#### Scenario: Production surface is built

- **GIVEN** the template contains implemented items, categories, users, and dashboard examples
- **WHEN** the production application is built
- **THEN** it SHALL NOT require campaign, CameraScanner, MRZ, or Tesseract code
- **AND** visible examples SHALL use supported generic domains.

### Requirement: Deterministic Quality Gates

The repository SHALL provide a single reproducible verification command that executes OpenSpec validation, non-incremental TypeScript checking, lint, and production build in order.

#### Scenario: Complete verification succeeds

- **GIVEN** a supported Node.js runtime, pnpm version, and OpenSpec CLI are available
- **WHEN** `pnpm verify` is executed
- **THEN** it SHALL run spec validation, typecheck, lint, and build sequentially
- **AND** it SHALL return exit code 0 only when every gate succeeds.

#### Scenario: TypeScript errors reach verification

- **WHEN** TypeScript checking or the Next.js build encounters a type error
- **THEN** verification SHALL fail
- **AND** build configuration SHALL NOT suppress the error
- **AND** typecheck SHALL NOT depend on incremental compiler state.

### Requirement: Missing Item Lookup Semantics

The item service SHALL represent a missing item as a failed service response rather than successful nullable data.

#### Scenario: Item ID does not exist

- **GIVEN** no item matches the requested ID
- **WHEN** `getItemById` is called
- **THEN** it SHALL return `success: false`
- **AND** the response code SHALL be `NOT_FOUND`
- **AND** the success branch SHALL remain typed as `ItemDetails`.

### Requirement: Supported Locale Request Entry Point

The template SHALL use the supported Next.js Proxy file convention for locale request handling while preserving the configured next-intl matcher.

#### Scenario: Locale proxy is discovered

- **WHEN** Next.js builds or runs the application
- **THEN** it SHALL discover the locale handler from `proxy.ts`
- **AND** the existing next-intl routing behavior and exclusions SHALL remain active
- **AND** no deprecated middleware convention warning SHALL be emitted.

