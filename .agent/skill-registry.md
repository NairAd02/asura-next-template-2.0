# Skill Registry

Índice central del ecosistema de skills. El orquestador lee esta tabla al inicio de cada tarea para decidir qué skills cargar en cada subagente.

> **Formato:** `Skill | Trigger (cuándo aplica) | Path | Owner`

## Registro de Skills

| Skill | Trigger | Path | Owner |
|---|---|---|---|
| `spec-driven-development` | **Siempre** — define el protocolo de fases del orquestador | `.agent/skills/spec-driven-development/SKILL.md` | `orchestrator` |
| `spec-authoring` | Cuando hay que **crear o actualizar el spec formal** de una feature (`docs/specs/features/*/spec.md`) | `.agent/skills/spec-authoring/SKILL.md` | `agent-spec-writer` |
| `module-architecture` | Cuando la tarea involucra **crear o planificar un módulo** nuevo | `.agent/skills/module-architecture/SKILL.md` | `agent-architect` |
| `data-layer` | Cuando hay que implementar `services`, `actions`, `types`, `hooks` o `mock` de un módulo | `.agent/skills/data-layer/SKILL.md` | `agent-data` |
| `ssr-data-fetching` | Cuando hay que crear el entry point SSR (`*-content.tsx`), `Suspense`, skeletons o containers de servidor | `.agent/skills/ssr-data-fetching/SKILL.md` | `agent-ui` |
| `client-views-modals` | Cuando hay que crear vistas de lista (table/cards), modales o hooks de acción de lista | `.agent/skills/client-views-modals/SKILL.md` | `agent-ui` |
| `forms-rhf-zod` | Cuando hay que crear formularios de creación o edición, triggers, schemas Zod o form containers | `.agent/skills/forms-rhf-zod/SKILL.md` | `agent-ui` |
| `filters-url-state` | Cuando hay que crear filtros sincronizados a URL, active-filters o el hook de filtros | `.agent/skills/filters-url-state/SKILL.md` | `agent-ui` |
| `i18n-conventions` | Cuando la tarea toca **cualquier texto visible** (labels, títulos, errores) o los archivos `messages/` | `.agent/skills/i18n-conventions/SKILL.md` | `agent-data`, `agent-ui` |
| `verification-harness` | Siempre al **final de cualquier implementación** para validar que no se rompió el proyecto | `.agent/skills/verification-harness/SKILL.md` | `agent-verifier` |

## Módulos de referencia

- `.agent/reference/widget/` — implementación de código completa del patrón con entidad genérica `Widget`.
- `.agent/reference/spec-example/` — spec formal resuelto para la misma entidad `Widget`, espejo 1:1 del anterior. Úsalo como referencia al escribir un spec nuevo.

Los agentes pueden leer cualquier archivo de ambas carpetas para ver ejemplos reales que ilustran las skills.

## Mapeo Fase → Agente → Skills

| Fase | Agente | Skills cargadas |
|---|---|---|
| Research + Design: spec | `agent-spec-writer` | `spec-authoring` |
| Research + Design: plan técnico | `agent-architect` | `module-architecture`, `i18n-conventions` |
| Implementation: Data | `agent-data` | `data-layer`, `i18n-conventions` |
| Implementation: UI | `agent-ui` | `ssr-data-fetching`, `client-views-modals`, `forms-rhf-zod`, `filters-url-state`, `i18n-conventions` |
| Verification | `agent-verifier` | `verification-harness` |
