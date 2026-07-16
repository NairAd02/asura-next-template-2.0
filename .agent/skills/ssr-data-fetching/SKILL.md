---
name: ssr-data-fetching
description: Cargar cuando se crea el entry point SSR de un módulo (*-content.tsx), boundaries de Suspense con skeletons, o containers de servidor con el patrón container/presentational.
---

# SSR Data Fetching

## Cuándo usar
- Crear el componente `<module>-content.tsx` (entry point del módulo).
- Crear containers de servidor que hacen `await action(...)`.
- Diseñar los `<Suspense>` con skeletons.
- Aplicar el patrón container/presentational en lado servidor.

## Patrón: `*-content.tsx` (entry point SSR)

Es el **componente servidor principal** de cada módulo. Recibe los filtros como props (vienen del Server Component del `page.tsx`), organiza la UI general, y monta los `<Suspense>` boundaries.

```typescript
// modules/widgets/widgets-content.tsx
import { Suspense } from "react";
import { getTranslations } from 'next-intl/server';
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import WidgetsFiltersContainer from "./filters/widgets-filters-container";
import WidgetsListContainer from "./list/widget-list-container";
import WidgetsListLoadingSkeleton from "./list/widgets-list-loading-skeleton";
import { WidgetFiltersDto } from "./lib/types/widget.types";
import { Box } from "lucide-react";
import CreateWidgetTrigger from "./form/create/create-widget-trigger";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";

interface Props {
  filters: WidgetFiltersDto;
}

export default async function WidgetsContent({ filters }: Props) {
  const t = await getTranslations('widgets');
  const filtersKey = JSON.stringify(filters);    // ← Key para re-suspender al cambiar filtros

  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t('title')}
        icon={<Box className="h-10 w-10" />}
        actionTrigger={<CreateWidgetTrigger />}
        description={t('description')}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={2} />}>
          <WidgetsFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`widgets-list-${filtersKey}`} fallback={<WidgetsListLoadingSkeleton />}>
          <WidgetsListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
```

**Reglas del content.tsx:**
- **Siempre async** — es un Server Component.
- `getTranslations` (no `useTranslations`) para i18n en servidor.
- `<Suspense key={...}>` con `key` derivado de filtros usando `JSON.stringify(filters)`. Esto hace que al cambiar filtros, React remonte el Suspense y muestre el skeleton de nuevo → UX de loading correcto.
- `ModuleHeader` con `title`, `icon` (Lucide), `actionTrigger` (botón de crear) y `description`.
- Filters y List en Suspense separados.

## Patrón: Container de servidor

El container hace el `await` de la action y pasa datos al presentational. No contiene lógica de UI.

```typescript
// modules/widgets/list/widget-list-container.tsx
import { getAllWidgetsAction } from "../lib/actions/widget.actions";
import { WidgetFiltersDto } from "../lib/types/widget.types";
import ModulePagination from "@/components/pagination/module-pagination";
import WidgetsListPresentational from "./widgets-list-presentational";

interface Props { filters: WidgetFiltersDto; }

export default async function WidgetsListContainer({ filters }: Props) {
  const widgetsResponse = await getAllWidgetsAction(filters);
  return (
    <div>
      <WidgetsListPresentational widgets={widgetsResponse.widgets} />
      <ModulePagination
        pagination={widgetsResponse.pagination}
        limitOptions={[5, 10, 20, 30]}
      />
    </div>
  );
}
```

**Reglas del container de servidor:**
- Función `async`, sin `"use client"`.
- Solo hace `await action()` → pasa resultado al presentational.
- Nunca contiene lógica de UI, state ni event handlers.
- Incluye `ModulePagination` si el módulo tiene paginación.

## Patrón: Loading Skeleton

```typescript
// modules/widgets/list/widgets-list-loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function WidgetsListLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );
}
```

## Cómo se conecta con el page.tsx

```typescript
// app/[locale]/(protected)/widgets/page.tsx
import { getTranslations } from "next-intl/server";
import WidgetsContent from "@/modules/widgets/widgets-content";
import { WidgetFiltersDto } from "@/modules/widgets/lib/types/widget.types";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WidgetsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters: WidgetFiltersDto = {
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
    search: params.search as string | undefined,
    isActive: params.isActive === "true" ? true : params.isActive === "false" ? false : undefined,
    sortBy: params.sortBy as string | undefined,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  };
  return <WidgetsContent filters={filters} />;
}
```

## Container/Presentational en lado cliente

El mismo patrón aplica en el lado cliente cuando un container necesita cargar datos dinámicamente (ej. el edit container que obtiene el item antes de mostrar el form):

```typescript
// Client container (obtiene datos via hook)
"use client";
import { useWidget } from "../../lib/hooks/use-widget";
import EditWidgetFormContainer from "./edit-widget-form-container";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

export default function EditWidgetContainer({ widgetId, onClose }: Props) {
  const { widget, isLoading, error } = useWidget({ widgetId });
  return (
    <DetailsContainerWrapper data={widget} isLoading={isLoading} error={error} entityKey="widget">
      {(widget) => <EditWidgetFormContainer widget={widget} onClose={onClose} />}
    </DetailsContainerWrapper>
  );
}
```

## Checklist SSR

- [ ] `*-content.tsx` es `async` y usa `getTranslations` (no `useTranslations`)
- [ ] `<Suspense key={`...-${filtersKey}`}>` para re-suspender al filtrar
- [ ] Skeleton fallback creado para cada Suspense
- [ ] Container de servidor NO tiene estado ni event handlers
- [ ] `page.tsx` parsea `searchParams` y los convierte al `FiltersDto` correcto

## Referencia navegable

Ver: `.agent/reference/widget/widget-content.tsx` y `.agent/reference/widget/list/widget-list-container.tsx`
