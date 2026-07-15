# Project Documentation

This folder is the source-material layer for product and project knowledge.

## Canonical Files

- `project-context.md` is the standard root document for product context, business rules, actors, flows, architecture notes, data model notes, functional requirements, and non-functional requirements.
- `requirements/` is the curated backlog of candidate requirements extracted from `project-context.md`.
- `human-operator-guide.md` explains how the human operator should pilot the OpenSpec + `.agent` workflow.
- Executable specs live in `openspec/specs/`.

## Workflow

1. Keep broad project knowledge in `project-context.md`.
2. Use `.agent/agents/agent-requirements-curator.md` to extract candidate briefs into `requirements/`.
3. Choose a requirement brief and create an OpenSpec change from it.
4. Archive the completed OpenSpec change so accepted behavior lands in `openspec/specs/`.
