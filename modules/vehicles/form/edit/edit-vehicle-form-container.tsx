"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { editVehicleSchema } from "../../lib/schemas/vehicle.schemas";
import type { EditVehicleOutput } from "../../lib/schemas/vehicle.schemas";
import type { VehicleDetails } from "../../lib/types/vehicle.types";
import { useEditVehicle } from "../../lib/hooks/use-edit-vehicle";
import VehicleForm from "../vehicle-form";

export default function EditVehicleFormContainer({ vehicle, onClose }: { vehicle: VehicleDetails; onClose?: () => void }) {
  const t = useTranslations("vehicleForm");
  const tVehicles = useTranslations("vehicles");
  const router = useRouter();
  const schema = editVehicleSchema({
    plateRequired: t("validation.plateRequired"),
    plateInvalid: t("validation.plateInvalid"),
    plateMax: t("validation.plateMax"),
    vinRequired: t("validation.vinRequired"),
    vinMin: t("validation.vinMin"),
    vinMax: t("validation.vinMax"),
    makeRequired: t("validation.makeRequired"),
    makeMax: t("validation.makeMax"),
    modelRequired: t("validation.modelRequired"),
    modelMax: t("validation.modelMax"),
    yearRequired: t("validation.yearRequired"),
    yearInvalid: t("validation.yearInvalid"),
    yearRange: t("validation.yearRange"),
    typeInvalid: t("validation.typeInvalid"),
    statusInvalid: t("validation.statusInvalid"),
    branchRequired: t("validation.branchRequired"),
    branchMax: t("validation.branchMax"),
    assignedDriverMax: t("validation.assignedDriverMax"),
    odometerInvalid: t("validation.odometerInvalid"),
    lastInspectionDateInvalid: t("validation.lastInspectionDateInvalid"),
    nextMaintenanceDateInvalid: t("validation.nextMaintenanceDateInvalid"),
    notesMax: t("validation.notesMax"),
  });
  const form = useForm<EditVehicleOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      plate: vehicle.plate,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      assignedDriver: vehicle.assignedDriver ?? "",
      branch: vehicle.branch,
      odometer: vehicle.odometer,
      lastInspectionDate: vehicle.lastInspectionDate ?? "",
      nextMaintenanceDate: vehicle.nextMaintenanceDate ?? "",
      notes: vehicle.notes ?? "",
    },
  });
  const { editVehicle, isLoading, error } = useEditVehicle({ onSuccess: () => {
    toast.success(tVehicles("notifications.updated"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => editVehicle(vehicle.id, data))}>
        <VehicleForm loading={isLoading} error={error} onCancel={onClose} isEditMode />
      </form>
    </FormProvider>
  );
}
