"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { editItemCategoryAction } from "../actions/item-category.actions";
import { EditItemCategoryDto, ItemCategoryDetails, convertEditItemCategoryDto } from "../types/item-category.types";
import { EditItemCategorySchema } from "../../form/edit/schemas/edit-item-category-schema";

interface Props {
  onSuccess?: (itemCategory: ItemCategoryDetails) => void;
}

export function useEditItemCategory({ onSuccess }: Props = {}) {
  const t = useTranslations("itemCategories");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemCategory, setItemCategory] = useState<ItemCategoryDetails | null>(null);

  const editItemCategory = useCallback(async (itemCategoryId: string, editItemCategorySchema: EditItemCategorySchema) => {
    setIsLoading(true);
    setError(null);

    const { iconCode, ...rest } = editItemCategorySchema
    const formData = new FormData()
    if (iconCode)
      formData.append("iconCode", iconCode)

    // Convert schema to DTO
    const dto: EditItemCategoryDto = convertEditItemCategoryDto(rest)

    try {
      const response = await editItemCategoryAction(itemCategoryId, dto, formData);

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
    editItemCategory,
    isLoading,
    error,
    itemCategory,
    reset,
  };
}
