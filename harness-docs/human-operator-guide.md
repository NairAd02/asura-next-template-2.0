# Guia del Operador Humano

Esta guia opera el harness hibrido de Next Template.

## La ruta canonica

docs -> OpenSpec -> .agent -> implementacion -> verificacion -> archive

- docs conserva contexto e intencion.
- OpenSpec conserva cambios ejecutables y la spec viva.
- .agent conserva criterio tecnico, roles y contratos.
- AGENTS.md separa la entrada raiz de la entrada del ejecutor.
- `.agent/runtime-adapters/` traduce el contrato portable a cada runtime.

## Politica de documentacion

Para una capacidad nueva o un cambio de alcance, revisar el inventario
documental es obligatorio. Actualizar cada archivo no lo es: solo se edita el
material afectado; si sigue correcto, se registra `no-change` con una
justificacion. Esto evita modificar README, contexto o diagramas sin necesidad.

## Inicio de cualquier tarea

El hilo raiz de Codex lee primero:

1. .agent/skills/spec-driven-development/SKILL.md
2. .agent/skill-registry.md
3. .agent/agents/orchestrator.md

Luego clasifica:

Un subagente recibe `HARNESS_EXECUTOR_V1` y no repite ese bootstrap. Lee el
contrato de handoff, su rol y solo las skills exactas de la asignacion. Tampoco
reclasifica, crea otro change, repite curacion ni solicita otro Approval Packet.

| Tipo de pedido | Camino |
|---|---|
| Idea amplia, regla, permiso o flujo de producto | Si la capacidad no existe en contexto ni requirements, delegar primero la revision documental al curator; actualizar solo el material afectado, curar el brief y usar OpenSpec. |
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
5. Crear un plan de delegacion cuando el change se va a implementar.
6. Cargar solo las skills exactas necesarias.

Despues debe mostrarte un Implementation Approval Packet y detenerse antes de cambiar codigo. El paquete debe incluir change ID, requirement vinculado, readiness, scope, resumen de diseno, plan de tareas, delegacion, raices editables, familias de archivos esperadas, riesgos, preguntas abiertas y verificacion. Puedes aprobar explicitamente o pedir ajustes; si pides ajustes, Codex actualiza los artifacts y vuelve a presentar el paquete.

## Durante implementacion

Cada change implementado debe tener apply-progress.md. Es acumulativo y registra estado, tareas completas, archivos, decisiones, problemas, tareas restantes, skills, `approvalCheckpoint` y, cuando hay owner tags, `delegationPlan`.

`approvalCheckpoint` deja evidencia de que el paquete fue aprobado antes o junto al primer edit de implementacion. El validador comprueba que esa evidencia exista y tenga forma valida; no pretende probar criptograficamente lo ocurrido en el chat.

Las tareas que pertenecen a roles especializados deben llevar exactamente un
owner tag, por ejemplo `[agent-data]`, `[agent-ui]`, `[agent-verifier]` u
`[orchestrator]`. El plan de delegacion schema v2 cubre esos roles con task IDs,
roots, skills, `skillResolution`, modo planeado/real, budget, milestones y
artifacts exclusivos.

tasks.md sigue siendo la autoridad de completitud. Si ambos documentos difieren, Codex debe reconciliarlos antes de continuar.

Los roles reciben un handoff con tarea, change, estado OpenSpec, raices,
artifacts exclusivos, skills, modo, budget y milestones. Un ejecutor no
redelega.

`inline` significa que el orquestador ejecuta deliberadamente un rol acotado;
no es un fallo. `subagent` significa un hilo nativo separado.
`runtime-fallback` solo aparece si un subagente planeado queda inutilizable tras
una recuperacion acotada y el escritor anterior fue detenido.

El harness prefiere subagentes para investigacion/review independiente y
trabajo de un solo escritor con paralelismo util. Mantiene inline los artifacts
pequenos del camino critico cuando el orquestador ya tiene el contexto. La
arquitectura delegada es consultiva por defecto; la autoria requiere inputs,
template, stopping condition, artifact exclusivo y maximo de 8 rondas salvo
override.

Los presupuestos por defecto son 10 minutos para planning/curation, 20 para
implementacion y 15 para verificacion. No son timeouts rigidos. Los waits cortos
sirven para observar la UI; no autorizan interrupcion. Como maximo se hace una
recuperacion, y nunca se reemplaza un escritor sin confirmar que termino.

En Codex, los roles nativos viven en `.codex/agents/*.toml`. Si se agregaron
despues de abrir el hilo, abre un chat nuevo o recarga/reinicia la extension si
no aparecen. Esto es un problema de discovery, no de perdida de trabajo: un
subagente nativo generico puede recibir el mismo handoff portable.

Para un change de producto vinculado a un brief, tasks.md incluye una tarea
`[agent-requirements-curator]` antes de la verificacion final. El curator revisa
el inventario documental, actualiza solo el material afectado o registra
`no-change`/`not-applicable` con una justificacion, y devuelve su handoff sin
recibir trabajo de codigo, pruebas, verificacion o archive.

Mientras cambia el codigo, el ejecutor agrega pruebas focalizadas y usa `pnpm verify:fast`. Ese comando acelera el feedback, pero no sustituye la evidencia final.

## Verificacion

Ejecuta:

~~~bash
pnpm verify
~~~

Esto corre OpenSpec/harness validation, pruebas unitarias y de componentes, typecheck sin cache incremental, lint completo y build. El verifier crea verify-report.md con comandos, duraciones, exit codes, resumen, warnings, conformidad y veredicto PASS o FAIL. La exploracion en navegador es opcional para diagnostico humano y no bloquea PASS ni archive readiness.

La tarea documental del curator debe terminar antes de `pnpm verify`, para que
sus cambios formen parte del snapshot SHA-256 y cualquier ajuste posterior
invalide la evidencia segun la regla existente.

Un PASS final incluye un snapshot SHA-256 generado con `node scripts/validate-harness.mjs --snapshot <change-id>`. La validacion normal permite cambios en progreso reconciliados; `node scripts/validate-harness.mjs --archive-ready <change-id>` aplica el preflight terminal estricto.

Cualquier cambio posterior en implementacion o artifacts invalida el reporte y exige repetir `pnpm verify` y regenerar la evidencia.

Nota de version: OpenSpec 1.6 tiene instructions apply, pero no instructions verify ni archive. Para verificar o archivar, Codex debe usar openspec status --change <id> --json como preflight nativo. No se crea una maquina de estados alternativa.

## Archive

No archives un change si:

- quedan tareas sin marcar;
- falta apply-progress.md o no coincide con tasks.md;
- falta approvalCheckpoint valido para la implementacion iniciada;
- faltan delegationPlan o handoffs para tareas owner-tagged completadas;
- faltan modos, budgets, milestones o artifacts exclusivos, hay escritores
  duplicados, o un fallback no tiene recuperacion;
- falta verify-report.md PASS;
- el snapshot de evidencia falta o quedo stale;
- el brief o indice de requirements vinculados no se puede actualizar coherentemente.

Para un change con brief, marca el brief y su fila de indice como implemented con la referencia archive. Para un change tecnico sin brief, registra no requirement as applicable.

El cierre es fail-closed: no hay override por confirmacion ni por fallos preexistentes. Finaliza tasks/progress, ejecuta `pnpm verify`, crea PASS + snapshot, valida readiness, usa `openspec archive <change-id> --yes --json`, actualiza brief/indice y valida las specs aceptadas. No se mueve el directorio manualmente.

## Ejemplo de tarea tecnica pequena

Pedido: Actualiza una guia interna para aclarar el nombre de un comando, sin cambiar comportamiento.

Clasificacion: .agent + verificacion. No hace falta requirement brief. OpenSpec es opcional si se quiere trazabilidad tecnica.

Si se clasifica `no-change`, ejecuta checks aplicables sin status de change, apply-progress.md ni verify-report.md; la evidencia se devuelve en el handoff o resultado final.

## Prompts utiles

Crear o continuar un change:

~~~text
Usa el harness SDD. Recupera el estado de <change-id> con OpenSpec, tasks.md y apply-progress.md. Presenta el Implementation Approval Packet y no implementes hasta mi aprobacion explicita.
~~~

Trabajo interno:

~~~text
Clasifica este refactor/documentacion. Si no cambia el contrato aceptado, usa .agent y verifica sin forzar requirement brief.
~~~

Cerrar:

~~~text
Verifica <change-id>, crea el verify-report.md, reconcilia progreso y tasks, actualiza el requirement si aplica y archiva solo si todos los gates son PASS.
~~~
