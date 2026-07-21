# Inventario de documentación autoritativa

Este inventario delimita la documentación de proyecto que el
`agent-requirements-curator` debe evaluar cuando se introduce una capacidad de
producto nueva o cuando el alcance de una capacidad cambia. Evita tratar cada
archivo Markdown del repositorio como documentación afectada.

## Revisión obligatoria

| Material | Propósito | Acción del curador |
|---|---|---|
| `docs/project-context.md` | Contexto durable de producto y del flujo del proyecto. | Revisar y actualizar antes de crear o actualizar un brief. |
| `docs/requirements/<requirement-kebab>/brief.md` | Intención y alcance curados de la capacidad. | Crear o actualizar; registrar el ledger de sincronización documental. |
| `docs/requirements/index.md` | Índice de requisitos y estado de su cambio OpenSpec. | Crear o actualizar la fila coherente con el brief. |

## Revisión condicionada por impacto

| Material | Cuándo se revisa |
|---|---|
| `README.md` | Cuando la capacidad cambia el uso, la instalación, los comandos públicos o la orientación de entrada del repositorio. |
| `docs/README.md` y `docs/requirements/README.md` | Cuando cambian la navegación documental, el ciclo de requisitos o los materiales que estos índices describen. |
| `docs/guides/**/*.md` y `docs/operations/**/*.md` | Cuando existan y la capacidad cambie instrucciones operativas, de soporte o de mantenimiento que documenten. |
| `harness-docs/*.md` | Cuando la capacidad cambia el flujo que siguen desarrolladores u operadores del Harness. |

Si un material condicionado no existe o no aplica al alcance, el curador lo
registra como `not-applicable` con una justificación en el brief, sin crearlo
solo para completar la revisión.

## Exclusiones

Los siguientes materiales no forman parte de esta sincronización. Conservan su
propio flujo de actualización:

- Archivos históricos y directorios `archive/`.
- Plantillas, incluidos `docs/requirements/_templates/`.
- Especificaciones ejecutables aceptadas en `openspec/specs/`; OpenSpec es su
  única autoridad de actualización.

## Evidencia de sincronización

Cada brief afectado incluye una sección **Sincronización documental** con una
fila por material evaluado: documento, resultado (`updated`, `no-change` o
`not-applicable`) y justificación. Para un cambio OpenSpec de producto, el
curador repite la evaluación antes de `pnpm verify` si el alcance implementado
cambió; su handoff se conserva en `apply-progress.md` por el orquestador.
