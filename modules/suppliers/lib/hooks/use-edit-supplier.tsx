"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { editSupplierAction } from "../actions/supplier.actions";
import type { EditSupplierInput } from "../schemas/supplier.schemas";
import type { SupplierDetails } from "../types/supplier.types";

interface Props { onSuccess?: (supplier: SupplierDetails) => void; }

export function useEditSupplier({ onSuccess }: Props = {}) {
  const t = useTranslations("suppliers");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editSupplier = useCallback(async (id: string, input: EditSupplierInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await editSupplierAction(id, input);
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
  return { editSupplier, isLoading, error, reset };
}
