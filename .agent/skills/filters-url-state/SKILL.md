---
name: filters-url-state
description: Cargar cuando se implementan filtros con sincronización a URL, active-filters chips o el hook de estado de filtros de un módulo.
---

# Filters — URL State

## Cuándo usar
- Crear el sistema de filtros de un módulo con lista (`list`).
- Implementar sincronización de filtros a la URL (para que los filtros persistan en el refresh y sean compartibles).
- Crear chips de filtros activos.

## Estructura de archivos de filtros

```
modules/<module>/filters/
├── <entity>-filters-container.tsx     ← Client container: orquesta hook + presentational
├── <entity>-filters-presentational.tsx ← Inputs de filtros (SearchInput, SelectInput)
├── <entity>-active-filters.tsx         ← Chips de filtros activos con botones de reset
└── hooks/
    └── use-<entity>-filters.tsx        ← Estado local + sincronización a URL
```

## 1. Hook de filtros

```typescript
// filters/hooks/use-widget-filters.tsx
"use client";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { convertWidgetFiltersDto, WidgetFiltersDto } from "../../lib/types/widget.types";
import useUrlFilters from "@/hooks/use-url-filters";
import { useSearchParams } from "next/navigation";

export interface WidgetFilters {
  search: string;
  isActive: boolean | "";    // "" = sin filtro (muestra todos)
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface Props {
  setPagination?: Dispatch<SetStateAction<WidgetFiltersDto>>;
  urlFilters?: boolean;   // default: true
}

export default function useWidgetFilters({ setPagination, urlFilters = true }: Props) {
  const { updateFiltersInUrl } = useUrlFilters({});
  const searchParams = useSearchParams();

  // Inicializar desde URL params
  const [filters, setFilters] = useState<WidgetFilters>(() => ({
    search: searchParams.get("search") || "",
    isActive: searchParams.get("isActive") === "true" ? true
             : searchParams.get("isActive") === "false" ? false : "",
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  }));

  const handleChangeFilters = useCallback(
    (updatedFilters: Partial<WidgetFilters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updatedFilters };
        if (urlFilters) {
          updateFiltersInUrl({ ...convertWidgetFiltersDto(newFilters), page: 1 }); // ← Reset a página 1
        }
        return newFilters;
      });
      if (setPagination) {
        setPagination((old) => ({ ...old, page: 1 }));
      }
    },
    [urlFilters, updateFiltersInUrl, setPagination],
  );

  const handleResetFilters = useCallback(() => {
    const defaultFilters: WidgetFilters = { search: "", isActive: "", sortBy: "name", sortOrder: "asc" };
    setFilters(defaultFilters);
    if (urlFilters) {
      updateFiltersInUrl({ search: undefined, isActive: undefined, sortBy: "name", sortOrder: "asc", page: 1 });
    }
    if (setPagination) setPagination((old) => ({ ...old, page: 1 }));
  }, [urlFilters, updateFiltersInUrl, setPagination]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.isActive !== "") count++;
    // Añadir un count por cada filtro adicional que no sea el default
    return count;
  }, [filters.search, filters.isActive]);

  return { filters, handleChangeFilters, handleResetFilters, getActiveFiltersCount };
}
```

**Reglas del hook de filtros:**
- Inicializar el estado desde `useSearchParams()` para que los filtros persistan en refresh.
- Al cambiar filtros: siempre resetear `page: 1` (evitar estar en página 3 de una búsqueda nueva).
- `getActiveFiltersCount` con `useMemo` — cuenta solo los filtros que no son el valor por defecto.
- `isActive: boolean | ""` — `""` significa "sin filtro" (no filtrar por estado activo/inactivo). No usar `undefined` porque rompe el setState tipo.

## 2. Filters Container

```typescript
// filters/widget-filters-container.tsx
"use client";
import useWidgetFilters from "./hooks/use-widget-filters";
import WidgetFiltersPresentational from "./widget-filters-presentational";
import WidgetActiveFilters from "./widget-active-filters";
import FilterCard from "@/components/filters/filter-card/filter-card";

export default function WidgetFiltersContainer() {
  const { filters, handleChangeFilters, getActiveFiltersCount, handleResetFilters } = useWidgetFilters({});
  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={activeFiltersCount > 0 ? (
        <WidgetActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          handleChangeFilters={handleChangeFilters}
          handleResetFilters={handleResetFilters}
        />
      ) : undefined}
    >
      <WidgetFiltersPresentational filters={filters} handleChangeFilters={handleChangeFilters} />
    </FilterCard>
  );
}
```

## 3. Filters Presentational

Cuando un select obtiene opciones remotas, el presentational llama un hook
cliente dedicado a ese catálogo. Cada select conserva su propio `options`,
`loading` y `error`; no recibe un objeto agregado de catálogos cargado por un
container servidor.

```typescript
const {
  users,
  isLoading: usersLoading,
  error: usersError,
} = useWidgetUsersForSelect();

<SelectInput
  placeholder={t("user")}
  value={filters.createdBy}
  onValueChange={(createdBy) => handleChangeFilters({ createdBy })}
  options={users.map((user) => ({ label: user.label, value: user.id }))}
  loading={usersLoading}
  emptyText={usersError ?? undefined}
/>
```

El hook vive en `modules/<module>/lib/hooks/`, llama a una action fina y carga
al montar el componente. Si existen varios selects remotos independientes,
cada uno usa su propia action/hook para que sus estados de carga no se
acoplen.

```typescript
// filters/widget-filters-presentational.tsx
"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import SelectInput from "@/components/inputs/select-input/select-input";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslations } from "next-intl";
import { WidgetFilters } from "./hooks/use-widget-filters";

interface Props {
  filters: WidgetFilters;
  handleChangeFilters: (newFilters: Partial<WidgetFilters>) => void;
}

export default function WidgetFiltersPresentational({ filters, handleChangeFilters }: Props) {
  const t = useTranslations('filters');

  const isActiveOptions = [
    { label: t('active'), value: "true" },
    { label: t('inactive'), value: "false" },
  ];

  const sortByOptions = [
    { label: t('sortByName'), value: "name" },
    { label: t('sortByCreated'), value: "createdAt" },
  ];

  return (
    <div className="grid gap-2 2xl:gap-3 items-center grid-cols-1 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_auto]">
      <div className="sm:col-span-2 2xl:col-span-1">
        <SearchInput
          id="widgets-search"
          placeHolder={t('searchByNameDescription')}
          value={filters.search}
          onChange={(e) => handleChangeFilters({ search: e.target.value })}
        />
      </div>
      <div>
        <SelectInput
          placeholder={t('status')}
          value={filters.isActive === "" ? "" : filters.isActive.toString()}
          onValueChange={(value) =>
            handleChangeFilters({ isActive: value === "true" ? true : value === "false" ? false : "" })
          }
          options={isActiveOptions}
          clearable={{ handleClear: () => handleChangeFilters({ isActive: "" }) }}
        />
      </div>
      <div className="flex items-center gap-2">
        <SelectInput
          placeholder={t('sortBy')} label={t('sortBy')} labelVariant="inside"
          value={filters.sortBy}
          onValueChange={(value) => handleChangeFilters({ sortBy: value })}
          options={sortByOptions}
          fullWidth={false}
        />
        <Button size="icon" variant="outline"
          onClick={() => handleChangeFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
          aria-label={filters.sortOrder === "asc" ? t('sortDescending') : t('sortAscending')}
        >
          {filters.sortOrder === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
```

**Reglas del presentational de filtros:**
- Layout: `grid` responsivo con `grid-cols-1 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_auto]`.
- El search ocupa 2 columnas en sm: `sm:col-span-2 2xl:col-span-1`.
- `isActive` se convierte a string para el `SelectInput` (`"true"`/`"false"`/`""`), y se reconvierte a boolean en `onValueChange`.
- Toggle de `sortOrder` como `Button size="icon"` con icono de lucide.

## 4. Active Filters

```typescript
// filters/widget-active-filters.tsx
"use client";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { WidgetFilters } from "./hooks/use-widget-filters";

interface Props {
  filters: WidgetFilters;
  activeFiltersCount: number;
  handleChangeFilters: (newFilters: Partial<WidgetFilters>) => void;
  handleResetFilters: () => void;
}

export default function WidgetActiveFilters({ filters, activeFiltersCount, handleChangeFilters, handleResetFilters }: Props) {
  const t = useTranslations('filters');
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">{t('activeFilters', { count: activeFiltersCount })}:</span>
      {filters.search && (
        <Badge variant="secondary" className="gap-1">
          {t('search')}: {filters.search}
          <button onClick={() => handleChangeFilters({ search: "" })}><X className="h-3 w-3" /></button>
        </Badge>
      )}
      {filters.isActive !== "" && (
        <Badge variant="secondary" className="gap-1">
          {filters.isActive ? t('active') : t('inactive')}
          <button onClick={() => handleChangeFilters({ isActive: "" })}><X className="h-3 w-3" /></button>
        </Badge>
      )}
      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleResetFilters}>
        {t('clearAll')}
      </Button>
    </div>
  );
}
```

## Cómo los filtros llegan al server component

1. Filters cambian → `updateFiltersInUrl` → `searchParams` de la URL cambian.
2. Next.js re-renderiza el Server Component de la page (`page.tsx`) con los nuevos `searchParams`.
3. `page.tsx` convierte `searchParams` → `FiltersDto` → pasa a `*-content.tsx`.
4. `*-content.tsx` crea nueva `key` para el Suspense → re-monta y muestra skeleton → fetcha datos filtrados.

## Checklist de filtros

- [ ] Hook inicializa desde `useSearchParams()` (persistencia en refresh)
- [ ] Al cambiar filtros se resetea `page: 1`
- [ ] `isActive` es `boolean | ""` en estado local, `boolean | undefined` en el DTO
- [ ] `getActiveFiltersCount` con `useMemo`
- [ ] Active filters con chip por filtro individual + botón "clear all"
- [ ] Cada select remoto usa su propio hook y estado de carga
- [ ] Los catálogos remotos no bloquean el render completo de filtros
- [ ] Layout responsivo del presentational: `grid-cols-1 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_auto]`

## Referencia navegable

Ver: `.agent/reference/widget/filters/`
