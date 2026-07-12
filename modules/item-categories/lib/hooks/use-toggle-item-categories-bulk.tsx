"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toggleItemCategoriesBulkAction } from "../actions/item-category.actions";

interface Props {
  onSuccess?: (result: { updated: number; failed: string[] }) => void;
}

export function useToggleItemCategoriesBulk({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ updated: number; failed: string[] } | null>(null);

  const toggleItemCategoriesBulk = useCallback(async (ids: string[], isActive: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await toggleItemCategoriesBulkAction(ids, isActive);

      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
        setError(translated);
        return;
      }

      setResult(response.data);
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setResult(null);
  }, []);

  return {
    toggleItemCategoriesBulk,
    isLoading,
    error,
    result,
    reset,
  };
}
