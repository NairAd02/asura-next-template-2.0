"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createItemCategoryAction } from "../actions/item-category.actions";
import { convertCreateItemCategoryDto, ItemCategoryDetails } from "../types/item-category.types";
import { CreateItemCategorySchema } from "../../form/create/schemas/create-item-category-schema";

interface Props {
  onSuccess?: (itemCategory: ItemCategoryDetails) => void;
}

export function useCreateItemCategory({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemCategory, setItemCategory] = useState<ItemCategoryDetails | null>(null);

  const createItemCategory = useCallback(async (createItemCategorySchema: CreateItemCategorySchema) => {
    setIsLoading(true);
    setError(null);

    const { iconCode, ...rest } = createItemCategorySchema
    const formData = new FormData()
    if (iconCode)
      formData.append("iconCode", iconCode)

    try {
      const response = await createItemCategoryAction(convertCreateItemCategoryDto(rest), formData);

      if (!response.success) {
        const code = response.error.code as string;
        const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
        setError(translated);
        return;
      }

      setItemCategory(response.data);
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setItemCategory(null);
  }, []);

  return {
    createItemCategory,
    isLoading,
    error,
    itemCategory,
    reset,
  };
}
