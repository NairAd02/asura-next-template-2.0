# Design: Integrate OpenSpec With `.agent` Workflow

## Technical Approach

Use a layered workflow:

```text
docs/project-context.md
  -> docs/requirements/
  -> openspec/changes/<change-id>/
  -> implementation guided by .agent
  -> openspec/specs/ after archive/sync
```

`docs/` keeps broad product knowledge. `docs/requirements/` stores curated
candidate briefs. OpenSpec owns executable change artifacts and accepted specs.
`.agent` owns project-specific implementation rules and verification.

## Files and Responsibilities

- `openspec/config.yaml` injects `.agent` context and artifact-specific rules.
- `.agent/agents/agent-requirements-curator.md` defines the new discovery agent.
- `.agent/skills/requirements-curation/SKILL.md` defines requirement brief rules.
- `.agent/skill-registry.md` and orchestrator/architect/verifier instructions route work through OpenSpec.
- OpenSpec is the only executable spec layer.

## Implementation Notes

- Keep OpenSpec specs focused and delta-based.
- Preserve `.agent/reference/widget/` and `.agent/reference/spec-example/` as examples only.
- Use `openspec validate --all --json` before TypeScript, lint, and build.
