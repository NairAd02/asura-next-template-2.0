# Guía del Operador Humano

El harness usa controles proporcionales. Tu decisión principal es confirmar
qué se va a cambiar, no revisar rituales repetidos.

## Rutas

| Pedido | Ruta esperada |
|---|---|
| Explicación, reparación contract-preserving, refactor/docs internos | `no-change`: citar límite y ejecutar checks afectados, sin OpenSpec artifacts. |
| Cambio normal de producto/implementación | `standard-change`. |
| Seguridad, permisos, datos destructivos, migración, plataforma/dependencia o sistema externo | `high-risk` con verificación independiente. |
| Idea amplia o capacidad nueva no documentada | Curator/documentación afectada, brief, luego OpenSpec. |
| Change activo | Recuperar status, tasks y progress; no duplicarlo. |

## Qué aprobar

Antes del primer edit debes recibir un Implementation Approval Packet con:

- change ID y perfil;
- requirement o `not-applicable`;
- readiness y digest SHA-256 de proposal/specs/design/tasks;
- scope/no-goals y resumen de diseño;
- plan de tasks, roles, roots y familias de archivos;
- riesgos, preguntas y plan de verificación.

Responde explícitamente si lo apruebas. Si pides un ajuste, el agente modifica
planificación y presenta un digest nuevo. Cambiar sólo checkboxes no invalida
la aprobación.

## Cómo leer el progreso

`tasks.md` es la autoridad de completitud. `apply-progress.md` schema 3 contiene
un snapshot legible por máquina:

- perfil y tareas completas/restantes;
- approval checkpoint ligado al digest;
- ownership plan con un escritor por artifact;
- execution records compactos con archivos, checks y riesgos.

`inline` no necesita budget ni milestones. `subagent` sí los registra.
`runtime-fallback` sólo es válido con fallo real, una recuperación acotada y
escritor previo detenido. Esto elimina narración falsa para trabajo ejecutado
deliberadamente inline.

Los roles cargan sólo skills necesarias; ejemplos extensos se consultan bajo
`.agent/reference/`. Los presupuestos 10/20/15 son ventanas mínimas para
subagentes, no timeouts de comandos. Un polling vacío no justifica
interrupción.

## Cuándo se actualiza documentación

Una capacidad nueva o cambio de scope revisa el inventario. Para un brief
vinculado, scope/impact estable y sin maintained files tocados permite
`unchanged-scope` sin curator; impacto material exige curator. Un change
técnico sin brief registra `not-applicable`. Estos no-ops con razón son
evidencia válida, no una omisión.

## Verificación y costo

Durante implementación se permite `pnpm verify:fast`. Al final se congela el
trabajo y se ejecuta exactamente un `pnpm verify`. El runner corre una vez y
mide:

1. specs/harness;
2. Vitest unit/component;
3. TypeScript no incremental;
4. lint completo;
5. build de producción.

Falla rápido. El verifier no reejecuta gates exitosos ni repara código. Para
`high-risk`, el verifier debe ser independiente.

El reporte PASS contiene el resultado estructurado y un snapshot SHA-256
fresco. Cualquier cambio posterior exige una nueva ejecución final.

## Archive fail-closed

No se archiva con tasks pendientes, progreso incoherente, digest stale,
ownership/evidence incompletos, delta incompatible, documentación pendiente,
gate fallido o snapshot stale.

Secuencia:

```bash
openspec status --change <id> --json
node scripts/validate-harness.mjs --archive-ready <id>
openspec archive <id> --yes --json
```

Luego se actualiza brief/index cuando aplica y se validan specs aceptadas. Ni
tu confirmación ni un fallo preexistente reemplazan PASS.

## Prompts útiles

```text
Clasifica esta tarea y usa el perfil proporcional. Si es no-change, no crees
artifacts de change.
```

```text
Continúa <id>. Recupera OpenSpec/tasks/progress y presenta el Approval Packet
ligado al planning digest antes de editar.
```

```text
Verifica <id> con una sola ejecución final; no repitas gates exitosos y no
archives si strict readiness falla.
```
