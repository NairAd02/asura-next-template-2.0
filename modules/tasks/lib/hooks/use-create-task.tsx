"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { createTaskAction } from "../actions/task.actions";
import type { CreateTaskInput } from "../schemas/task.schemas";
import type { TaskDetails } from "../types/task.types";

interface Props {
  onSuccess?: (task: TaskDetails) => void;
}

export function useCreateTask({ onSuccess }: Props = {}) {
  const t = useTranslations("tasks");
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createTaskAction(input);
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

  return { createTask, task, isLoading, error, reset };
}
