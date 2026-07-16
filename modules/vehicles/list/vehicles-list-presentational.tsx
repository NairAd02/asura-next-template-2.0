"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/modal/modal";
import type { Vehicle } from "../lib/types/vehicle.types";
import ChangeVehicleStatusContainer from "../status/change-vehicle-status-container";
import DeleteVehicleContainer from "../delete/delete-vehicle-container";
import VehicleDetailsContainer from "../details/vehicle-details-container";
import EditVehicleContainer from "../form/edit/edit-vehicle-container";
import VehiclesListCardsView from "./vehicles-list-cards-view";
import VehiclesListTableView from "./vehicles-list-table-view";
import {
  useDeleteVehicleListAction,
  useEditVehicleListAction,
  useViewVehicleListAction,
} from "./hooks";

export default function VehiclesListPresentational({ vehicles }: { vehicles: Vehicle[] }) {
  const t = useTranslations("vehicleDetails");
  const {
    editingItemId,
    isModalOpen: isEditModalOpen,
    handleEditItem,
    handleCloseModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditVehicleListAction();
  const {
    viewingItemId,
    isModalOpen: isViewModalOpen,
    handleViewItem,
    handleModalOpenChange: handleViewModalOpenChange,
  } = useViewVehicleListAction();
  const {
    deletingItemId,
    isDeleteDialogOpen,
    handleDeleteItem,
    handleDeleteDialogOpenChange,
  } = useDeleteVehicleListAction();
  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleChangeStatus = (id: string) => {
    setChangingStatusId(id);
    setIsStatusDialogOpen(true);
  };
  const handleStatusDialogOpenChange = (open: boolean) => {
    setIsStatusDialogOpen(open);
    if (!open) setChangingStatusId(null);
  };
  const actions = { onView: handleViewItem, onEdit: handleEditItem, onDelete: handleDeleteItem, onStatus: handleChangeStatus };
  const statusVehicle = vehicles.find((vehicle) => vehicle.id === changingStatusId);

  return (
    <div className="pb-4">
      <div className="hidden md:block">
        <VehiclesListTableView vehicles={vehicles} {...actions} />
      </div>
      <div className="block md:hidden">
        <VehiclesListCardsView vehicles={vehicles} {...actions} />
      </div>
      <Modal open={isEditModalOpen} onOpenChange={handleEditModalOpenChange} title={t("editTitle")} description={t("editDescription")} maxWidth="2xl" bodyClassName="px-0 py-0 pb-4">
        {editingItemId && <EditVehicleContainer vehicleId={editingItemId} onClose={handleCloseModal} />}
      </Modal>
      <Modal open={isViewModalOpen} onOpenChange={handleViewModalOpenChange} title={t("title")} description={t("description")} maxWidth="xl" maxHeight="lg">
        {viewingItemId && <VehicleDetailsContainer vehicleId={viewingItemId} />}
      </Modal>
      {deletingItemId && <DeleteVehicleContainer vehicleId={deletingItemId} open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange} />}
      {statusVehicle && (
        <ChangeVehicleStatusContainer
          vehicleId={statusVehicle.id}
          currentStatus={statusVehicle.status}
          open={isStatusDialogOpen}
          onOpenChange={handleStatusDialogOpenChange}
        />
      )}
    </div>
  );
}
