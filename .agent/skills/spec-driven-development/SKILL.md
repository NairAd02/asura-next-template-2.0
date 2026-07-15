---
name: spec-driven-development
description: Load first for every task. Defines the hybrid docs, OpenSpec, and .agent protocol.
---

# Hybrid Spec-Driven Development

## Principle

- docs/ is project knowledge and curated requirement intent.
- OpenSpec is the only executable change and accepted-behavior layer.
- .agent is technical governance: skills, roles, contracts, and reference patterns.

The durable path is:

docs -> OpenSpec -> .agent -> implementation -> verification -> archive

## Entry Classification

Read .agent/skill-registry.md after loading this skill.

| Incoming task | Required path |
|---|---|
| Broad, ambiguous, or product intent | Read project context and use requirements-curation before executable work. |
| Clear behavior change | Create or update an OpenSpec change. Use the linked brief when it exists. |
| Active change | Recover with OpenSpec status, tasks.md, and apply-progress.md. Do not create a duplicate change. |
| Refactor, documentation, or internal work without accepted-contract change | Use .agent and verification. OpenSpec is optional; do not force a requirement brief. |
| Close request | Verify, reconcile evidence, update the requirement when applicable, then archive. |

## Native State Preflights

OpenSpec owns state. Never create a custom phase tracker.

- Before apply: run openspec status --change <id> --json and openspec instructions apply --change <id> --json.
- Before verification: run openspec status --change <id> --json.
- Before archive: run openspec status --change <id> --json.
- Current OpenSpec 1.6 exposes no instructions verify or archive artifact. Do not emulate those unsupported phases; status remains the native authority.

## Research and Readiness

Before approving implementation:

1. Read the linked requirement brief when one applies.
2. Read proposal, delta specs, design, and tasks.
3. Check that required artifacts exist.
4. Check scope coherence across artifacts.
5. Check referenced paths are valid or explicitly planned.
6. Resolve blocking questions before apply.
7. Select only exact skills from the registry.

A requirement brief is needed for broad product intent, business rules, permissions, flows, or behavior changes. It is not mandatory for an internal technical task with no contract change.

## Implementation

- Follow tasks.md; update its checkboxes as tasks complete.
- Load the implementation-progress skill for every implemented change.
- Create and update apply-progress.md cumulatively.
- Keep tasks.md as the completion authority.
- Update proposal, specs, design, or tasks before continuing when implementation discovers a scope or behavior change.
- Use shared components and existing dependencies before creating new abstractions.
- Preserve strict TypeScript and existing module conventions.

## Delegation and Inline Fallback

Use .agent/contracts/phase-handoff.md for every specialized role.

- Pass role, bounded task, change ID, native status, allowed roots, exact skill paths, and relevant requirement context.
- Executors cannot redelegate.
- In a runtime without subagents, execute the specialist role inline with the same responsibilities and allowed roots.
- A role reports status, summary, artifacts, files, completed tasks, risks, next phase, and skill-resolution method.

## Verification and Archive

- Use the verification-harness and implementation-progress skills at close.
- Run pnpm verify for OpenSpec validation, non-incremental typecheck, lint, and build.
- Persist verify-report.md with PASS or FAIL.
- Any later implementation or change-artifact modification invalidates the report and requires the four gates again.
- Archive only after tasks, progress, report, and linked requirement status are coherent.

## Reference Material

- .agent/reference/widget/ is a code-pattern reference only.
- .agent/reference/spec-example/ is a requirement-quality reference only.
- Executable specifications live only in openspec/specs and active changes.
