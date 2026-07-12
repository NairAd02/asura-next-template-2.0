"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { deleteItemCategoryAction } from "../actions/item-category.actions";

interface Props {
  onSuccess?: (id: string) => void;
}

export function useDeleteItemCategory({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const deleteItemCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteItemCategoryAction(id);

      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
        setError(translated);
        return;
      }

      setDeletedId(id);
      onSuccess?.(id);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setDeletedId(null);
  }, []);

  return {
    deleteItemCategory,
    isLoading,
    error,
    deletedId,
    reset,
  };
}
