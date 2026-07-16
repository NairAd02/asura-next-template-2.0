"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toggleSupplierActiveAction } from "../actions/supplier.actions";
import type { SupplierDetails } from "../types/supplier.types";

interface Props { onSuccess?: (supplier: SupplierDetails) => void; }

export function useToggleSupplierActive({ onSuccess }: Props = {}) {
  const t = useTranslations("suppliers");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSupplierActive = useCallback(async (id: string, isActive: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await toggleSupplierActiveAction(id, isActive);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => { setError(null); setIsLoading(false); }, []);
  return { toggleSupplierActive, isLoading, error, reset };
}
