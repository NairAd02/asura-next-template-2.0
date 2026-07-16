"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { createVehicleSchema } from "../../lib/schemas/vehicle.schemas";
import type { CreateVehicleOutput } from "../../lib/schemas/vehicle.schemas";
import { useCreateVehicle } from "../../lib/hooks/use-create-vehicle";
import VehicleForm from "../vehicle-form";

export default function CreateVehicleFormContainer({ onClose }: { onClose?: () => void }) {
  const t = useTranslations("vehicleForm");
  const tVehicles = useTranslations("vehicles");
  const router = useRouter();
  const schema = createVehicleSchema({
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
  const form = useForm<CreateVehicleOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      plate: "",
      vin: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      type: "sedan",
      status: "available",
      assignedDriver: "",
      branch: "",
      odometer: 0,
      lastInspectionDate: "",
      nextMaintenanceDate: "",
      notes: "",
    },
  });
  const { createVehicle, isLoading, error } = useCreateVehicle({ onSuccess: () => {
    toast.success(tVehicles("notifications.created"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => createVehicle(data))}>
        <VehicleForm loading={isLoading} error={error} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
