---
name: data-layer
description: Cargar cuando se implementa la capa de datos de un módulo: services, actions, types/DTOs, hooks cliente y mock data.
---

# Data Layer

## Cuándo usar
Cuando se implementan los archivos dentro de `modules/<module>/lib/`.

## Arquitectura de capas

```
[Server Component / Route Handler]
        │ llama directamente
        ▼
   actions (use server)          ← Wrapper fino, solo llama al service
        │ llama
        ▼
   services (server-only)        ← Lógica real: DB, API externa, mock
        │ devuelve
        ▼
   ServiceResponse<T>            ← { success: true, data: T } | { success: false, error: {...} }

[Client Component]
        │ usa
        ▼
   hook cliente (use client)     ← Llama action, maneja loading/error/estado, mapea errores i18n
```

## 1. Services — `lib/services/<entity>.services.ts`

```typescript
import "server-only";                          // ← SIEMPRE primera línea
import type { ServiceResponse } from "@/lib/api-responses";
import { queryCollection, createRecord, updateRecord, deleteRecord, findById } from "@/lib/mock/in-memory-store";
import { widgetsStore } from "../mock/widgets.data";
import { CreateWidgetDto, EditWidgetDto, Widget, WidgetFiltersDto, WidgetsResponse } from "../types/widget.types";

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAllWidgets(filters: WidgetFiltersDto = {}): Promise<WidgetsResponse> {
  const { rows, pagination } = queryCollection({
    data: widgetsStore as unknown as Record<string, unknown>[],
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    search: filters.search,
    searchFields: ["name", "description"] as any,
    filters: { isActive: filters.isActive },
    sortBy: filters.sortBy ?? "name",
    sortOrder: filters.sortOrder ?? "asc",
  });
  return { widgets: rows as unknown as Widget[], pagination };
}

export async function getWidgetById(id: string): Promise<ServiceResponse<Widget | null>> {
  try {
    const record = findById(widgetsStore, id);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get widget: ${error}` } };
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createWidget(dto: CreateWidgetDto): Promise<ServiceResponse<Widget>> {
  try {
    const record: Widget = {
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
      createdBy: "mock-user-id",
      createdAt: new Date().toISOString(),
      updatedBy: null,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, data: createRecord(widgetsStore, record) };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to create widget: ${error}` } };
  }
}
```

**Reglas de services:**
- `import "server-only"` SIEMPRE como primera línea.
- Manejar errores con try/catch → devolver `{ success: false, error: { code, message } }`.
- Nunca tirar excepciones: siempre devolver `ServiceResponse`.
- Separar visualmente Queries y Mutations con comentarios `// ─── Queries` / `// ─── Mutations`.

## 2. Actions — `lib/actions/<entity>.actions.ts`

```typescript
"use server";                                  // ← SIEMPRE primera línea

import { createWidget, editWidget, getAllWidgets, getWidgetById, deleteWidget } from "../services/widget.services";
import { CreateWidgetDto, EditWidgetDto, Widget, WidgetFiltersDto, WidgetsResponse } from "../types/widget.types";
import type { ServiceResponse } from "@/lib/api-responses";

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getAllWidgetsAction(options: WidgetFiltersDto = {}): Promise<WidgetsResponse> {
  return await getAllWidgets(options);
}

export async function getWidgetByIdAction(id: string): Promise<ServiceResponse<Widget | null>> {
  return await getWidgetById(id);
}

export async function createWidgetAction(dto: CreateWidgetDto): Promise<ServiceResponse<Widget>> {
  return await createWidget(dto);
}

export async function editWidgetAction(id: string, dto: EditWidgetDto): Promise<ServiceResponse<Widget>> {
  return await editWidget(id, dto);
}

export async function deleteWidgetAction(id: string): Promise<ServiceResponse<void>> {
  return await deleteWidget(id);
}
```

**Reglas de actions:**
- `"use server"` SIEMPRE primera línea.
- Son wrappers **FINOS**: no contienen lógica de negocio — solo delegan al service.
- Tipado explícito en parámetros y retorno.
- Un action por operación de service.

## 3. Types — `lib/types/<entity>.types.ts`

Estructura típica (en orden):

```typescript
// ─── Domain types / Enums ─────────────────────────────────────────────────────
export type WidgetStatus = "active" | "inactive";

// Enum config helper (label + className para UI)
export const widgetStatusConfig: Record<WidgetStatus, { label: string; className: string }> = { ... };
export const getWidgetStatusInfo = (status: WidgetStatus) => widgetStatusConfig[status] ?? { ... };

// ─── Interfaces de entidad ────────────────────────────────────────────────────
export interface Widget {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
}
export interface WidgetDetails extends Widget {}  // Extiende con relaciones si las hay

// ─── Response types ───────────────────────────────────────────────────────────
export interface WidgetsResponse {
  widgets: Widget[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Filter DTOs ──────────────────────────────────────────────────────────────
export interface WidgetFilters {                // Estado local del hook de filtros (UI)
  search: string;
  isActive: boolean | "";
  sortBy: string;
  sortOrder: "asc" | "desc";
}
export interface WidgetFiltersDto {            // Lo que se pasa a la action (cleanado)
  page?: number; limit?: number;
  search?: string; isActive?: boolean;
  sortBy?: string; sortOrder?: "asc" | "desc";
}
export const convertWidgetFiltersDto = (f: WidgetFilters): WidgetFiltersDto => ({
  search: f.search || undefined,
  isActive: f.isActive !== "" ? f.isActive : undefined,
  sortBy: f.sortBy || undefined,
  sortOrder: f.sortOrder || undefined,
});

// ─── Create / Edit DTOs ───────────────────────────────────────────────────────
export interface CreateWidgetDto { name: string; description?: string | null; isActive?: boolean; }
export const convertCreateWidgetDto = (schema: any): CreateWidgetDto => ({ ... });

export interface EditWidgetDto { name?: string; description?: string | null; isActive?: boolean; }
export const convertEditWidgetDto = (schema: any): EditWidgetDto => ({ ... });
```

## 4. Hooks cliente — `lib/hooks/use-<verb>-<entity>.tsx`

```typescript
"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createWidgetAction } from "../actions/widget.actions";
import { convertCreateWidgetDto, CreateWidgetSchema, Widget } from "../types/widget.types";

interface Props { onSuccess?: (widget: Widget) => void; }

export function useCreateWidget({ onSuccess }: Props = {}) {
  const t = useTranslations("widgets");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widget, setWidget] = useState<Widget | null>(null);

  const createWidget = useCallback(async (schema: CreateWidgetSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createWidgetAction(convertCreateWidgetDto(schema));
      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
        setError(translated);
        return;
      }
      setWidget(response.data);
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => { setError(null); setIsLoading(false); setWidget(null); }, []);
  return { createWidget, isLoading, error, widget, reset };
}
```

**Reglas de hooks cliente:**
- `"use client"` primera línea.
- Estructura: `isLoading` + `error` + resultado + `reset()`.
- Mapeo de errores: intentar traducir `errors.<code>` con `t.has()`, fallback al mensaje del server.
- `useCallback` para las funciones que se pasan como props.
- `finally` para `setIsLoading(false)` — garantiza que se resetea aunque haya error.

## 5. Mock data — `lib/mock/<entities>.data.ts`

```typescript
import { Widget } from "../types/widget.types";

export const widgetsStore: Widget[] = [
  {
    id: "widget-001",
    name: "Alpha Widget",
    description: "First example widget",
    isActive: true,
    createdBy: "mock-user-id-001",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedBy: null,
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // ... más items de ejemplo
];
```

## Checklist de data layer

- [ ] `"server-only"` en services, `"use server"` en actions
- [ ] `ServiceResponse<T>` en todas las mutations y queries que pueden fallar
- [ ] DTOs separados para Create y Edit (Edit tiene todos los campos opcionales)
- [ ] `convert*Dto` para transformar schema de Zod a DTO limpio
- [ ] Hook cliente con `isLoading`, `error`, `reset` y mapeo de errores i18n
- [ ] Mock store inicializado con al menos 2-3 items de ejemplo

## Referencia navegable

Ver implementación completa: `.agent/reference/widget/lib/`
