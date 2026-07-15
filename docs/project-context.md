# Project Context

> Canonical source document for project knowledge.
>
> Fill this file with the product context before requirement curation starts. The
> `agent-requirements-curator` reads this file first and extracts candidate
> requirement briefs into `docs/requirements/`.

## Product Summary

This repository is a Next.js application template with a portable `.agent`
development harness. The harness defines project-specific rules for research,
requirements, OpenSpec planning, implementation, and verification.

The project uses OpenSpec as the executable change/spec layer while keeping
`.agent` as the technical governance layer and `docs/` as the source-material
layer.

## Actors and Roles

List user types, permissions, ownership boundaries, and authorization rules.

## Business Rules

Document durable rules that affect more than one feature.

## Functional Areas

- Documentation and source material live in `docs/`.
- Candidate requirements live in `docs/requirements/`.
- Executable changes live in `openspec/changes/`.
- Accepted executable specs live in `openspec/specs/`.
- Agent skills and implementation conventions live in `.agent/`.

## Functional Requirements

- The development workflow must extract candidate requirements from
  `docs/project-context.md` into `docs/requirements/`.
- OpenSpec must create proposal, delta specs, design, and tasks for selected
  requirements.
- `.agent` must remain the source of technical conventions for implementation
  and verification.

## Non-Functional Requirements

Capture performance, security, accessibility, i18n, auditability, reliability, and compliance expectations.

## Proposed Architecture

Hybrid flow:

```text
docs/project-context.md
  -> docs/requirements/
  -> openspec/changes/<change-id>/
  -> implementation guided by .agent
  -> openspec/specs/ after sync/archive
```

OpenSpec is initialized for Codex and configured through
`openspec/config.yaml`.

## Data Model Notes

Describe entities, relationships, lifecycle rules, and invariants.

## Open Questions

- None for the initial OpenSpec + `.agent` workflow integration.
