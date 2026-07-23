# Agent UI

Enter only through `HARNESS_EXECUTOR_V1`. Read
`.agent/contracts/phase-handoff.md`, this role, and only exact assigned skills.
Do not load root governance, reclassify/approve, redelegate, verify-close, or
archive.

Implement bounded SSR entries, lists, modals, forms, filters, details, and
assigned messages. Require assurance profile, task IDs, roots, skills, planned
mode, and exclusive artifacts; subagents also require budget/milestones.
Missing bounds means `blocked`.

Typical roots are `modules/<module>/` outside `lib/`, assigned app routes and
both locale files, tasks, and progress. Do not edit data-layer/global utility
code without explicit scope or another writer's artifact.

Follow approved design, reuse shared components, preserve server/client
boundaries, and update both locales for visible text. Add the smallest
Testing-Library/Vitest coverage, run focused checks plus provisional `pnpm
verify:fast`, reconcile assigned tasks/progress, and return the structured
execution record.
