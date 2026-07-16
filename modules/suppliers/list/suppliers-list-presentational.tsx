"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/modal/modal";
import type { Supplier } from "../lib/types/supplier.types";
import SuppliersListTableView from "./suppliers-list-table-view";
import SuppliersListCardsView from "./suppliers-list-cards-view";
import EditSupplierContainer from "../form/edit/edit-supplier-container";
import SupplierDetailsContainer from "../details/supplier-details-container";
import DeleteSupplierContainer from "../delete/delete-supplier-container";
import ToggleSupplierActiveContainer from "../activate/toggle-supplier-active-container";
import {
  useDeleteSupplierListAction,
  useEditSupplierListAction,
  useViewSupplierListAction,
} from "./hooks";

export default function SuppliersListPresentational({ suppliers }: { suppliers: Supplier[] }) {
  const t = useTranslations("supplierDetails");
  const {
    editingItemId,
    isModalOpen: isEditModalOpen,
    handleEditItem,
    handleCloseModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditSupplierListAction();
  const {
    viewingItemId,
    isModalOpen: isViewModalOpen,
    handleViewItem,
    handleModalOpenChange: handleViewModalOpenChange,
  } = useViewSupplierListAction();
  const {
    deletingItemId,
    isDeleteDialogOpen,
    handleDeleteItem,
    handleDeleteDialogOpenChange,
  } = useDeleteSupplierListAction();
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  const handleToggleActive = (id: string) => {
    setTogglingActiveId(id);
    setIsToggleDialogOpen(true);
  };
  const handleToggleDialogOpenChange = (open: boolean) => {
    setIsToggleDialogOpen(open);
    if (!open) setTogglingActiveId(null);
  };
  const actions = { onView: handleViewItem, onEdit: handleEditItem, onDelete: handleDeleteItem, onToggle: handleToggleActive };
  const toggleSupplier = suppliers.find((supplier) => supplier.id === togglingActiveId);

  return <div className="pb-4">
    <div className="hidden md:block"><SuppliersListTableView suppliers={suppliers} {...actions} /></div>
    <div className="block md:hidden"><SuppliersListCardsView suppliers={suppliers} {...actions} /></div>
    <Modal open={isEditModalOpen} onOpenChange={handleEditModalOpenChange} title={t("editTitle")} description={t("editDescription")} maxWidth="2xl" bodyClassName="px-0 py-0 pb-4">{editingItemId && <EditSupplierContainer supplierId={editingItemId} onClose={handleCloseModal} />}</Modal>
    <Modal open={isViewModalOpen} onOpenChange={handleViewModalOpenChange} title={t("title")} description={t("description")} maxWidth="xl" maxHeight="lg">{viewingItemId && <SupplierDetailsContainer supplierId={viewingItemId} />}</Modal>
    {deletingItemId && <DeleteSupplierContainer supplierId={deletingItemId} open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange} />}
    {toggleSupplier && <ToggleSupplierActiveContainer supplierId={toggleSupplier.id} isActive={toggleSupplier.isActive} open={isToggleDialogOpen} onOpenChange={handleToggleDialogOpenChange} />}
  </div>;
}
