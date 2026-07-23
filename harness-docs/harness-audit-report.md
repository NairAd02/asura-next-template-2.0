# Auditoria del Harness SDD

Fecha: 2026-07-15  
Requirement: REQ-003  
Change: `harden-sdd-harness-after-audit`

## Conclusion

La arquitectura `docs -> OpenSpec -> .agent -> implementacion -> verificacion -> archive` aporta valor real: separa intencion durable, contrato ejecutable, criterio tecnico y evidencia; permite recuperar un trabajo activo sin depender del chat; y reduce la divergencia entre roles. La auditoria tambien encontro contradicciones que permitian saltar esas garantias, principalmente en skills locales generadas, cierre manual, evidencia sin freshness y una referencia de codigo fuera de los gates.

## Hallazgos Corregidos

- `propose` podia crear artifacts sin respetar classification ni requirement curation.
- `apply` no exigia una revision semantica de readiness, exact skill paths, handoffs persistidos ni progreso acumulativo.
- `archive` trataba artifacts/tareas incompletos como warnings confirmables y movia directorios manualmente.
- Guias usaban `instructions <phase>` aunque OpenSpec 1.6.0 solo soporta `instructions apply` para este ciclo.
- PASS se invalidaba solo por convencion; no existia un snapshot reproducible de archivos cubiertos.
- La ruta `no-change` estaba clasificada pero no definia evidencia sin artifacts OpenSpec inventados.
- La referencia widget no formaba parte explicita de typecheck/lint.
- La reproducibilidad dependia de version CLI compatible, lockfile no versionado y font fetch durante build.

Los archives historicos se conservan sin modificaciones. Sirven como evidencia del estado anterior y estan excluidos deliberadamente del validador activo.

## Controles Mecanicos

- Version global exacta OpenSpec 1.6.0.
- Marcador `LOCAL_HARNESS_INTEGRATION_V1` en propose/apply/sync/archive para detectar overlays perdidos por `openspec update`.
- Rechazo de instrucciones locales con archive manual o bypass por confirmacion.
- Validacion continua de artifacts activos, tasks parseables, `Current Snapshot` y reconciliacion de IDs.
- Preflight separado `--archive-ready` que exige tareas completas, progreso `ready-for-archive`, PASS y snapshot fresco.
- Snapshot SHA-256 con paths ordenados de artifacts del change, requirement/indice vinculados y archivos declarados en progreso; `verify-report.md` se excluye para evitar autorreferencia.
- Casos Node negativos para tareas pendientes en archive, progreso ausente, FAIL, snapshot stale y archive skill insegura.
- Archive exclusivamente mediante `openspec archive <change-id> --yes --json`.

## Controles que Siguen Siendo Convenciones

La automatizacion no puede probar por si sola:

- que proposal, design o specs representan la verdadera intencion del usuario;
- que una aprobacion humana fue informada;
- que un handoff es de buena calidad o que sus afirmaciones son honestas;
- que un agente respeto editable roots si el runtime no impone esos limites;
- que la lista `filesChanged` es completa si un ejecutor omite deliberadamente un archivo;
- que pruebas manuales de navegador ocurrieron exactamente como se reportan;
- que una implementacion satisface comportamiento no expresado en specs o tests.

Por eso el harness reduce errores observables y hace los desajustes auditables, pero no sustituye revision humana, tests de comportamiento ni controles del runtime.

## Riesgos Residuales y Operacion

- OpenSpec update puede sobrescribir skills: el marker hace fallar el gate, pero un mantenedor debe revisar y restaurar el overlay.
- El parser Markdown es intencionalmente estrecho: tasks usan IDs numerados y progreso/reporte usan bloques JSON estables.
- La validacion normal permite trabajo activo reconciliado; solo `--archive-ready` exige completitud terminal. Esto evita bloquear apply sin relajar archive.
- Cualquier cambio cubierto despues de PASS hace stale el digest y obliga a repetir `pnpm verify`.
- La calidad UI se valida adicionalmente en el piloto de proveedores mediante navegador sin introducir un framework nuevo.

## Secuencia Terminal Aceptada

1. Completar implementacion y verificaciones de navegador.
2. Ejecutar los gates finales de `pnpm verify`.
3. Marcar tareas verificables completas y progreso `ready-for-archive`.
4. Crear PASS con snapshot SHA-256.
5. Ejecutar status y `--archive-ready`.
6. Ejecutar native archive.
7. Actualizar brief/indice y validar specs aceptadas.

Crear el reporte, efectuar el archive nativo y reconciliar requirement/indice despues del archive son operaciones de cierre, no tareas implementables.

## Actualizacion de Orquestacion 2026-07-23

La investigacion de una ejecucion real en la extension de Codex encontro que
dos arquitectos nativos fueron interrumpidos mientras seguian leyendo y
sintetizando. Los waits vacios y la ausencia temporal de `design.md` se habian
interpretado como fallos, aunque otros agentes exitosos necesitaron entre
aproximadamente 4 y 13 minutos.

El harness ahora:

- separa el bootstrap raiz del ejecutor mediante `HARNESS_EXECUTOR_V1`;
- separa owner, `skillResolution` y execution mode;
- acepta `inline` planeado, `subagent` y `runtime-fallback` con evidencia;
- usa milestones semanticos y budgets 10/20/15 que no son polling timeouts;
- permite una sola recuperacion y exige detener al escritor anterior;
- valida propiedad exclusiva de artifacts;
- limita arquitectura a modo advisory/authoring con 8 rondas por defecto;
- mantiene contratos portables bajo `.agent/runtime-adapters/`;
- registra cinco agentes de proyecto bajo `.codex/agents/`.

La validacion mecanica prueba forma y coherencia de la evidencia. No puede
demostrar actividad real del proveedor, tiempo transcurrido ni veracidad de un
evento de chat.

## Optimización Operacional 2026-07-23

El cambio `optimize-harness-operational-cost` conserva los controles de cierre
y reduce el costo diario:

- tres assurance profiles evitan forzar artifacts de change en trabajo
  `no-change` y añaden independencia sólo en `high-risk`;
- approval checkpoint schema 2 queda ligado al path set y planning digest
  SHA-256, normalizando checkboxes para no solicitar reaprobación artificial;
- progress schema 3 separa `ownershipPlan` de `executionRecords`; inline omite
  budgets, milestones y fallback que no aplican;
- el handoff narrativo acumulativo deja de ser evidencia obligatoria;
- skills de data/UI conservan reglas y checklists, pero cargan ejemplos largos
  de `.agent/reference/widget/` sólo cuando son necesarios;
- budgets mecánicos limitan bootstrap root, executor UI y executor data;
- la reconciliación documental sólo es obligatoria para changes de producto
  vinculados a un brief;
- el preflight protege identidades aceptadas antes de gates caros;
- `pnpm verify` invoca un runner único que transmite output, mide los cinco
  gates, falla rápido y genera un resultado estructurado sin reejecuciones.

Los gates finales, snapshot fresco, strict readiness y archive nativo continúan
fail-closed. Archives históricos permanecen inmutables y fuera de la migración
activa.
