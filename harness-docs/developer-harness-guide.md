# Guía del Harness para Desarrolladores

El harness conserva intención, decisiones y evidencia sin aplicar el mismo
costo a todas las tareas:

`docs -> OpenSpec -> .agent -> implementación -> verificación -> archive`

OpenSpec es la única autoridad de estado ejecutable. `.agent` define criterio
técnico, roles y referencias cargadas bajo demanda.

## 1. Clasifica el nivel de aseguramiento

| Perfil | Cuándo | Trabajo obligatorio |
|---|---|---|
| `no-change` | Reparación que restaura el contrato aceptado, refactor/docs internos o investigación | Citar contrato/scope preservado y ejecutar checks afectados; sin change/progress/report. |
| `standard-change` | Cambio normal de implementación o comportamiento aceptado | OpenSpec, approval digest, progreso v3, pruebas focalizadas y runner final. |
| `high-risk` | Datos destructivos, seguridad/permisos, migración, plataforma/dependencia o sistema externo | Lo anterior más revisión independiente y evidencia específica del riesgo. |

Una capacidad de producto nueva que no existe en contexto/requirements pasa
primero por el curator. Este revisa `docs/documentation-inventory.md` y sólo
edita documentación realmente afectada. Un trabajo interno sin contrato no
fuerza requirement brief.

## 2. Recupera y aprueba

Para aplicar un change:

```bash
openspec status --change <id> --json
openspec instructions apply --change <id> --json
```

Relee brief cuando aplica, proposal, delta specs, design y tasks. Confirma
coherencia, rutas alcanzables y ausencia de preguntas bloqueantes. Calcula:

```bash
node scripts/validate-harness.mjs --planning-digest <id>
```

El Implementation Approval Packet incluye ID/perfil, requirement, readiness,
scope/no-goals, diseño, tareas/ownership, roots/familias de archivos,
riesgos/preguntas y verificación. No se edita implementación hasta aprobación
explícita. El checkpoint schema 2 guarda el path set exacto y SHA-256; cambiar
contenido de planificación exige nueva aprobación, pero marcar checkboxes no.

## 3. Ejecuta con contexto mínimo

El root carga SDD, registry y orchestrator. Un executor recibe
`HARNESS_EXECUTOR_V1` y sólo lee contrato, rol y skills exactas. Los ejemplos
largos no forman parte del bootstrap: se consultan por rutas exactas en
`.agent/reference/widget/`.

`tasks.md` lleva owner tags. `apply-progress.md` schema 3 separa:

- `ownershipPlan`: responsabilidad, tasks, roots, skills, modo planeado y
  artifacts exclusivos;
- `executionRecords`: resultado real, archivos, checks y riesgos.

Modos:

- `inline`: trabajo pequeño/acoplado; registro compacto sin budget,
  milestones ni historia de fallback;
- `subagent`: trabajo independiente con un escritor; añade milestones y
  budget (10 min planning/curation, 20 implementación, 15 verificación por
  defecto);
- `runtime-fallback`: sólo tras fallar un subagente planeado, un intento de
  recuperación y confirmación de que el escritor previo terminó.

Un wait vacío no prueba bloqueo. Nunca hay dos escritores activos sobre el
mismo artifact. El arquitecto es asesor por defecto; autoría exige inputs,
template, artifact exclusivo, stopping condition y `maxResearchRounds`.

Durante edición usa el test más barato que detecte la regresión y:

```bash
pnpm verify:fast
```

Esto es feedback provisional, no evidencia terminal.

## 4. Documentación condicional

Un change vinculado a brief compara impacto documental aprobado, digest, scope
implementado y maintained paths. Si el impacto planeado sigue en `none` y
ningún path fue tocado, registra `unchanged-scope`/`no-change` sin invocar al
curator. Cualquier impacto material usa una task del curator antes de verificar.
Cambios requirementless registran `not-applicable`; no crean diffs decorativos.

## 5. Verificación única

Antes de gates caros, el validador comprueba que todo `MODIFIED` conserve
identidades de requirements y escenarios aceptados.

Congela implementación y ejecuta exactamente una vez:

```bash
pnpm verify
```

El runner dependency-free transmite output, mide y ejecuta una vez:

1. `pnpm validate:specs`
2. `pnpm test:unit:run`
3. `pnpm typecheck`
4. `pnpm lint`
5. `pnpm build`

Falla rápido y escribe resultado estructurado ignorado en
`.cache/harness/verification-result.json`. No repitas gates exitosos para
fabricar evidencia.

`verify-report.md` incluye conformance, warnings, veredicto y el JSON exacto
bajo `## Verification Run`. Después de finalizar tasks/progress:

```bash
node scripts/validate-harness.mjs --snapshot <id>
node scripts/validate-harness.mjs --archive-ready <id>
```

Cualquier edit cubierto vuelve stale el PASS.

## 6. Cierre

Con readiness PASS usa únicamente:

```bash
openspec archive <id> --yes --json
```

Después reconcilia brief/index cuando aplica y valida specs aceptadas. No hay
override por confirmación ni por fallos preexistentes. Crear reporte, ejecutar
archive y actualizar requirement después del archive son operaciones de
cierre, no checkboxes implementables.

## Comandos rápidos

```bash
pnpm validate:harness
pnpm validate:specs
pnpm test:unit:run
pnpm verify:fast
pnpm verify
```

OpenSpec 1.6 sólo expone `instructions apply`; verify/archive usan `status`.
