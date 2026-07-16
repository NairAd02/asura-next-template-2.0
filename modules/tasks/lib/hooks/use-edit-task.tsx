"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { editTaskAction } from "../actions/task.actions";
import type { EditTaskInput } from "../schemas/task.schemas";
import type { TaskDetails } from "../types/task.types";

interface Props {
  onSuccess?: (task: TaskDetails) => void;
}

export function useEditTask({ onSuccess }: Props = {}) {
  const t = useTranslations("tasks");
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTask = useCallback(async (id: string, input: EditTaskInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await editTaskAction(id, input);
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

  return { editTask, task, isLoading, error, reset };
}
