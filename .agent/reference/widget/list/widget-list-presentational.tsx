"use client";

import { useState } from "react";
import { Widget } from "../lib/types/widget.types";
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

interface Props {
  widgets: Widget[];
}

export default function WidgetListPresentational({ widgets }: Props) {
  const t = useTranslations("widgetDetails");

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
      {/* Vista tabla — desktop (md+) */}
      <div className="hidden md:block">
        <div className="text-sm text-muted-foreground p-4">
          {/* ← Aquí va WidgetListTableView con TanStack Table */}
          WidgetListTableView — {widgets.length} items (ver reference/widget/list/widget-list-table-view.tsx)
        </div>
      </div>

      {/* Vista cards — mobile */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {widgets.map((widget) => (
            <div key={widget.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{widget.name}</p>
                <p className="text-xs text-muted-foreground">{widget.type}</p>
              </div>
              <button onClick={() => handleViewItem(widget.id)} className="text-xs text-blue-600">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      <Modal open={isEditModalOpen} onOpenChange={handleEditModalOpenChange}
        title={t("editWidget")} description={t("editWidgetDescription")} maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4">
        {editingItemId && <EditWidgetContainer widgetId={editingItemId} onClose={handleCloseModal} />}
      </Modal>

      {/* Modal de detalle */}
      <Modal open={isModalOpen} onOpenChange={handleModalOpenChange}
        title={t("title")} description={t("detailsDescription")} maxWidth="xl" maxHeight="lg">
        {viewingItemId && <WidgetDetailsContainer widgetId={viewingItemId} />}
      </Modal>

      {/* Dialog de borrado */}
      {deletingItemId && (
        <DeleteWidgetContainer widgetId={deletingItemId} open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogOpenChange} />
      )}

      {/* Dialog de toggle activo */}
      {togglingActiveId && (
        <ToggleWidgetActiveContainer
          widgetId={togglingActiveId}
          isActive={widgets.find((w) => w.id === togglingActiveId)?.isActive ?? true}
          open={isToggleDialogOpen}
          onOpenChange={handleToggleDialogOpenChange}
        />
      )}
    </div>
  );
}
