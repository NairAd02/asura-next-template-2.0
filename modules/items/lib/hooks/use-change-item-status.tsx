"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { changeItemStatusAction } from "../actions/item.actions";
import { ChangeItemStatusDto, ItemDetails, ItemStatus } from "../types/item.types";

interface Props {
  onSuccess?: (item: ItemDetails) => void;
}

export function useChangeItemStatus({ onSuccess }: Props = {}) {
  const t = useTranslations("items");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<ItemDetails | null>(null);

  const changeStatus = useCallback(
    async (itemId: string, status: ItemStatus, reason?: string) => {
      setIsLoading(true);
      setError(null);

      const dto: ChangeItemStatusDto = { status, reason };

      try {
        const response = await changeItemStatusAction(itemId, dto);

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
    changeStatus,
    isLoading,
    error,
    item,
    reset,
  };
}
