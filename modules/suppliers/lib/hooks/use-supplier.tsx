"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSupplierByIdAction } from "../actions/supplier.actions";
import type { SupplierDetails } from "../types/supplier.types";

export function useSupplier(supplierId: string) {
  const t = useTranslations("suppliers");
  const [supplier, setSupplier] = useState<SupplierDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupplier = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSupplierByIdAction(supplierId);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setSupplier(null);
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      setSupplier(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [supplierId, t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadSupplier(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadSupplier]);
  return { supplier, isLoading, error, reload: loadSupplier };
}
