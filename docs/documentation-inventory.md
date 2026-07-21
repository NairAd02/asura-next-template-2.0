# Inventario de documentación autoritativa

Este inventario delimita la documentación de proyecto que el
`agent-requirements-curator` debe evaluar cuando se introduce una capacidad de
producto nueva o cuando el alcance de una capacidad cambia. La revisión del
inventario es obligatoria; actualizar un archivo solo procede cuando el
impacto documentado lo afecta. Evita tratar cada archivo Markdown del
repositorio como documentación afectada.

## Revisión obligatoria; actualización condicionada por impacto

| Material | Propósito | Acción del curador |
|---|---|---|
| `docs/project-context.md` | Contexto durable de producto y del flujo del proyecto. | Revisar antes de crear o actualizar un brief; actualizar solo si la capacidad o el cambio de alcance modifica ese contexto durable. |
| `docs/requirements/<requirement-kebab>/brief.md` | Intención y alcance curados de la capacidad. | Crear o actualizar cuando el requisito sea nuevo o cambie; registrar siempre el ledger de sincronización documental. |
| `docs/requirements/index.md` | Índice de requisitos y estado de su cambio OpenSpec. | Actualizar solo si cambian la fila, el estado, el alcance o la referencia del brief. |

## Materiales condicionales por impacto

| Material | Cuándo se revisa |
|---|---|
| `README.md` | Cuando la capacidad cambia el uso, la instalación, los comandos públicos o la orientación de entrada del repositorio. |
| `docs/README.md` y `docs/requirements/README.md` | Cuando cambian la navegación documental, el ciclo de requisitos o los materiales que estos índices describen. |
| `docs/guides/**/*.md` y `docs/operations/**/*.md` | Cuando existan y la capacidad cambie instrucciones operativas, de soporte o de mantenimiento que documenten. |
| `harness-docs/*.md` | Cuando la capacidad cambia el flujo que siguen desarrolladores u operadores del Harness. |

Estos materiales se evalúan cuando su condición de impacto se cumple. Si un
material evaluado no existe o no aplica al alcance, el curador lo registra
como `not-applicable` con una justificación en el brief, sin crearlo solo para
completar la revisión.

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
`not-applicable`) y justificación. `no-change` acredita que el material fue
revisado y sigue siendo correcto; no equivale a omitir la revisión. Para un
cambio OpenSpec de producto, el curador repite la evaluación antes de
`pnpm verify` si el alcance implementado cambió; su handoff se conserva en
`apply-progress.md` por el orquestador.
