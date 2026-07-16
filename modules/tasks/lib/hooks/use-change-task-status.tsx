"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { changeTaskStatusAction } from "../actions/task.actions";
import type { TaskDetails, TaskStatus } from "../types/task.types";

interface Props {
  onSuccess?: (task: TaskDetails) => void;
}

export function useChangeTaskStatus({ onSuccess }: Props = {}) {
  const t = useTranslations("tasks");
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await changeTaskStatusAction(id, status);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      setTask(response.data);
      onSuccess?.(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, t]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setTask(null);
  }, []);

  return { changeTaskStatus, task, isLoading, error, reset };
}
