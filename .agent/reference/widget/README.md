# Módulo de Referencia — Widget

> ⚠️ **Este módulo NO es código de producción.**  
> Es un módulo de ejemplo/entrenamiento para agentes de IA. Tiene typecheck y lint explícitos propios, aunque no forma parte del build de Next.js.  
> Su único propósito es ilustrar los patrones del proyecto con una entidad genérica (`Widget`).

## Estructura

```
widget/
├── widget-content.tsx              ← Entry point SSR (Suspense sólo para data SSR)
├── lib/
│   ├── actions/widget.actions.ts   ← "use server" wrappers
│   ├── services/widget.services.ts ← "server-only" lógica
│   ├── services/widget-api.services.ts ← consumo remoto sin alterar el mock
│   ├── api/routes/widget-api.routes.ts ← rutas relativas del upstream de ejemplo
│   ├── types/widget.types.ts       ← Tipos, DTOs, converters
│   ├── hooks/                      ← Hooks cliente
│   └── mock/widgets.data.ts        ← Datos mock
├── list/                           ← Vista de lista (container + presentational + table + cards)
├── form/                           ← Formularios create + edit con Zod
├── filters/                        ← Filtros con URL sync y carga cliente por select
├── details/                        ← Vista de detalle
├── delete/                         ← Confirmación de borrado
├── activate/                       ← Toggle activo/inactivo
└── components/                     ← Componentes específicos del módulo
```

## Cómo usarlo

Los agentes pueden leer cualquier archivo de esta carpeta como referencia de cómo implementar los patrones. Ver también las skills correspondientes en `.agent/skills/` para las reglas y convenciones.

El ejemplo de filtros incluye un selector hipotético de usuario creador. Sus
opciones se cargan mediante `lib/hooks/use-widget-users-for-select.tsx`, de modo
que el formulario de filtros se renderiza inmediatamente y sólo ese selector
muestra su estado de carga. Cada selector con datos remotos debe repetir este
patrón con su propia action y hook; no se deben agrupar todos los catálogos en
un container servidor ni bloquear la tarjeta completa con `Suspense`.

## APIs externas

`lib/api/routes/widget-api.routes.ts` muestra el catálogo de endpoints de un
upstream. Esta ubicación dentro del widget es una copia autocontenida de la
ubicación normativa de producción, que es la raíz compartida
`@/lib/api/routes/<upstream>-api.routes.ts`. El catálogo comienza con
`import "server-only"`, solo declara rutas relativas, agrupa por recurso y usa
funciones para los segmentos dinámicos. No lee `process.env`, de modo que
importarlo no evalúa configuración de servidor de forma ansiosa y el marcador
evita que termine en un bundle cliente.

`lib/services/widget-api.services.ts` muestra el otro lado del patrón: comienza
con `import "server-only"`, valida la base URL privada
`WIDGET_API_BASE_URL`, compone la URL final e importa las rutas nombradas. El
servicio mock existente permanece intacto. Para consumir una segunda API se
añade otro catálogo `<upstream>-api.routes.ts` y su service usa la base URL
correspondiente; no se mezclan endpoints de hosts distintos en un catálogo
global.

## Skills relacionadas

| Archivo | Skill |
|---|---|
| `widget-content.tsx` | `ssr-data-fetching` |
| `lib/services/` | `data-layer` |
| `lib/api/routes/` | `data-layer`, `module-architecture` |
| `lib/actions/` | `data-layer` |
| `lib/types/` | `data-layer` |
| `lib/hooks/` | `data-layer` |
| `list/` | `client-views-modals`, `ssr-data-fetching` |
| `form/` | `forms-rhf-zod` |
| `filters/` | `filters-url-state` |
