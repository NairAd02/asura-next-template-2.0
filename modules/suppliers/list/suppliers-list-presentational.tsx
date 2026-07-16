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

export default function SuppliersListPresentational({ suppliers }: { suppliers: Supplier[] }) {
  const t = useTranslations("supplierDetails");
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const actions = { onView: setViewId, onEdit: setEditId, onDelete: setDeleteId, onToggle: setToggleId };
  const toggleSupplier = suppliers.find((supplier) => supplier.id === toggleId);
  return <div className="pb-4">
    <div className="hidden md:block"><SuppliersListTableView suppliers={suppliers} {...actions} /></div>
    <div className="block md:hidden"><SuppliersListCardsView suppliers={suppliers} {...actions} /></div>
    <Modal open={editId !== null} onOpenChange={(open) => { if (!open) setEditId(null); }} title={t("editTitle")} description={t("editDescription")} maxWidth="2xl" bodyClassName="px-0 py-0 pb-4">{editId && <EditSupplierContainer supplierId={editId} onClose={() => setEditId(null)} />}</Modal>
    <Modal open={viewId !== null} onOpenChange={(open) => { if (!open) setViewId(null); }} title={t("title")} description={t("description")} maxWidth="xl" maxHeight="lg">{viewId && <SupplierDetailsContainer supplierId={viewId} />}</Modal>
    {deleteId && <DeleteSupplierContainer supplierId={deleteId} open onOpenChange={(open) => { if (!open) setDeleteId(null); }} />}
    {toggleSupplier && <ToggleSupplierActiveContainer supplierId={toggleSupplier.id} isActive={toggleSupplier.isActive} open onOpenChange={(open) => { if (!open) setToggleId(null); }} />}
  </div>;
}
