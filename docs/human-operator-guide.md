# Guia del Operador Humano

Esta guia explica como pilotar el desarrollo usando el ecosistema hibrido
OpenSpec + `.agent` desde un editor con Codex.

La idea central es simple:

```text
docs/project-context.md -> docs/requirements/ -> openspec/changes/
-> implementacion guiada por .agent -> openspec/specs/
```

Tu trabajo como humano es conducir la intencion, revisar decisiones y aprobar
cuando algo esta listo. Codex hace la curacion, crea artifacts, implementa,
ejecuta comandos y valida.

## Mapa Mental

- `docs/project-context.md`: conocimiento amplio del proyecto.
- `docs/requirements/`: cola de requerimientos candidatos.
- `openspec/changes/<change-id>/`: cambio ejecutable activo.
- `openspec/specs/`: comportamiento aceptado despues de archivar.
- `.agent/`: reglas tecnicas, patrones de implementacion y verificacion.

Frase recomendada para activar el flujo completo:

```text
Usa el flujo OpenSpec + .agent.
```

## Tu Papel Como Humano

Tu decides:

- que problema se quiere resolver;
- que requerimiento se trabaja primero;
- si el scope esta bien;
- si los artifacts OpenSpec representan correctamente la intencion;
- cuando implementar;
- cuando archivar.

Codex hace:

- leer contexto;
- curar requerimientos;
- crear cambios OpenSpec;
- actualizar specs/design/tasks;
- implementar con `.agent`;
- ejecutar `openspec`;
- validar con typecheck, lint y build;
- archivar cambios cuando se lo pidas.

## Flujo Base Para Una Feature Nueva

### 1. Escribe o actualiza el contexto raiz

Edita:

```text
docs/project-context.md
```

Incluye ahi:

- vision del producto;
- actores y roles;
- reglas de negocio;
- flujos principales;
- modelo de datos;
- arquitectura propuesta;
- requisitos funcionales;
- requisitos no funcionales;
- dudas abiertas;
- feedback del cliente.

No intentes convertir ese documento en una spec perfecta. Es material fuente.

### 2. Pide a Codex extraer requerimientos candidatos

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Lee docs/project-context.md y extrae requerimientos candidatos.
Crea o actualiza docs/requirements/ con requirement briefs claros.
Actualiza docs/requirements/index.md.
No crees cambios OpenSpec todavia.
```

Codex deberia crear o actualizar:

```text
docs/requirements/index.md
docs/requirements/<requirement-kebab>/brief.md
```

Tu revisas:

- si la intencion es correcta;
- si el scope es pequeno y ejecutable;
- si actores/permisos estan claros;
- si reglas y restricciones estan capturadas;
- si las dudas siguen como dudas;
- si el `change-id` sugerido tiene sentido.

Si algo esta mal:

```text
Refina REQ-00X:
- divide este scope en dos requerimientos;
- marca esta decision como pregunta abierta;
- elimina este comportamiento fuera de alcance;
- mantenlo como candidate, no crees OpenSpec todavia.
```

### 3. Elige un requerimiento para desarrollar

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Quiero desarrollar REQ-00X.
Crea el cambio OpenSpec desde docs/requirements/<requirement>/brief.md.
Usa el change-id sugerido.
Crea proposal, specs, design y tasks.
No implementes todavia.
```

Codex deberia crear:

```text
openspec/changes/<change-id>/proposal.md
openspec/changes/<change-id>/design.md
openspec/changes/<change-id>/tasks.md
openspec/changes/<change-id>/specs/<domain>/spec.md
```

### 4. Revisa los artifacts OpenSpec

Antes de implementar, abre y revisa:

- `proposal.md`: por que existe el cambio y que cambia.
- `spec.md`: comportamiento esperado y escenarios.
- `design.md`: enfoque tecnico.
- `tasks.md`: pasos de implementacion.

Checklist humano:

- El proposal expresa lo que realmente quieres.
- Los non-goals estan claros.
- Los escenarios son verificables.
- El design sigue la arquitectura esperada.
- El design respeta `.agent`.
- Las tasks son pequenas y accionables.
- No falta ninguna regla importante.

Si necesitas corregir:

```text
Actualiza el cambio OpenSpec <change-id> antes de implementar:
- <correccion 1>
- <correccion 2>
- <correccion 3>
Mantén proposal, specs, design y tasks sincronizados.
No implementes todavia.
```

### 5. Aprueba la implementacion

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Implementa openspec/changes/<change-id>/tasks.md.
Sigue las skills aplicables de .agent para arquitectura, data, UI, forms,
filters, i18n, SSR y verification.
Si descubres cambios de scope o comportamiento, actualiza OpenSpec antes de
continuar.
```

### 6. Verifica

Prompt:

```text
Ejecuta la verificacion completa de <change-id>.
Valida OpenSpec y luego ejecuta typecheck, lint y build.
Clasifica fallos como nuevos o preexistentes.
Corrige cualquier fallo nuevo.
```

Gates esperados:

```bash
openspec validate --all --json
pnpm tsc --noEmit
pnpm lint
pnpm build
```

### 7. Archiva

Cuando todo este listo:

```text
Archiva el cambio OpenSpec <change-id>.
Actualiza el requirement brief vinculado a implemented.
Enlaza el cambio archivado y la spec aceptada.
```

Resultado esperado:

```text
openspec/specs/<domain>/spec.md
openspec/changes/archive/<date>-<change-id>/
docs/requirements/<requirement>/brief.md
docs/requirements/index.md
```

## Matriz De Decisiones

Usa esta tabla para saber que hacer en cada escenario.

| Escenario | Requirement brief nuevo | OpenSpec change nuevo | Accion correcta |
|---|---:|---:|---|
| Feature nueva desde contexto amplio | Si | Si | Curar requirement, crear cambio, revisar, implementar, archivar |
| Cambio detectado mientras el change sigue activo | No | No | Actualizar el change activo y continuar |
| Feedback de cliente despues de archivar | Normalmente si | Si | Crear requirement incremental y nuevo change |
| Nueva regla de negocio | Si | Si | Requirement incremental + OpenSpec change |
| Cambio de roles/permisos | Si | Si | Requirement incremental + OpenSpec change |
| Cambio de flujo de usuario | Si | Si | Requirement incremental + OpenSpec change |
| Bug contra comportamiento aceptado | No | Si | OpenSpec change pequeno de correccion |
| Ajuste visual pequeno | No normalmente | Si si ya estaba archivado | Change directo o actualizar change activo |
| Refactor tecnico interno | No | Opcional | `.agent` + verificacion; OpenSpec si quieres trazabilidad |
| Mejora de arquitectura | No como producto | Si recomendado | Technical OpenSpec change |
| Texto/i18n sin cambio de comportamiento | No | Opcional | Change pequeno si ya estaba archivado |
| Cambio trivial dentro de una tarea activa | No | No | Actualizar tasks/specs del change activo si aplica |

## Escenario: Cambios Durante Una Feature Activa

Si el trabajo aun esta en:

```text
openspec/changes/<change-id>/
```

no crees otro requerimiento ni otro change. Actualiza el cambio activo.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Estoy revisando el cambio <change-id> y quiero ajustar:
- <ajuste 1>
- <ajuste 2>
Actualiza specs, design y tasks si aplica.
Luego implementa el ajuste siguiendo .agent.
```

Ejemplo:

```text
Usa el flujo OpenSpec + .agent.
Estoy revisando add-customers y quiero ajustar:
- el boton debe decir "Desactivar" en vez de "Eliminar";
- el modal debe explicar que se conserva el historial;
- el filtro por estado debe venir por defecto en "Activos".
Actualiza specs, design y tasks si aplica.
Luego implementa el ajuste siguiendo .agent.
```

## Escenario: Feedback Del Cliente Despues De Archivar

Si el cambio ya fue archivado, no edites el archive como trabajo activo.

Flujo correcto:

```text
feedback -> requirement incremental -> nuevo openspec change
-> implementacion -> verificacion -> archive
```

Prompt:

```text
Usa el flujo OpenSpec + .agent.
El cliente pidio este cambio sobre funcionalidad ya implementada:
<describe el cambio>.
Crea un requirement brief incremental en docs/requirements/.
No crees OpenSpec todavia.
```

Luego:

```text
Usa el flujo OpenSpec + .agent.
Crea un OpenSpec change para REQ-00X.
Este cambio modifica comportamiento ya aceptado en openspec/specs/<domain>/spec.md.
Crea proposal, specs delta, design y tasks.
No implementes todavia.
```

## Escenario: Bug Encontrado En Revision

Si es un bug porque el software no cumple la spec viva, normalmente no hace
falta requirement nuevo.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Detecte este bug contra comportamiento ya aceptado:
<describe el bug>.
Crea un OpenSpec change pequeno de correccion.
No hace falta crear requirement brief salvo que detectes que cambia reglas o scope.
No implementes todavia.
```

Despues revisas el change y apruebas implementacion.

## Escenario: Ajuste Visual O UX Pequeno

Si no cambia reglas, permisos ni flujo principal, normalmente no requiere
requirement brief.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Quiero este ajuste UX sobre una funcionalidad ya implementada:
<describe el ajuste>.
Crea un OpenSpec change pequeno si el comportamiento aceptado cambia.
Si es solo presentacional, implementalo siguiendo .agent y verifica.
```

Ejemplos:

- cambiar copy de un modal;
- mejorar empty state;
- ajustar orden de columnas;
- hacer mas clara una confirmacion.

Si afecta lo que el usuario puede hacer o lo que el sistema promete, usa
OpenSpec.

## Escenario: Refactor Tecnico

Si no cambia comportamiento visible, no necesitas requirement de producto.

Prompt:

```text
Usa .agent para planificar este refactor tecnico:
<describe el refactor>.
No cambies comportamiento aceptado.
Si ves que el contrato del sistema cambia, detente y propone un OpenSpec change.
Verifica al final.
```

Si quieres trazabilidad tecnica:

```text
Usa el flujo OpenSpec + .agent.
Crea un OpenSpec technical change para este refactor:
<describe el refactor>.
No cambia comportamiento de usuario.
Crea proposal, design y tasks.
```

## Escenario: Cambio De Regla De Negocio

Siempre usa requirement incremental.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
El cliente cambio esta regla de negocio:
<describe la regla>.
Crea un requirement brief incremental.
Luego crea un OpenSpec change que modifique la spec viva correspondiente.
No implementes hasta que revise proposal, specs, design y tasks.
```

## Escenario: Cambio De Permisos O Roles

Tratalo como cambio de producto, no como ajuste tecnico.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Necesito cambiar permisos/roles:
<describe quien puede hacer que>.
Crea un requirement brief incremental y un OpenSpec change.
Asegurate de reflejar escenarios de autorizacion.
No implementes todavia.
```

## Escenario: Cambio En Modelo De Datos

Si afecta comportamiento, persistencia o reglas, usa requirement + OpenSpec.

Prompt:

```text
Usa el flujo OpenSpec + .agent.
Necesito cambiar el modelo de datos:
<describe entidades/campos/reglas>.
Crea o actualiza el requirement brief correspondiente.
Crea un OpenSpec change con design y tasks.
Incluye riesgos de migracion o compatibilidad si aplica.
No implementes todavia.
```

## Escenario: El Cliente Pide "Algo Pequeno"

No decidas por tamano aparente. Decide por impacto.

Preguntate:

- Cambia comportamiento prometido?
- Cambia permisos?
- Cambia una regla?
- Cambia un flujo?
- Cambia datos persistidos?

Si la respuesta es si, usa OpenSpec. Si ademas viene de producto/cliente, usa
requirement incremental.

Prompt seguro:

```text
Usa el flujo OpenSpec + .agent.
Evalua este cambio:
<describe el cambio>.
Dime si requiere requirement brief incremental, OpenSpec change directo o solo
implementacion con .agent.
No implementes hasta que confirmemos el camino.
```

## Prompts Frecuentes

Extraer requirements:

```text
Usa el flujo OpenSpec + .agent.
Lee docs/project-context.md y extrae requerimientos candidatos.
Crea o actualiza docs/requirements/ y docs/requirements/index.md.
No crees cambios OpenSpec todavia.
```

Crear change:

```text
Usa el flujo OpenSpec + .agent.
Crea un OpenSpec change para REQ-00X desde docs/requirements/<requirement>/brief.md.
Crea proposal, specs, design y tasks.
No implementes todavia.
```

Actualizar change activo:

```text
Actualiza el OpenSpec change <change-id>:
- <cambio>
- <cambio>
Mantén proposal, specs, design y tasks sincronizados.
Luego continua con la implementacion si ya estaba aprobada.
```

Implementar:

```text
Implementa openspec/changes/<change-id>/tasks.md siguiendo .agent.
Actualiza OpenSpec primero si cambia scope o comportamiento.
```

Verificar:

```text
Ejecuta verificacion completa para <change-id>:
OpenSpec validation, typecheck, lint y build.
Corrige fallos nuevos y reporta fallos preexistentes.
```

Archivar:

```text
Archiva el OpenSpec change <change-id> y marca el requirement vinculado como implemented.
```

## Cuando Usar La Terminal

Puedes pedirle a Codex que ejecute todo, pero la terminal es util para mirar
estado rapidamente:

```bash
openspec list
openspec list --specs
openspec validate --all --json
pnpm lint
pnpm build
```

Deja que Codex ejecute comandos cuando necesites que interprete la salida,
clasifique errores o corrija fallos.

## Buenos Habitos

- Mantén `docs/project-context.md` amplio y honesto.
- Haz requirements pequenos y enfocados.
- Revisa OpenSpec antes de implementar.
- No dejes cambios de comportamiento solo en codigo.
- Actualiza OpenSpec si cambia el entendimiento.
- Archiva cambios terminados.
- Trata `.agent` como regla tecnica, no como backlog.
- Prefiere cambios pequenos y archivables.

## Anti-Patrones

- Implementar directo desde una idea vaga.
- Crear un solo requirement enorme.
- Crear un OpenSpec change para varias features sin relacion.
- Cambiar codigo sin actualizar OpenSpec cuando cambia comportamiento.
- Dejar cambios implementados sin archivar.
- Usar `docs/project-context.md` como spec final.
- Crear requirements para refactors que no cambian producto.

## Regla De Oro

Mientras el cambio esta abierto:

```text
actualiza el change activo
```

Despues de archivar:

```text
cambio de producto/regla/flujo -> requirement incremental + OpenSpec change
bug/ajuste pequeno -> OpenSpec change directo
refactor interno -> .agent + verificacion, OpenSpec opcional
```

## Loop Recomendado

```text
escribir contexto -> curar requirements -> elegir uno -> crear OpenSpec change
-> revisar artifacts -> implementar -> verificar -> archivar -> repetir
```

