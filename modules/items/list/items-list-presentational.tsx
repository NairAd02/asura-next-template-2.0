"use client";

import { useState } from "react";
import { Item } from "../lib/types/item.types";
import ItemsListTableView from "./items-list-table-view";
import ItemsListCardsView from "./items-list-cards-view";
import { Modal } from "@/components/modal/modal";
import EditItemContainer from "../form/edit/edit-item-container";
import ItemDetailsContainer from "../details/item-details-container";
import ChangeItemStatusContainer from "../status/change-item-status-container";
import { useTranslations } from "next-intl";
import { useEditItemListAction, useViewItemListAction } from "./hooks";

interface Props {
  items: Item[];
}

export default function ItemsListPresentational({ items }: Props) {
  const t = useTranslations("itemDetails");

  // ── Edit modal ──────────────────────────────────────────────────────────
  const {
    editingItemId,
    isModalOpen: isEditModalOpen,
    handleEditItem,
    handleCloseModal: handleCloseEditModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditItemListAction();

  // ── View modal ──────────────────────────────────────────────────────────
  const {
    viewingItemId,
    isModalOpen: isViewModalOpen,
    handleViewItem,
    handleModalOpenChange: handleViewModalOpenChange,
  } = useViewItemListAction();

  const [statusItemId, setStatusItemId] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleChangeStatus = (itemId: string) => {
    setStatusItemId(itemId);
    setIsStatusDialogOpen(true);
  };

  const handleStatusDialogOpenChange = (open: boolean) => {
    setIsStatusDialogOpen(open);
    if (!open) setTimeout(() => setStatusItemId(null), 300);
  };

  const statusItem = statusItemId ? items.find((i) => i.id === statusItemId) : null;

  return (
    <div className="pb-4">
      {/* ── Table (desktop) ─────────────────────────────────────────── */}
      <div className="hidden md:block">
        <ItemsListTableView
          items={items}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      {/* ── Cards (mobile) ──────────────────────────────────────────── */}
      <div className="block md:hidden">
        <ItemsListCardsView
          items={items}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      {/* ── Edit modal ──────────────────────────────────────────────── */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={handleEditModalOpenChange}
        title={t("editItem")}
        description={t("editItemDescription")}
        maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4"
      >
        {editingItemId && (
          <EditItemContainer itemId={editingItemId} onClose={handleCloseEditModal} />
        )}
      </Modal>

      {/* ── Details modal ───────────────────────────────────────────── */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={handleViewModalOpenChange}
        title={t("title")}
        description={t("detailsDescription")}
        maxWidth="xl"
        maxHeight="lg"
      >
        {viewingItemId && <ItemDetailsContainer itemId={viewingItemId} />}
      </Modal>

      {/* ── Status change dialog ────────────────────────────────────── */}
      {statusItem && (
        <ChangeItemStatusContainer
          item={statusItem}
          open={isStatusDialogOpen}
          onOpenChange={handleStatusDialogOpenChange}
        />
      )}
    </div>
  );
}
