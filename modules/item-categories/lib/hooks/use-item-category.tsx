"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getItemCategoryByIdAction } from "../actions/item-category.actions";
import { ItemCategoryDetails } from "../types/item-category.types";

interface Props {
  itemCategoryId: string;
  onSuccess?: (itemCategory: ItemCategoryDetails) => void;
}

export function useItemCategory({ itemCategoryId, onSuccess }: Props) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemCategory, setItemCategory] = useState<ItemCategoryDetails | null>(null);

  const getItemCategory = useCallback(async () => {
    if (!itemCategoryId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getItemCategoryByIdAction(itemCategoryId);

      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
        setError(translated);
        return;
      }

      if (response.data) {
        setItemCategory(response.data);
        onSuccess?.(response.data);
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  }, [itemCategoryId, onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setItemCategory(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void getItemCategory();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [getItemCategory]);

  return {
    getItemCategory,
    isLoading,
    error,
    itemCategory,
    reset,
  };
}
