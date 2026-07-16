"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { changeVehicleStatusAction } from "../actions/vehicle.actions";
import type { VehicleDetails, VehicleStatus } from "../types/vehicle.types";

interface Props {
  onSuccess?: (vehicle: VehicleDetails) => void;
}

export function useChangeVehicleStatus({ onSuccess }: Props = {}) {
  const t = useTranslations("vehicles");
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeVehicleStatus = useCallback(async (id: string, status: VehicleStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await changeVehicleStatusAction(id, status);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      setVehicle(response.data);
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setVehicle(null);
  }, []);

  return { changeVehicleStatus, vehicle, isLoading, error, reset };
}
