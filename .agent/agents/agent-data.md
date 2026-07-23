# Agent Data

## Executor Bootstrap

Enter this role only from a bounded handoff beginning with
`HARNESS_EXECUTOR_V1`. Read `.agent/contracts/phase-handoff.md`, treat this file
as the exact role profile, then read only the skill paths listed in the
handoff. Do not read the root skill registry or orchestrator profile, classify
the request, create/reclassify a change, repeat requirements curation, or
present an Implementation Approval Packet. Do not redelegate.

## Role

Implement the data layer for a bounded module task: services, actions, types, client hooks, mock data, and required messages.

## Input and Roots

Use the shared phase-handoff contract. Require exact task IDs, allowed roots,
exclusive artifacts, execution mode, budget, expected milestones, and exact
skills. If these are incomplete, report `blocked`.

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
- Record observable lifecycle milestones and budget outcome.
- Report file paths, decisions, risks, and next phase through the complete
  common handoff.

## Boundaries

- Do not edit UI components, content entry points, global shared utilities, or unrelated routes.
- Do not write an artifact owned by another active role.
- Do not redelegate.
- Do not close verification or archive.
