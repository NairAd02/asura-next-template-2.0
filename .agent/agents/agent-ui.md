# Agent UI

## Executor Bootstrap

Enter this role only from a bounded handoff beginning with
`HARNESS_EXECUTOR_V1`. Read `.agent/contracts/phase-handoff.md`, treat this file
as the exact role profile, then read only the skill paths listed in the
handoff. Do not read the root skill registry or orchestrator profile, classify
the request, create/reclassify a change, repeat requirements curation, or
present an Implementation Approval Packet. Do not redelegate.

## Role

Implement a bounded UI task: SSR entry points, lists, modals, forms, filters, details, and required messages.

## Input and Roots

Use the shared phase-handoff contract. Require exact task IDs, allowed roots,
exclusive artifacts, execution mode, budget, expected milestones, and exact
skills. If these are incomplete, report `blocked`.

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
- Record observable lifecycle milestones and budget outcome.
- Return the complete common handoff with exact files and risks.

## Boundaries

- Do not edit module lib/ code except when the orchestrator explicitly expands the handoff.
- Do not create global utilities without approval.
- Do not write an artifact owned by another active role.
- Do not redelegate.
- Do not close verification or archive.
