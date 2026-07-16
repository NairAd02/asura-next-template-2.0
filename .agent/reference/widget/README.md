# Módulo de Referencia — Widget

> ⚠️ **Este módulo NO es código de producción.**  
> Es un módulo de ejemplo/entrenamiento para agentes de IA. Tiene typecheck y lint explícitos propios, aunque no forma parte del build de Next.js.  
> Su único propósito es ilustrar los patrones del proyecto con una entidad genérica (`Widget`).

## Estructura

```
widget/
├── widget-content.tsx              ← Entry point SSR (patrón SSR + Suspense)
├── lib/
│   ├── actions/widget.actions.ts   ← "use server" wrappers
│   ├── services/widget.services.ts ← "server-only" lógica
│   ├── types/widget.types.ts       ← Tipos, DTOs, converters
│   ├── hooks/                      ← Hooks cliente
│   └── mock/widgets.data.ts        ← Datos mock
├── list/                           ← Vista de lista (container + presentational + table + cards)
├── form/                           ← Formularios create + edit con Zod
├── filters/                        ← Filtros con URL sync
├── details/                        ← Vista de detalle
├── delete/                         ← Confirmación de borrado
├── activate/                       ← Toggle activo/inactivo
└── components/                     ← Componentes específicos del módulo
```

## Cómo usarlo

Los agentes pueden leer cualquier archivo de esta carpeta como referencia de cómo implementar los patrones. Ver también las skills correspondientes en `.agent/skills/` para las reglas y convenciones.

## Skills relacionadas

| Archivo | Skill |
|---|---|
| `widget-content.tsx` | `ssr-data-fetching` |
| `lib/services/` | `data-layer` |
| `lib/actions/` | `data-layer` |
| `lib/types/` | `data-layer` |
| `lib/hooks/` | `data-layer` |
| `list/` | `client-views-modals`, `ssr-data-fetching` |
| `form/` | `forms-rhf-zod` |
| `filters/` | `filters-url-state` |
