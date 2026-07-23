# Guia del Harness SDD para Desarrolladores

Esta guia explica como trabajar con el harness de Next Template. Su objetivo es mantener contexto, decisiones y evidencia sin convertir cada ajuste tecnico en burocracia.

## Modelo Mental

La ruta de trabajo es:

~~~text
docs -> OpenSpec -> .agent -> implementacion -> verificacion -> archive
~~~

- docs contiene contexto amplio y requirements curados.
- OpenSpec contiene changes ejecutables y specs aceptadas.
- .agent contiene skills, roles, contratos y patrones tecnicos.
- AGENTS.md separa la entrada del orquestador raiz y la del ejecutor.
- `.agent/runtime-adapters/` conserva el contrato portable y su mapeo a cada
  runtime.

OpenSpec es la unica autoridad de estado ejecutable. No se crea una maquina de estados paralela.

## Politica de Documentacion

La revision del inventario documental es obligatoria para una capacidad nueva
o un cambio de alcance. Un archivo se actualiza solo si ese impacto lo afecta;
si ya es correcto, el curator registra `no-change` con su justificacion. No se
modifican README, contexto o diagramas solo para producir un diff.

## Que Ocurre al Iniciar una Tarea

El hilo raiz lee primero:

1. .agent/skills/spec-driven-development/SKILL.md
2. .agent/skill-registry.md
3. .agent/agents/orchestrator.md

Despues clasifica la tarea.

Un subagente no repite esa secuencia. Su asignacion comienza con
`HARNESS_EXECUTOR_V1`; lee el contrato de handoff, su perfil de rol exacto y
solo las skills enumeradas. No reclasifica la tarea, no crea otro change, no
repite curacion de requirements ni presenta otro Approval Packet.

| Si la tarea es... | El harness hace... |
|---|---|
| Una idea amplia, regla de negocio, permiso o flujo nuevo | Si la capacidad no existe en el contexto ni en requirements, delega primero la revision documental al curator; actualiza solo el material afectado y despues crea o actualiza el brief antes de OpenSpec. |
| Un cambio de comportamiento claro | Crea o actualiza un OpenSpec change. |
| La continuacion de un change activo | Recupera status, tasks.md y apply-progress.md. |
| Un refactor, documentacion o mantenimiento sin cambio de contrato | Usa .agent; OpenSpec es opcional y no exige requirement brief. |
| Un cierre | Verifica, registra evidencia, actualiza el requirement y archiva. |

## Antes de Implementar

Para un change activo, el agente debe:

1. Ejecutar openspec status --change <id> --json.
2. Ejecutar openspec instructions apply --change <id> --json.
3. Reread proposal, specs, design, tasks y el requirement brief cuando exista.
4. Confirmar que no faltan artifacts, rutas o decisiones bloqueantes.
5. Crear un plan de delegacion para cambios OpenSpec implementados.
6. Cargar solo las skills necesarias.

Despues de esa revision, el agente debe presentar un Implementation Approval Packet y detenerse antes de editar implementacion. Ese paquete resume change ID, requirement vinculado, readiness, scope, diseno, plan de tareas, delegacion, raices editables, familias de archivos esperadas, riesgos, preguntas abiertas y verificacion. Si apruebas explicitamente, el agente registra `approvalCheckpoint` en apply-progress.md y puede implementar. Si pides ajustes, actualiza los artifacts y vuelve a presentar el paquete.

## Durante la Implementacion

- tasks.md es la autoridad para saber que esta terminado.
- apply-progress.md es acumulativo: guarda tareas completas, archivos, decisiones, problemas, tareas restantes y skills cargadas.
- apply-progress.md registra `approvalCheckpoint` antes o junto al primer edit de implementacion. Esta evidencia hace auditable que se presento y aprobo el paquete; el validador comprueba la forma del registro, no prueba criptograficamente el chat humano.
- Si las tasks mapean a roles especializados, tasks.md usa owner tags como `[agent-data]`, `[agent-ui]`, `[agent-verifier]` u `[orchestrator]`.
- apply-progress.md registra `delegationPlan` schema v2: roles, task IDs, roots,
  skills, `skillResolution`, modo planeado/real, clase y minutos de presupuesto,
  milestones esperados, artifacts exclusivos y evidencia de recuperacion
  cuando aplica.
- Si tasks.md y apply-progress.md no coinciden, se reconcilian antes de seguir.
- Cada rol recibe un handoff con tarea acotada, change ID, estado nativo,
  raices editables, artifacts exclusivos, budget, milestones y paths exactos
  de skills.
- `skillResolution` solo indica `paths-injected` o `none`. La ejecucion se
  registra aparte como `inline`, `subagent` o `runtime-fallback`.
- `inline` es una decision planeada valida para trabajo pequeno o estrechamente
  acoplado. Si el runtime ya se sabe incapaz de crear subagentes, se planea
  `inline`; no se inventa un fallo.
- `runtime-fallback` se usa solo cuando un `subagent` planeado queda inutilizable
  despues de una recuperacion acotada. Debe registrar el trigger, la
  recuperacion y que el escritor anterior termino.
- Un ejecutor no redelega y ningun artifact autoritativo tiene dos escritores
  activos.
- El ejecutor crea junto al codigo las pruebas Vitest o Testing Library mas pequenas que detecten la regresion y usa `pnpm verify:fast` durante la iteracion.
- Para un change de producto con brief, una tarea `[agent-requirements-curator]` revisa el inventario documental antes de la verificacion final. Solo recibe el intent, el inventario, el contexto documental y sus raices permitidas; no implementa, verifica ni archiva.

### Decision de ejecucion

| Forma del trabajo | Modo normal |
|---|---|
| Artifact pequeno en el camino critico y contexto ya cargado | `inline` |
| Investigacion, triage, comparacion o review independiente | `subagent` |
| Implementacion acotada con un solo escritor y paralelismo util | `subagent` |
| Verificacion final independiente | `subagent` cuando esta disponible |
| Runtime sin capacidad conocida desde el inicio | `inline` planeado |
| Subagente planeado falla tras recuperacion acotada | `runtime-fallback` |

Los budgets por defecto son 10 minutos para planning/curation, 20 para
implementacion y 15 para verificacion. Son ventanas minimas de observacion, no
timeouts de comandos ni frecuencia de polling. Un wait de 30 o 60 segundos sin
resultado final no demuestra que el agente este colgado. Solo un `blocked`,
error terminal, violacion de roots o cancelacion permite interrumpir antes; al
agotarse el budget hay como maximo una recuperacion.

El arquitecto trabaja como asesor read-heavy por defecto y devuelve seams,
alternativas, recomendacion, archivos afectados, riesgos y verificacion. El
orquestador sintetiza `design.md`. Si el arquitecto recibe autoria, el handoff
incluye inputs exactos, template, artifact exclusivo, stopping condition y
`maxResearchRounds` (8 por defecto).

### Adaptador Codex

Codex registra los roles del proyecto en `.codex/agents/*.toml` y limita la
concurrencia desde `.codex/config.toml`. En la extension de VS Code se usan los
subagentes nativos; no se ejecuta `codex exec` como supervisor hijo.

Si la extension o el hilo ya estaban abiertos cuando se crearon los TOML, puede
ser necesario abrir un chat nuevo o recargar/reiniciar la extension para que
los nombres aparezcan. Mientras tanto, el mismo handoff portable puede
ejecutarse con un subagente nativo generico; no se pierde estado ni es necesario
cambiar a la CLI.

## Verificacion y Archive

Ejecuta:

~~~bash
pnpm verify
~~~

El comando corre, en orden:

1. OpenSpec validation.
2. Pruebas unitarias y de componentes con Vitest.
3. TypeScript sin cache incremental.
4. ESLint completo.
5. Next.js production build.

La exploracion en navegador es opcional y queda fuera de tasks.md, verify-report.md, PASS y archive readiness. Puede usarse para diagnostico o confianza adicional; si revela una regresion determinista, se abre una iteracion posterior con cobertura Vitest o Testing Library focalizada.

El verifier crea verify-report.md con comandos, duraciones, exit codes, warnings y veredicto PASS o FAIL.

La reconciliacion documental del curator ocurre antes de `pnpm verify`; asi sus
ediciones quedan dentro del snapshot de evidencia. Si la falta de subagentes se
conoce al planificar, se usa `inline` deliberadamente con las mismas raices.

El reporte PASS incluye un bloque `Evidence Snapshot` generado con `node scripts/validate-harness.mjs --snapshot <change-id>`.

Un change no se archiva si:

- quedan tareas sin marcar;
- falta apply-progress.md o no coincide con tasks.md;
- falta approvalCheckpoint valido para la implementacion iniciada;
- faltan delegationPlan o handoffs para tareas owner-tagged ya completadas;
- falta modo, budget, milestones o propiedad exclusiva, hay dos escritores, o
  un `runtime-fallback` carece de recuperacion concreta;
- falta verify-report.md PASS;
- el snapshot SHA-256 esta incompleto o stale;
- el requirement vinculado y su indice no se pueden actualizar.

Cualquier cambio posterior al reporte invalida PASS y exige repetir `pnpm verify` y regenerar la evidencia.

Nota: OpenSpec 1.6 ofrece instructions apply, pero no instructions verify ni archive. Para esas dos fases se usa openspec status --change <id> --json como preflight nativo.

El cierre no admite excepciones por fallos preexistentes. El orden terminal es: completar tasks/progress, ejecutar `pnpm verify`, finalizar tareas de verificacion, escribir PASS + snapshot, ejecutar `node scripts/validate-harness.mjs --archive-ready <change-id>`, archivar con `openspec archive <change-id> --yes --json`, actualizar brief/indice y validar specs aceptadas. Crear el reporte, mover el archive y actualizar el requirement despues del archive son operaciones de cierre, no checkboxes de implementacion.

## Ejemplo: Nueva Funcionalidad

Pedido:

~~~text
Quiero que los items puedan tener varias etiquetas. Las etiquetas se gestionan
desde configuracion y los items pueden filtrarse por etiqueta. Usa el harness SDD.
~~~

Como modifica comportamiento, datos y UI, el flujo normal es:

1. Delegar al curator la revision del inventario, actualizar solo el contexto,
   requirement u otra documentacion afectados y registrar el resultado cuando
   la funcionalidad aun no esta documentada.
2. Crear un change, por ejemplo add-item-tags.
3. Revisar proposal, delta specs, design y tasks.
4. Asignar tasks con owner tags y handoffs para data, UI, filtros, i18n y verifier.
5. Elegir execution mode proporcional, budgets y artifacts exclusivos; mantener
   apply-progress.md y tasks.md.
6. Ejecutar pnpm verify.
7. Crear verify-report.md, actualizar REQ-003 y archivar.

Para reanudar:

~~~text
Continua el change add-item-tags. Recupera el estado desde OpenSpec, tasks.md y apply-progress.md.
~~~

## Ejemplo: Tarea Tecnica Pequena

Pedido:

~~~text
Aclara una seccion de la guia interna sobre comandos de OpenSpec.
No cambia comportamiento del producto.
~~~

Clasificacion:

- Trabajo interno con .agent.
- No requiere requirement brief.
- OpenSpec es opcional si se quiere trazabilidad tecnica.
- Se verifica al finalizar.
- No ejecuta status de un change ni crea apply-progress.md/verify-report.md.

## Prompts Recomendados

Crear o continuar un change:

~~~text
Usa el harness SDD. Recupera el estado de <change-id> con OpenSpec,
tasks.md y apply-progress.md. Presenta el Implementation Approval Packet y no implementes hasta mi aprobacion explicita.
~~~

Evaluar una tarea:

~~~text
Clasifica esta tarea con el harness SDD. Si no cambia un contrato aceptado,
usa .agent y verificacion sin forzar requirement brief.
~~~

Cerrar:

~~~text
Verifica <change-id>, crea verify-report.md, reconcilia progreso y tareas,
actualiza el requirement si aplica y archiva solo con todos los gates PASS.
~~~

## Referencias

- AGENTS.md: punto de entrada obligatorio.
- harness-docs/human-operator-guide.md: guia para quien coordina el trabajo.
- .agent/contracts/phase-handoff.md: contrato entre roles.
- .agent/skills/spec-driven-development/SKILL.md: protocolo completo.
- .agent/skill-registry.md: resolucion de skills por path exacto.
- .agent/runtime-adapters/: contrato portable, adaptador Codex y adaptador generico.
