# Skill Registry

Índice central del ecosistema de skills. El orquestador lee esta tabla al inicio
de cada tarea para decidir qué skills cargar en cada subagente.

> **Formato:** `Skill | Trigger (cuándo aplica) | Path | Owner`

## Registro de Skills

| Skill | Trigger | Path | Owner |
|---|---|---|---|
| `spec-driven-development` | **Siempre** — define el protocolo híbrido OpenSpec + `.agent` | `.agent/skills/spec-driven-development/SKILL.md` | `orchestrator` |
| `requirements-curation` | Cuando hay que extraer o mantener requerimientos candidatos desde `docs/project-context.md` hacia `docs/requirements/` | `.agent/skills/requirements-curation/SKILL.md` | `agent-requirements-curator` |
| `module-architecture` | Cuando hay que revisar o enriquecer el `design.md` de un cambio OpenSpec o planificar un módulo | `.agent/skills/module-architecture/SKILL.md` | `agent-architect` |
| `data-layer` | Cuando hay que implementar `services`, `actions`, `types`, `hooks` o `mock` de un módulo | `.agent/skills/data-layer/SKILL.md` | `agent-data` |
| `ssr-data-fetching` | Cuando hay que crear el entry point SSR (`*-content.tsx`), `Suspense`, skeletons o containers de servidor | `.agent/skills/ssr-data-fetching/SKILL.md` | `agent-ui` |
| `client-views-modals` | Cuando hay que crear vistas de lista (table/cards), modales o hooks de acción de lista | `.agent/skills/client-views-modals/SKILL.md` | `agent-ui` |
| `forms-rhf-zod` | Cuando hay que crear formularios de creación o edición, triggers, schemas Zod o form containers | `.agent/skills/forms-rhf-zod/SKILL.md` | `agent-ui` |
| `filters-url-state` | Cuando hay que crear filtros sincronizados a URL, active-filters o el hook de filtros | `.agent/skills/filters-url-state/SKILL.md` | `agent-ui` |
| `i18n-conventions` | Cuando la tarea toca **cualquier texto visible** (labels, títulos, errores) o los archivos `messages/` | `.agent/skills/i18n-conventions/SKILL.md` | `agent-data`, `agent-ui`, `agent-architect` |
| `verification-harness` | Siempre al **final de cualquier implementación** para validar OpenSpec + proyecto | `.agent/skills/verification-harness/SKILL.md` | `agent-verifier` |

## Módulos de referencia

- `.agent/reference/widget/` — implementación de código completa del patrón con entidad genérica `Widget`.
- `.agent/reference/spec-example/` — ejemplo de calidad de requisitos y trazabilidad; úsalo solo como referencia, no como destino de nuevas specs ejecutables.

Los agentes pueden leer cualquier archivo de ambas carpetas para ver ejemplos reales que ilustran las skills.

## Mapeo Fase → Agente → Skills

| Fase | Agente | Skills cargadas |
|---|---|---|
| Research: requirements | `agent-requirements-curator` | `requirements-curation` |
| Design: OpenSpec proposal/specs/design/tasks | OpenSpec OPSX + `agent-architect` | `module-architecture`, `i18n-conventions` |
| Implementation: Data | `agent-data` | `data-layer`, `i18n-conventions` |
| Implementation: UI | `agent-ui` | `ssr-data-fetching`, `client-views-modals`, `forms-rhf-zod`, `filters-url-state`, `i18n-conventions` |
| Verification | `agent-verifier` | `verification-harness` |
