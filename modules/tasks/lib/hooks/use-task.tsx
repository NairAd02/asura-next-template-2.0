"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getTaskByIdAction } from "../actions/task.actions";
import type { TaskDetails } from "../types/task.types";

export function useTask(taskId: string) {
  const t = useTranslations("tasks");
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTaskByIdAction(taskId);
      if (!response.success) {
        const key = `errors.${response.error.code}`;
        setTask(null);
        setError(t.has(key) ? t(key) : response.error.message);
        return;
      }
      setTask(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [taskId, t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadTask(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTask]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setTask(null);
  }, []);

  return { task, isLoading, error, reload: loadTask, reset };
}
