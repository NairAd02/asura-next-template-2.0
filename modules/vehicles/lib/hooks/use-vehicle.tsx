"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getVehicleByIdAction } from "../actions/vehicle.actions";
import type { VehicleDetails } from "../types/vehicle.types";

export function useVehicle(vehicleId: string) {
  const t = useTranslations("vehicles");
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getVehicleByIdAction(vehicleId);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setVehicle(null);
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      setVehicle(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId, t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadVehicle(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadVehicle]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setVehicle(null);
  }, []);

  return { vehicle, isLoading, error, reload: loadVehicle, reset };
}
