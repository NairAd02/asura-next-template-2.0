---
name: client-views-modals
description: Cargar cuando se crea el componente presentational de lista, las vistas de tabla y cards responsive, modales estándar o los hooks de acciones de lista (edit/view/delete/bulk).
---

# Client Views & Modals

## Cuándo usar
- Crear el componente `*-list-presentational.tsx`.
- Crear vistas de tabla (`*-list-table-view.tsx`) y cards para mobile (`*-list-cards-view.tsx`).
- Montar modales de edición, detalle o eliminar desde la lista.
- Crear o reutilizar hooks de acción de lista.

## Patrón: Presentational de lista

El presentational es `"use client"`. Recibe los datos como props (ya fetched por el container de servidor), gestiona el estado de modales/dialogs localmente y renderiza la vista responsiva.

```typescript
// modules/widgets/list/widgets-list-presentational.tsx
"use client";
import { useState } from "react";
import { Widget } from "../lib/types/widget.types";
import WidgetsListTableView from "./widgets-list-table-view";
import WidgetsListCardsView from "./widgets-list-cards-view";
import { Modal } from "@/components/modal/modal";
import EditWidgetContainer from "../form/edit/edit-widget-container";
import WidgetDetailsContainer from "../details/widget-details-container";
import DeleteWidgetContainer from "../delete/delete-widget-container";
import ToggleWidgetActiveContainer from "../activate/toggle-widget-active-container";
import { useTranslations } from "next-intl";
import {
  useEditWidgetListAction,
  useViewWidgetListAction,
  useDeleteWidgetListAction,
  useBulkDeleteWidgetListAction,
} from "./hooks";

interface Props { widgets: Widget[]; }

export default function WidgetsListPresentational({ widgets }: Props) {
  const t = useTranslations('widgetDetails');

  const { editingItemId, isModalOpen: isEditModalOpen, handleEditItem, handleCloseModal, handleModalOpenChange: handleEditModalOpenChange } = useEditWidgetListAction();
  const { viewingItemId, isModalOpen, handleViewItem, handleModalOpenChange } = useViewWidgetListAction();
  const { deletingItemId, isDeleteDialogOpen, handleDeleteItem, handleDeleteDialogOpenChange } = useDeleteWidgetListAction();

  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  const handleToggleActive = (id: string) => { setTogglingActiveId(id); setIsToggleDialogOpen(true); };
  const handleToggleDialogOpenChange = (open: boolean) => { setIsToggleDialogOpen(open); if (!open) setTogglingActiveId(null); };

  const { isDeletingWidgets, handleBulkDelete } = useBulkDeleteWidgetListAction();

  return (
    <div className="pb-4">
      {/* Vista responsiva: tabla en md+, cards en mobile */}
      <div className="hidden md:block">
        <WidgetsListTableView
          widgets={widgets}
          onViewWidget={handleViewItem}
          onEditWidget={handleEditItem}
          onToggleActive={handleToggleActive}
          onDeleteWidget={handleDeleteItem}
          onBulkDelete={handleBulkDelete}
          isDeletingWidgets={isDeletingWidgets}
        />
      </div>
      <div className="block md:hidden">
        <WidgetsListCardsView
          widgets={widgets}
          onViewWidget={handleViewItem}
          onEditWidget={handleEditItem}
          onToggleActive={handleToggleActive}
          onDeleteWidget={handleDeleteItem}
        />
      </div>

      {/* Modal de edición */}
      <Modal open={isEditModalOpen} onOpenChange={handleEditModalOpenChange}
        title={t('editWidget')} description={t('editWidgetDescription')} maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4">
        {editingItemId && <EditWidgetContainer widgetId={editingItemId} onClose={handleCloseModal} />}
      </Modal>

      {/* Modal de detalle */}
      <Modal open={isModalOpen} onOpenChange={handleModalOpenChange}
        title={t('title')} description={t('detailsDescription')} maxWidth="xl" maxHeight="lg">
        {viewingItemId && <WidgetDetailsContainer widgetId={viewingItemId} />}
      </Modal>

      {/* Dialog de borrado */}
      {deletingItemId && (
        <DeleteWidgetContainer widgetId={deletingItemId} open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogOpenChange} />
      )}

      {/* Dialog de toggle activo */}
      {togglingActiveId && (
        <ToggleWidgetActiveContainer widgetId={togglingActiveId}
          isActive={widgets.find(w => w.id === togglingActiveId)?.isActive ?? true}
          open={isToggleDialogOpen} onOpenChange={handleToggleDialogOpenChange} />
      )}
    </div>
  );
}
```

## Hooks de acción de lista

Los hooks genéricos de `@/modules/hooks/` se **reexportan con alias específicos del módulo** en `list/hooks/index.ts`. Esto da semántica sin duplicar código.

```typescript
// modules/widgets/list/hooks/index.ts
export { useEditItemListAction as useEditWidgetListAction } from "@/modules/hooks/use-edit-item-list-action";
export { useViewItemListAction as useViewWidgetListAction } from "@/modules/hooks/use-view-item-list-action";
export { useDeleteItemListAction as useDeleteWidgetListAction } from "@/modules/hooks/use-delete-item-list-action";
export { useBulkDeleteWidgetListAction } from "./use-bulk-delete-widget-list-action";
```

Los hooks bulk específicos del módulo se crean en `list/hooks/use-bulk-delete-<entity>-list-action.ts` porque necesitan llamar la action específica de la entidad.

## Patrón: Modal estándar

Siempre usar `@/components/modal/modal.tsx`. Props clave:

```typescript
<Modal
  open={boolean}
  onOpenChange={(open) => void}
  title={string}
  description={string}
  maxWidth="sm" | "md" | "lg" | "xl" | "2xl"  // default "lg"
  maxHeight="sm" | "md" | "lg"                  // opcional
  bodyClassName={string}                          // opcional, para override de padding
>
  {/* Contenido del modal */}
</Modal>
```

**Reglas de modales:**
- Montar el contenido del modal **condicionalmente** (`{id && <Container id={id} />}`) para que se desmonte al cerrar y evitar estados stale.
- Los dialogs de confirmación (delete, toggle) se pasan directamente como componentes que internamente usan `AlertDialog` de Radix/shadcn.
- Estado del modal (open + id seleccionado) gestionado por el hook de lista o `useState` local.

## Patrón: Vista tabla responsiva

```typescript
// Estructura básica de table-view
"use client";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
// ... imports

export default function WidgetsListTableView({ widgets, onViewWidget, onEditWidget, ... }: Props) {
  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<Widget>[] = [
    // columna de selección bulk con Checkbox
    // columnas de datos
    // columna de acciones con DropdownMenu
  ];
  const table = useReactTable({ data: widgets, columns, getCoreRowModel: getCoreRowModel(), ... });
  // renderizado con <Table>, <TableHeader>, <TableBody>
}
```

## Patrón: Vista cards (mobile)

```typescript
// Estructura básica de cards-view — solo datos esenciales + acciones
"use client";
export default function WidgetsListCardsView({ widgets, onViewWidget, onEditWidget, ... }: Props) {
  return (
    <div className="space-y-3">
      {widgets.map((widget) => (
        <div key={widget.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
          {/* Datos esenciales */}
          {/* DropdownMenu con acciones */}
        </div>
      ))}
    </div>
  );
}
```

## Responsividad estándar

```tsx
{/* Solo en md+ */}
<div className="hidden md:block">
  <WidgetsListTableView ... />
</div>

{/* Solo en mobile */}
<div className="block md:hidden">
  <WidgetsListCardsView ... />
</div>
```

## Checklist de vistas/modales

- [ ] Presentational tiene `"use client"` y recibe datos por props (sin fetch)
- [ ] Vista tabla (`md:block`) + cards (`md:hidden`) — siempre ambas
- [ ] Modales montados condicionalmente (evitar estados stale)
- [ ] Hooks de lista reexportados con alias en `list/hooks/index.ts`
- [ ] Bulk actions con hook específico (`use-bulk-delete-<entity>-list-action.ts`)
- [ ] Estado de modales en el presentational (no en el container)

## Referencia navegable

Ver: `.agent/reference/widget/list/`
