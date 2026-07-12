---
name: i18n-conventions
description: Cargar cuando se crea texto visible (labels, títulos, mensajes de error) o se modifican los archivos messages/en.json y messages/es.json.
---

# i18n Conventions — next-intl

## Cuándo usar
Siempre que se cree cualquier texto visible al usuario (títulos, labels de formulario, mensajes de error, placeholders, tooltips).

## Tecnología
`next-intl 4` con mensajes en `messages/en.json` y `messages/es.json`.

## Estructura de namespaces

Cada módulo tiene su propio namespace (clave raíz) en el JSON. Los namespaces están en **camelCase**.

```json
// messages/en.json (estructura parcial)
{
  "metadata": { "title": "..." },
  "app": { "name": "...", "subtitle": "..." },
  "filters": { ... },          // ← Namespace compartido para filtros
  "widgets": {                  // ← Namespace del módulo
    "title": "Widgets",
    "description": "Manage your widgets",
    "create": "New Widget",
    "createTitle": "Create Widget",
    "createDescription": "Fill in the details to create a new widget.",
    "errors": {                  // ← Errores del módulo (mapeados desde ServiceResponse error codes)
      "NOT_FOUND": "Widget not found",
      "ALREADY_EXISTS": "A widget with that name already exists",
      "INTERNAL_ERROR": "An unexpected error occurred"
    }
  },
  "widgetDetails": {             // ← Namespace de detalles/acciones sobre un widget
    "title": "Widget Details",
    "detailsDescription": "View the details of this widget.",
    "editWidget": "Edit Widget",
    "editWidgetDescription": "Update the information of this widget.",
    "deleteWidget": "Delete Widget",
    "confirmDelete": "Are you sure you want to delete this widget? This action cannot be undone."
  },
  "widgetForm": {                // ← Namespace de labels del formulario
    "basicInfo": "Basic Information",
    "name": "Name",
    "namePlaceholder": "Enter widget name",
    "description": "Description",
    "descriptionPlaceholder": "Describe the widget...",
    "isActive": "Active",
    "isActiveDescription": "Whether this widget is currently active",
    "createWidget": "Create Widget",
    "editWidget": "Update Widget",
    "creating": "Creating...",
    "editing": "Updating...",
    "cancel": "Cancel"
  }
}
```

## Convención de namespaces por módulo

| Namespace | Contenido |
|---|---|
| `<module>` | Título del módulo, descripción, acción de crear, errores de la entidad |
| `<entity>Details` | Títulos de modales de detalle/edición/borrado, labels de campos readonly |
| `<entity>Form` | Labels de todos los campos del formulario, textos de botones submit/cancel |
| `filters` | Compartido: "active", "inactive", "sortBy", "search", "clearAll", etc. |

## Cómo usar en Server Components

```typescript
// En un Server Component (async)
import { getTranslations } from 'next-intl/server';

export default async function WidgetsContent() {
  const t = await getTranslations('widgets');    // ← getTranslations (async)
  return <h1>{t('title')}</h1>;
}
```

## Cómo usar en Client Components

```typescript
// En un Client Component
import { useTranslations } from 'next-intl';

export default function WidgetForm() {
  const t = useTranslations('widgetForm');       // ← useTranslations (sync, hook)
  return <label>{t('name')}</label>;
}
```

## Reglas

1. **Nunca hardcodear texto visible** — siempre usar `t('key')`.
2. **Siempre actualizar AMBOS archivos**: `messages/en.json` Y `messages/es.json`.
3. **Namespace por módulo** — no mezclar keys de distintos módulos en el mismo namespace.
4. **Errores del server**: los `error.code` de `ServiceResponse` se mapean con `t.has(`errors.${code}`)` en el hook cliente. Añadir los codes como keys bajo `<module>.errors`.
5. **Orden en el JSON**: mantener los namespaces en orden alfabético dentro del objeto raíz.
6. **Pluralización**: usar `t('key', { count: n })` con `{count, plural, one {# item} other {# items}}` si hay plurales.

## Ejemplo de error mapping en hook

```typescript
const code = response.error.code as string;
const translated = t.has(`errors.${code}` as any)
  ? t(`errors.${code}` as any)
  : response.error.message;   // Fallback: mensaje raw del servidor
setError(translated);
```

## Checklist i18n

- [ ] Namespace creado en `messages/en.json` (título, descripción, create, errores)
- [ ] Namespace de form en `messages/en.json` (todos los labels del form)
- [ ] Namespace de details en `messages/en.json` (modales de detalle/edit/delete)
- [ ] Todo duplicado en `messages/es.json` con traducción al español
- [ ] Error codes del service añadidos bajo `<module>.errors`
- [ ] Server components usan `getTranslations`, client components usan `useTranslations`
