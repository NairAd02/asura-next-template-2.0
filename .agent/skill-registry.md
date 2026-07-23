# Skill Registry

The root resolves only exact applicable paths and injects them into a
`HARNESS_EXECUTOR_V1` handoff. Executors never reread this registry.

| Trigger | Skill path | Owner |
|---|---|---|
| Root lifecycle | `.agent/skills/spec-driven-development/SKILL.md` | orchestrator |
| Requirements/docs synchronization | `.agent/skills/requirements-curation/SKILL.md` | agent-requirements-curator |
| Module/OpenSpec architecture | `.agent/skills/module-architecture/SKILL.md` | agent-architect |
| Services/actions/types/hooks/mocks | `.agent/skills/data-layer/SKILL.md` | agent-data |
| SSR/container/Suspense | `.agent/skills/ssr-data-fetching/SKILL.md` | agent-ui |
| Lists/modals/actions | `.agent/skills/client-views-modals/SKILL.md` | agent-ui |
| RHF/Zod forms | `.agent/skills/forms-rhf-zod/SKILL.md` | agent-ui |
| URL filters | `.agent/skills/filters-url-state/SKILL.md` | agent-ui |
| Visible text/messages | `.agent/skills/i18n-conventions/SKILL.md` | data/UI/architect |
| Deterministic behavior | `.agent/skills/behavior-testing/SKILL.md` | data/UI/verifier |
| Any implemented change | `.agent/skills/implementation-progress/SKILL.md` | orchestrator/data/UI/verifier |
| Final gates/readiness or scoped no-change checks | `.agent/skills/verification-harness/SKILL.md` | verifier |

Owner tags record responsibility; `plannedMode` independently chooses `inline`
or `subagent`. `skillResolution` is `paths-injected` or `none`.

Typical minimal bundles:

- data: data-layer + progress; add behavior/i18n only when triggered.
- UI: only affected UI skills + progress; add behavior/i18n when triggered.
- verifier: verification + progress; add behavior when relevant.
- curator/architect: their single domain skill unless visible text applies.

Lazy code examples live under `.agent/reference/widget/`. Spec examples live
under `.agent/reference/spec-example/`; neither is executable specification.
