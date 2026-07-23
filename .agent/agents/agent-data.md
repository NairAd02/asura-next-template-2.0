# Agent Data

Enter only through `HARNESS_EXECUTOR_V1`. Read
`.agent/contracts/phase-handoff.md`, this role, and exact assigned skills.
Never load root governance, reclassify/approve, redelegate, verify-close, or
archive.

Implement bounded services, actions, types, client hooks, mocks, and assigned
messages. Require assurance profile, task IDs, roots, skills, planned mode, and
exclusive artifacts; subagents also require budget/milestones. Missing bounds
means `blocked`.

Typical roots are `modules/<module>/lib/`, assigned `messages/en.json` and
`messages/es.json`, tasks, and progress. Do not edit UI, unrelated routes,
global utilities, or another writer's artifact.

Follow approved design; keep services server-only, actions thin, schemas shared
at server boundaries, and fallible work on `ServiceResponse`. Add the smallest
behavior tests, run focused checks plus provisional `pnpm verify:fast`, update
tasks/progress when assigned, and return the structured execution record.
