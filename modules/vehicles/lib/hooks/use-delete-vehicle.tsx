"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteVehicleAction } from "../actions/vehicle.actions";

interface Props {
  onSuccess?: () => void;
}

export function useDeleteVehicle({ onSuccess }: Props = {}) {
  const t = useTranslations("vehicles");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicle = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteVehicleAction(id);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setError(t.has(key) ? t(key) : response.error.message);
        return false;
      }
      onSuccess?.();
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { deleteVehicle, isLoading, error, reset };
}
