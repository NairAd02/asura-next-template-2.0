"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { editItemAction } from "../actions/item.actions";
import { EditItemDto, ItemDetails } from "../types/item.types";
import { EditItemSchema } from "../../form/edit/schemas/edit-item-schema";

interface Props {
  onSuccess?: (item: ItemDetails) => void;
}

export function useEditItem({ onSuccess }: Props = {}) {
  const t = useTranslations("items");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<ItemDetails | null>(null);

  const editItem = useCallback(
    async (itemId: string, schema: EditItemSchema) => {
      setIsLoading(true);
      setError(null);

      const { images, ...rest } = schema;
      const formData = new FormData();

      if (images && images.length > 0) {
        images.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      const dto: EditItemDto = {
        name: rest.name,
        description: rest.description || null,
        itemCategoryId: rest.itemCategoryId || null,
      };

      try {
        const response = await editItemAction(itemId, dto, formData);

        if (!response.success) {
          const code = response.error.code as string;
          const translated = t.has(`errors.${code}` as any) ? t(`errors.${code}` as any) : response.error.message;
          setError(translated);
          return;
        }

        setItem(response.data);
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
    setItem(null);
  }, []);

  return {
    editItem,
    isLoading,
    error,
    item,
    reset,
  };
}
