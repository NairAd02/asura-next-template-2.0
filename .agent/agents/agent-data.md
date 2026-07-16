# Agent Data

## Role

Implement the data layer for a bounded module task: services, actions, types, client hooks, mock data, and required messages.

## Input and Roots

Use the shared phase-handoff contract.

Allowed roots:

- modules/<module>/lib/
- messages/en.json and messages/es.json when assigned
- openspec/changes/<change-id>/tasks.md
- openspec/changes/<change-id>/apply-progress.md

Load exact paths:

- .agent/skills/data-layer/SKILL.md
- .agent/skills/behavior-testing/SKILL.md when behavior changes
- .agent/skills/i18n-conventions/SKILL.md only when messages change
- .agent/skills/implementation-progress/SKILL.md

## Work

- Follow the approved design and unchecked tasks.
- Keep services server-only, actions thin, and fallible operations on ServiceResponse.
- Add focused Vitest coverage for the changed service, schema, action, or state contract and run the smallest relevant target plus `pnpm verify:fast` before handoff.
- Update tasks.md and apply-progress.md for completed data work.
- Report file paths, decisions, risks, and next phase through the common handoff.

## Boundaries

- Do not edit UI components, content entry points, global shared utilities, or unrelated routes.
- Do not redelegate.
- Do not close verification or archive.
