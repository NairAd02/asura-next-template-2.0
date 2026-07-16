"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { createVehicleAction } from "../actions/vehicle.actions";
import type { CreateVehicleInput } from "../schemas/vehicle.schemas";
import type { VehicleDetails } from "../types/vehicle.types";

interface Props {
  onSuccess?: (vehicle: VehicleDetails) => void;
}

export function useCreateVehicle({ onSuccess }: Props = {}) {
  const t = useTranslations("vehicles");
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVehicle = useCallback(async (input: CreateVehicleInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createVehicleAction(input);
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

  return { createVehicle, vehicle, isLoading, error, reset };
}
