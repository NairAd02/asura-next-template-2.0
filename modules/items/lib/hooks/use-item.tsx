"use client";

import { useState, useCallback, useEffect } from "react";
import { getItemByIdAction } from "../actions/item.actions";
import { ItemDetails } from "../types/item.types";

interface Props {
  itemId: string;
  onSuccess?: (item: ItemDetails) => void;
}

export function useItem({ itemId, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<ItemDetails | null>(null);

  const getItem = useCallback(async () => {
    if (!itemId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getItemByIdAction(itemId);
      setItem(response);
      onSuccess?.(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get item";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [itemId, onSuccess]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setItem(null);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void getItem();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [getItem]);

  return {
    getItem,
    isLoading,
    error,
    item,
    reset,
  };
}
