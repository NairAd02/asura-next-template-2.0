# Skill Registry

Central index for project skills. The orchestrator reads this table at the start of every task, then passes only exact paths that apply.

| Skill | Trigger | Path | Owner |
|---|---|---|---|
| spec-driven-development | Always. Hybrid lifecycle and native OpenSpec state. | .agent/skills/spec-driven-development/SKILL.md | orchestrator |
| requirements-curation | Broad product intent or requirement briefs. | .agent/skills/requirements-curation/SKILL.md | agent-requirements-curator |
| module-architecture | OpenSpec design or module structure. | .agent/skills/module-architecture/SKILL.md | agent-architect |
| data-layer | Module services, actions, types, hooks, or mocks. | .agent/skills/data-layer/SKILL.md | agent-data |
| ssr-data-fetching | SSR entry points, containers, Suspense, or skeletons. | .agent/skills/ssr-data-fetching/SKILL.md | agent-ui |
| client-views-modals | List views, modals, and list actions. | .agent/skills/client-views-modals/SKILL.md | agent-ui |
| forms-rhf-zod | Create or edit forms, Zod schemas, and form containers. | .agent/skills/forms-rhf-zod/SKILL.md | agent-ui |
| filters-url-state | URL-synchronized filters. | .agent/skills/filters-url-state/SKILL.md | agent-ui |
| i18n-conventions | Visible text or messages. | .agent/skills/i18n-conventions/SKILL.md | agent-data, agent-ui, agent-architect |
| behavior-testing | Changed data, schemas, URL state, client state, localization, responsive composition, or final risk-based smoke. | .agent/skills/behavior-testing/SKILL.md | agent-data, agent-ui, agent-verifier |
| implementation-progress | Every implemented OpenSpec change; machine-readable current snapshot, cumulative handoffs, evidence, and archive readiness. | .agent/skills/implementation-progress/SKILL.md | orchestrator, agent-data, agent-ui, agent-verifier |
| verification-harness | Final specs, unit/component, typecheck, lint, build, SHA-256 evidence, strict archive readiness, or applicable `no-change` checks. | .agent/skills/verification-harness/SKILL.md | agent-verifier |

## Reference Modules

- .agent/reference/widget/ is a generic implementation reference.
- .agent/reference/spec-example/ is a requirement-quality reference.
- Neither reference folder is an executable-spec destination.

## Phase Mapping

| Phase | Owner | Exact skills normally loaded |
|---|---|---|
| Requirement curation | agent-requirements-curator | requirements-curation |
| OpenSpec design | orchestrator and agent-architect | spec-driven-development, module-architecture, i18n-conventions when visible text applies |
| Data implementation | agent-data | data-layer, behavior-testing when behavior changes, i18n-conventions when messages change, implementation-progress |
| UI implementation | agent-ui | only applicable UI skills, behavior-testing when behavior changes, i18n-conventions, implementation-progress |
| Verification | agent-verifier | verification-harness, behavior-testing when behavior or browser smoke applies, implementation-progress |
| Archive | orchestrator | spec-driven-development, implementation-progress |

The task and handoff determine the final minimal skill set; the table is not permission to load every skill.
