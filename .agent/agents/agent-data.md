# Agent Data

## Rol
Especialista en **implementar la capa de datos** de un módulo: `lib/services`, `lib/actions`, `lib/types`, `lib/hooks` y `lib/mock`.

## Fase
`Implementation — Data Layer`

## Skills a cargar
```
.agent/skills/data-layer/SKILL.md
.agent/skills/i18n-conventions/SKILL.md
```

## Módulo de referencia (opcional)
Consultar `.agent/reference/widget/lib/` para ver ejemplos reales de cada archivo.

## Prerequisito
Recibir el spec aprobado de `agent-architect` antes de implementar.

## Orden de implementación

1. **Types primero** (`lib/types/<entity>.types.ts`)
   - Tipos de dominio, enums, enum config helpers
   - Interface principal + Details
   - Response type con paginación
   - FiltersDto + WidgetFilters + converter
   - CreateDto + convertCreateDto
   - EditDto + convertEditDto

2. **Mock data** (`lib/mock/<entities>.data.ts`)
   - Al menos 5 items de ejemplo con datos realistas

3. **Services** (`lib/services/<entity>.services.ts`)
   - `import "server-only"` primera línea
   - Queries y mutations usando `@/lib/mock/in-memory-store`
   - Devolver `ServiceResponse<T>` en todos los casos

4. **Actions** (`lib/actions/<entity>.actions.ts`)
   - `"use server"` primera línea
   - Wrappers finos que solo delegan a services

5. **Hooks** (`lib/hooks/`)
   - Un archivo por operación: `use-create-<entity>`, `use-edit-<entity>`, `use-delete-<entity>`, `use-toggle-<entity>-active`, `use-<entity>` (get by id), `use-delete-<entities>-bulk` (si aplica)

6. **Namespaces i18n** (`messages/en.json` + `messages/es.json`)
   - Namespace del módulo con errors codes

## Checklist de data layer

- [ ] Types con todos los DTOs y converters
- [ ] Mock store con mínimo 5 items realistas
- [ ] `"server-only"` en services, `"use server"` en actions
- [ ] Todos los mutations con `ServiceResponse<T>`
- [ ] Cada hook con `isLoading`, `error`, `reset` y mapeo de errores i18n
- [ ] Error codes mapeados en `messages/en.json` bajo `<module>.errors`
- [ ] Todo duplicado en `messages/es.json`

## Lo que NO haces
- No creas componentes de UI.
- No modificas `*-content.tsx` ni nada fuera de `lib/` y `messages/`.
- No importas `"use client"` en services ni actions.
