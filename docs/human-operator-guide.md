# Guia del Operador Humano

Esta guia opera el harness hibrido de Next Template.

## La ruta canonica

docs -> OpenSpec -> .agent -> implementacion -> verificacion -> archive

- docs conserva contexto e intencion.
- OpenSpec conserva cambios ejecutables y la spec viva.
- .agent conserva criterio tecnico, roles y contratos.
- AGENTS.md activa el flujo en Codex.

## Inicio de cualquier tarea

Codex lee primero:

1. .agent/skills/spec-driven-development/SKILL.md
2. .agent/skill-registry.md

Luego clasifica:

| Tipo de pedido | Camino |
|---|---|
| Idea amplia, regla, permiso o flujo de producto | Curar requirement brief, despues OpenSpec. |
| Cambio de comportamiento listo | Crear o actualizar OpenSpec. |
| Change activo | Recuperar status, tasks.md y apply-progress.md; continuar. |
| Refactor, documentacion o mantenimiento interno sin contrato | .agent con OpenSpec opcional; no se exige brief. |
| Cierre | Verificar, actualizar requirement si aplica y archivar. |

## Antes de implementar

Para un change activo, Codex debe:

1. Ejecutar openspec status --change <id> --json.
2. Ejecutar openspec instructions apply --change <id> --json.
3. Reread proposal, specs, design, tasks y el brief cuando existe.
4. Confirmar que los archivos existen, que el scope coincide, que las rutas son validas y que no hay preguntas bloqueantes.
5. Cargar solo las skills exactas necesarias.

Pide aprobacion ligera sobre estos artifacts antes de cambiar codigo si el trabajo modifica comportamiento o alcance.

## Durante implementacion

Cada change implementado debe tener apply-progress.md. Es acumulativo y registra estado, tareas completas, archivos, decisiones, problemas, tareas restantes y skills.

tasks.md sigue siendo la autoridad de completitud. Si ambos documentos difieren, Codex debe reconciliarlos antes de continuar.

Los roles reciben un handoff con tarea, change, estado OpenSpec, raices editables y skills exactas. Un ejecutor no redelega. Si el runtime no tiene subagentes, Codex ejecuta el rol en linea con los mismos limites.

## Verificacion

Ejecuta:

~~~bash
pnpm verify
~~~

Esto corre OpenSpec validation, typecheck sin cache incremental, lint y build. El verifier crea verify-report.md con comandos, exit codes, resumen, warnings, conformidad y veredicto PASS o FAIL.

Cualquier cambio posterior en implementacion o artifacts invalida el reporte y exige repetir los cuatro gates.

Nota de version: OpenSpec 1.6 tiene instructions apply, pero no instructions verify ni archive. Para verificar o archivar, Codex debe usar openspec status --change <id> --json como preflight nativo. No se crea una maquina de estados alternativa.

## Archive

No archives un change si:

- quedan tareas sin marcar;
- falta apply-progress.md o no coincide con tasks.md;
- falta verify-report.md PASS;
- el brief o indice de requirements vinculados no se puede actualizar coherentemente.

Para un change con brief, marca el brief y su fila de indice como implemented con la referencia archive. Para un change tecnico sin brief, registra no requirement as applicable.

## Ejemplo de tarea tecnica pequena

Pedido: Actualiza una guia interna para aclarar el nombre de un comando, sin cambiar comportamiento.

Clasificacion: .agent + verificacion. No hace falta requirement brief. OpenSpec es opcional si se quiere trazabilidad tecnica.

## Prompts utiles

Crear o continuar un change:

~~~text
Usa el harness SDD. Recupera el estado de <change-id> con OpenSpec, tasks.md y apply-progress.md. No implementes hasta comprobar readiness.
~~~

Trabajo interno:

~~~text
Clasifica este refactor/documentacion. Si no cambia el contrato aceptado, usa .agent y verifica sin forzar requirement brief.
~~~

Cerrar:

~~~text
Verifica <change-id>, crea el verify-report.md, reconcilia progreso y tasks, actualiza el requirement si aplica y archiva solo si todos los gates son PASS.
~~~
