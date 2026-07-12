"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toggleItemCategoryActiveAction } from "../actions/item-category.actions";
import { ItemCategoryDetails } from "../types/item-category.types";

interface Props {
  onSuccess?: (itemCategory: ItemCategoryDetails) => void;
}

export function useToggleItemCategoryActive({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActive = useCallback(
    async (itemCategoryId: string, isActive: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await toggleItemCategoryActiveAction(itemCategoryId, isActive);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
          return;
        }

        onSuccess?.(response.data);
        return response.data;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, t],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    toggleActive,
    isLoading,
    error,
    reset,
  };
}
