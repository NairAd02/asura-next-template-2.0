---
name: spec-driven-development
description: Cargar siempre. Define el protocolo de fases SDD (Research → Design → Implementation → Verification) y las reglas de orquestación multi-agente de este proyecto.
---

# Spec-Driven Development (SDD)

## Cuándo usar
**Siempre.** El orquestador carga esta skill al inicio de cualquier tarea.

## Las 4 fases obligatorias

### Fase 1: Research
- Leer los archivos relevantes del proyecto antes de proponer nada.
- Identificar qué módulos/componentes compartidos existen y pueden reutilizarse.
- Consultar `.agent/skill-registry.md` para saber qué skills aplican.

### Fase 2: Design (spec/plan)
- Si la feature no tiene spec formal todavía, delegar primero a `agent-spec-writer` (skill `spec-authoring`) para producir `docs/specs/features/<feature>/spec.md` + `edge-cases.md`.
- A partir del spec aprobado, `agent-architect` genera un **plan explícito** con: estructura de carpetas propuesta, lista de archivos a crear, decisiones técnicas.
- **Esperar confirmación del usuario** en cada entregable (spec y plan) antes de escribir código.
- El plan debe indicar qué features incluye el módulo (list, form, filters, details, delete, activate) y cuáles NO.

### Fase 3: Implementation
- Implementar **un archivo a la vez** o en grupos lógicos pequeños.
- Seguir exactamente el plan aprobado. Desvíos → comunicar al usuario.
- Delegar a subagentes especializados (data, ui) si el runtime lo permite.

### Fase 4: Verification
- Ejecutar los gates de `verification-harness` al finalizar.
- No declarar "done" hasta que typecheck + lint + build pasen.

## Reglas generales del proyecto

- **Planificar antes de implementar** — siempre.
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
- `.agent/reference/spec-example/` — el spec formal que dio origen a ese código, mismo entidad `Widget`. Úsalo junto con la skill `spec-authoring` al escribir specs nuevos.

## Specs del proyecto

Los specs formales viven en `docs/specs/`. El README de esa carpeta y la skill `spec-authoring` definen las reglas de autoría; `docs/specs/features/` contiene ejemplos genéricos (`item-catalog`, `notification-preferences`, `usage-dashboard`) que muestran las 3 formas de módulo más comunes.
