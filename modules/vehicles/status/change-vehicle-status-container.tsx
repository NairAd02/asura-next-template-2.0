"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AlertComponent } from "@/components/ui/alert-component";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChangeVehicleStatus } from "../lib/hooks/use-change-vehicle-status";
import { vehicleStatusOptions } from "../lib/types/vehicle.types";
import type { VehicleStatus } from "../lib/types/vehicle.types";

interface Props {
  vehicleId: string;
  currentStatus: VehicleStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeVehicleStatusContainer({ vehicleId, currentStatus, open, onOpenChange }: Props) {
  const t = useTranslations("vehicles.statusDialog");
  const router = useRouter();
  const [status, setStatus] = useState<VehicleStatus>(currentStatus);
  const { changeVehicleStatus, isLoading, error, reset } = useChangeVehicleStatus({ onSuccess: () => {
    toast.success(t("success"), { position: "top-right" });
    onOpenChange(false);
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <Modal open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) reset(); }} title={t("title")} description={t("description")} maxWidth="sm">
      <div className="space-y-4 p-4">
        {error && <AlertComponent title={error} variant="destructive" />}
        <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus)}>
          <SelectTrigger>
            <SelectValue placeholder={t("placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {vehicleStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{t(`options.${option.value}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{t("cancel")}</Button>
          <Button onClick={async () => { await changeVehicleStatus(vehicleId, status); }} disabled={isLoading}>{isLoading ? t("saving") : t("confirm")}</Button>
        </div>
      </div>
    </Modal>
  );
}
