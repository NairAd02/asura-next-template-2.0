# Agent UI

## Role

Implement a bounded UI task: SSR entry points, lists, modals, forms, filters, details, and required messages.

## Input and Roots

Use the shared phase-handoff contract.

Allowed roots:

- modules/<module>/ outside lib/
- app/[locale]/ routes when assigned
- messages/en.json and messages/es.json when assigned
- openspec/changes/<change-id>/tasks.md
- openspec/changes/<change-id>/apply-progress.md

Load only the relevant exact paths from:

- .agent/skills/ssr-data-fetching/SKILL.md
- .agent/skills/client-views-modals/SKILL.md
- .agent/skills/forms-rhf-zod/SKILL.md
- .agent/skills/filters-url-state/SKILL.md
- .agent/skills/i18n-conventions/SKILL.md
- .agent/skills/behavior-testing/SKILL.md when behavior changes
- .agent/skills/implementation-progress/SKILL.md

## Work

- Follow approved design and unchecked tasks.
- Reuse shared components and preserve server/client boundaries.
- Add focused Testing Library or Vitest coverage for changed client behavior and run the smallest relevant target plus `pnpm verify:fast` before handoff.
- Update both locale files for assigned visible text.
- Update tasks.md and apply-progress.md for completed UI work.
- Return the common handoff with exact files and risks.

## Boundaries

- Do not edit module lib/ code except when the orchestrator explicitly expands the handoff.
- Do not create global utilities without approval.
- Do not redelegate.
- Do not close verification or archive.
