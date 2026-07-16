"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteSupplierAction } from "../actions/supplier.actions";

interface Props { onSuccess?: () => void; }

export function useDeleteSupplier({ onSuccess }: Props = {}) {
  const t = useTranslations("suppliers");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteSupplierAction(id);
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

  const reset = useCallback(() => { setError(null); setIsLoading(false); }, []);
  return { deleteSupplier, isLoading, error, reset };
}
