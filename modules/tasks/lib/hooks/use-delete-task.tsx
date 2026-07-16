"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteTaskAction } from "../actions/task.actions";

interface Props {
  onSuccess?: () => void;
}

export function useDeleteTask({ onSuccess }: Props = {}) {
  const t = useTranslations("tasks");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteTaskAction(id);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setError(t.has(key) ? t(key) : response.error.message);
        return false;
      }
      onSuccess?.();
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { deleteTask, isLoading, error, reset };
}
