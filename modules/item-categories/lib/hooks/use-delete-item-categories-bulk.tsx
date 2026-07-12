"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { deleteItemCategoriesBulkAction } from "../actions/item-category.actions";

interface Props {
  onSuccess?: (result: { deleted: number; failed: string[] }) => void;
}

export function useDeleteItemCategoriesBulk({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ deleted: number; failed: string[] } | null>(null);

  const deleteItemCategoriesBulk = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteItemCategoriesBulkAction(ids);

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
    deleteItemCategoriesBulk,
    isLoading,
    error,
    result,
    reset,
  };
}
