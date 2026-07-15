---
name: spec-driven-development
description: Cargar siempre. Define el protocolo híbrido OpenSpec + .agent (Research → OpenSpec Design → Implementation → Verification).
---

# Hybrid Spec-Driven Development

## Cuándo usar
**Siempre.** El orquestador carga esta skill al inicio de cualquier tarea.

## Principio central

OpenSpec es la capa ejecutable de cambio:

- `openspec/changes/<change-id>/` contiene proposal, delta specs, design y tasks.
- `openspec/specs/` contiene el comportamiento vigente tras sync/archive.

`.agent` es la capa de criterio técnico:

- define skills, patrones de módulo, convenciones del stack y gates de verificación;
- no compite con OpenSpec como fuente de specs ejecutables.

`docs/` es la capa de conocimiento:

- `docs/project-context.md` es el documento raíz estándar;
- `docs/requirements/` contiene requerimientos candidatos curados;
- las specs ejecutables viven solo en OpenSpec.

## Las 4 fases obligatorias

### Fase 1: Research
- Leer los archivos relevantes del proyecto antes de proponer nada.
- Si la tarea nace de producto/discovery, leer primero `docs/project-context.md`.
- Si existe un brief, leer `docs/requirements/<requirement>/brief.md`.
- Identificar qué módulos/componentes compartidos existen y pueden reutilizarse.
- Consultar `.agent/skill-registry.md` para saber qué skills aplican.

### Fase 2: OpenSpec Design
- Si no existe un requirement brief claro, delegar primero a `agent-requirements-curator` (skill `requirements-curation`) para crear o actualizar `docs/requirements/<requirement>/brief.md`.
- Elegir un `change-id` kebab-case y usar `/opsx:explore` cuando el alcance aún necesite investigación.
- Usar `/opsx:propose <change-id>` para crear `openspec/changes/<change-id>/` con proposal, delta specs, design y tasks.
- `agent-architect` revisa o enriquece `design.md`; no crea un plan paralelo fuera de OpenSpec.
- Usar aprobación ligera: el usuario revisa los artifacts de OpenSpec antes de implementar, pero se permite `/opsx:update` cuando implementación descubre nueva información.
- El design/tasks deben indicar qué superficies incluye el módulo (list, form, filters, details, delete, activate) y cuáles NO.

### Fase 3: Implementation
- Implementar **un archivo a la vez** o en grupos lógicos pequeños.
- Seguir `openspec/changes/<change-id>/tasks.md` y los skills aplicables de `.agent`.
- Desvíos de alcance o diseño → actualizar los artifacts con `/opsx:update <change-id> ...` antes de continuar.
- Delegar a subagentes especializados (data, ui) si el runtime lo permite.

### Fase 4: Verification
- Ejecutar `openspec validate` y luego los gates de `verification-harness`.
- No declarar "done" hasta que OpenSpec validation + typecheck + lint + build pasen o los errores preexistentes estén documentados.
- Al cerrar, archivar o sincronizar el cambio para que `openspec/specs/` refleje el comportamiento aceptado.

## Reglas generales del proyecto

- **Planificar antes de implementar** — siempre.
- **No bulk-convertir `docs/project-context.md`** — OpenSpec crece cambio a cambio desde requerimientos concretos.
- **No todos los módulos tienen las mismas features.** Un módulo de configuración puede no tener `list`. Un módulo de dashboard puede no tener `form`. Define explícitamente qué features incluye cada módulo en el Design.
- **Usar componentes compartidos existentes** (`@/components/`, `@/hooks/`, etc.) antes de crear nuevos.
- **Mantener la coherencia de naming** con el resto del proyecto (kebab-case para archivos, PascalCase para componentes, camelCase para hooks/functions).
- **TypeScript estricto** — sin `any` implícito, tipado explícito en props e interfaces.
- **No inventar librerías** — usar solo las que están en `package.json`.

## Stack del proyecto

| Área | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| React | React 19 |
| Lenguaje | TypeScript 5.7 |
| Estilos | Tailwind CSS 4 |
| Componentes | shadcn/ui + Radix UI |
| Iconos | Lucide React |
| Forms | react-hook-form 7 + zod 3 |
| i18n | next-intl 4 |
| Tablas | TanStack Table 8 |
| Notificaciones | Sonner |
| Mock data | In-memory store (`@/lib/mock/in-memory-store`) |

## Módulos de referencia

- `.agent/reference/widget/` — implementación completa del patrón con entidad genérica `Widget`. Léelo para entender cómo se aplican todos los patrones juntos.
- `.agent/reference/spec-example/` — ejemplo de calidad de requisitos y trazabilidad para la misma entidad `Widget`. Úsalo solo como referencia, no como destino de nuevas specs ejecutables.

## Specs del proyecto

Los specs ejecutables viven en `openspec/specs/`.

Los cambios propuestos viven en `openspec/changes/`.

El flujo de producto empieza en `docs/project-context.md` y
`docs/requirements/`.
