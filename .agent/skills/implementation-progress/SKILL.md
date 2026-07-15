---
name: implementation-progress
description: Load for every implemented OpenSpec change to persist task progress, verification evidence, and archive readiness.
---

# Implementation Progress and Evidence

## When to Load

Load this skill for every OpenSpec change that writes implementation files or behavior artifacts. It is owned by the orchestrator, data/UI executors, and verifier according to their allowed roots.

## Source of Truth

- OpenSpec status is the only executable phase and change-state authority.
- tasks.md is the authority for task completion.
- apply-progress.md is cumulative context and evidence; it never replaces tasks.md.
- verify-report.md is the final verification evidence.

## apply-progress.md

Create openspec/changes/<change-id>/apply-progress.md before or with the first implementation edit. Keep prior entries and append meaningful updates.

Required information:

- status: in-progress, blocked, ready-for-verification, or ready-for-archive
- completed tasks
- files changed
- decisions and deviations
- problems
- remaining tasks
- skills loaded

When progress and tasks.md disagree, stop and reconcile the discrepancy before continuing.

## verify-report.md

Create or replace openspec/changes/<change-id>/verify-report.md after final verification. It SHALL include:

- conformance against proposal, specs, design, and tasks
- exact command, exit code, and concise summary for OpenSpec validation, typecheck, lint, and build
- relevant warnings
- PASS or FAIL verdict
- invalidation rule: any subsequent implementation or change-artifact modification requires all four gates again

## Archive Readiness

Before archive, verify all of the following:

- No unchecked tasks remain in tasks.md.
- apply-progress.md exists and is reconciled with tasks.md.
- verify-report.md exists with PASS.
- Linked requirement brief and requirements index can be updated coherently, or the change explicitly records that no requirement applies.
- Native OpenSpec status has been checked.

Do not create a custom phase tracker. In current OpenSpec versions, use instructions apply only for apply; use status as the native preflight for verify and archive.

## Handoff

Use .agent/contracts/phase-handoff.md. Report the skill-resolution method and the exact paths modified.
