# .agent/ — Ecosistema de Skills + Orquestación Multi-Agente

Carpeta portable (agnóstica de runtime) que contiene el **Skill Registry**, las
**skills de desarrollo**, las **definiciones de agentes** y un **módulo de
referencia** para este proyecto Next.js 16.

Este proyecto usa un flujo híbrido:

- `docs/project-context.md` y `docs/requirements/` guardan conocimiento y requerimientos candidatos.
- `openspec/changes/` y `openspec/specs/` guardan cambios ejecutables y specs vivas.
- `.agent/` guarda reglas técnicas, patrones de implementación y verificación.

## ¿Qué hay aquí?

```
.agent/
├── README.md               ← Este archivo
├── skill-registry.md       ← Índice central (tabla Skill | Trigger | Path | Owner)
├── agents/                 ← Definiciones de agentes (orquestador + subagentes)
├── skills/                 ← Skills SKILL.md de carga lazy (progressive disclosure)
└── reference/
    ├── widget/             ← Módulo de código de referencia genérico (NO es código de producción)
    └── spec-example/       ← Spec de referencia para la misma entidad Widget (NO es documentación de producto)
```

## Principio de funcionamiento

El agente **orquestador** lee únicamente `skill-registry.md` al iniciar.  
Cuando detecta que una tarea aplica a ciertos skills, los pasa a los **subagentes** junto con sus instrucciones de skill específica. Ningún agente carga el catálogo completo, solo lo que necesita para su fase y tarea.

### Fases SDD (Spec-Driven Development)
```
Research → OpenSpec Design → Implementation → Verification
```

## Relación con OpenSpec

OpenSpec es la capa de cambios:

- `/opsx:explore` para investigar una idea o requirement.
- `/opsx:propose <change-id>` para crear proposal, delta specs, design y tasks.
- `/opsx:apply <change-id>` para implementar tasks.
- `/opsx:update <change-id>` para ajustar artifacts cuando se aprende algo nuevo.
- `/opsx:archive` o `openspec archive` para cerrar y actualizar `openspec/specs/`.

`.agent` no escribe specs ejecutables. Sus skills se usan como criterio para que
los artifacts y la implementación de OpenSpec respeten el stack del proyecto.

## Módulos de referencia

`.agent/reference/widget/` contiene un módulo completo genérico con la entidad `Widget`.  
**No es código de producción**, está excluido de `tsc`, `eslint` y `next build`. Su único propósito es que los agentes puedan leer código real que ilustre los patrones del proyecto.

`.agent/reference/spec-example/` contiene un ejemplo de requisitos y edge cases
para el mismo módulo `Widget`. Sirve como referencia de calidad y trazabilidad,
pero el destino de specs ejecutables es OpenSpec.

## Cómo usar en distintos runtimes

| Runtime | Cómo cargar skills |
|---|---|
| **Claude Code** | Añadir `.agent/skills/<skill>/SKILL.md` al contexto del agente, o referenciar desde `.claude/CLAUDE.md` |
| **Windsurf/Cascade** | Referenciar desde `.windsurf/rules/` o incluir paths en el system prompt del agente |
| **OpenCode / Devin** | Pasar la ruta del `SKILL.md` en las instrucciones de tarea del subagente |
| **Cualquier runtime SKILL.md** | Los archivos siguen el estándar abierto (frontmatter `name`/`description` + cuerpo Markdown) |

## Convenciones de los SKILL.md

Cada `SKILL.md` sigue esta estructura:
```yaml
---
name: <nombre corto>
description: <cuándo cargar esta skill — 1 oración>
---
```
Seguido de: **Cuándo usar**, **Reglas**, **Snippets** (entidad genérica `widget`), **Checklist** y **Errores comunes**.

## Cómo extender

1. Crea una nueva carpeta en `skills/<tu-skill>/SKILL.md`.
2. Añade una fila en `skill-registry.md`.
3. Asigna un Owner en la columna correspondiente.
