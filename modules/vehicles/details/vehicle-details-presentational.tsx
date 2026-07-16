"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly, formatDateTime } from "@/lib/utils/dates";
import { getVehicleStatusInfo } from "../lib/types/vehicle.types";
import type { VehicleDetails } from "../lib/types/vehicle.types";

export default function VehicleDetailsPresentational({ vehicle }: { vehicle: VehicleDetails }) {
  const t = useTranslations("vehicleDetails");
  const statusInfo = getVehicleStatusInfo(vehicle.status);
  const fields = [
    [t("vin"), vehicle.vin],
    [t("makeModel"), `${vehicle.make} ${vehicle.model}`],
    [t("year"), String(vehicle.year)],
    [t("typeLabel"), t(`typeOptions.${vehicle.type}`)],
    [t("branch"), vehicle.branch],
    [t("assignedDriver"), vehicle.assignedDriver ?? t("notProvided")],
    [t("odometer"), t("odometerValue", { value: vehicle.odometer })],
    [t("lastInspectionDate"), formatDateOnly(vehicle.lastInspectionDate)],
    [t("nextMaintenanceDate"), formatDateOnly(vehicle.nextMaintenanceDate)],
    [t("createdAt"), formatDateTime(vehicle.createdAt)],
    [t("updatedAt"), formatDateTime(vehicle.updatedAt)],
    [t("notes"), vehicle.notes ?? t("notProvided")],
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{vehicle.plate}</h3>
          <p className="truncate text-sm text-muted-foreground">{vehicle.make} {vehicle.model}</p>
        </div>
        <Badge className={statusInfo.className}>{t(`status.${vehicle.status}`)}</Badge>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-md border p-3">
            <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
