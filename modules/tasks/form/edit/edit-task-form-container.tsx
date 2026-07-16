"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { editTaskSchema } from "../../lib/schemas/task.schemas";
import type { EditTaskOutput } from "../../lib/schemas/task.schemas";
import type { TaskDetails } from "../../lib/types/task.types";
import { useEditTask } from "../../lib/hooks/use-edit-task";
import TaskForm from "../task-form";

export default function EditTaskFormContainer({ task, onClose }: { task: TaskDetails; onClose?: () => void }) {
  const t = useTranslations("taskForm");
  const tTasks = useTranslations("tasks");
  const router = useRouter();
  const schema = editTaskSchema({
    titleRequired: t("validation.titleRequired"),
    titleMin: t("validation.titleMin"),
    titleMax: t("validation.titleMax"),
    descriptionMax: t("validation.descriptionMax"),
    statusInvalid: t("validation.statusInvalid"),
    priorityInvalid: t("validation.priorityInvalid"),
    dueDateInvalid: t("validation.dueDateInvalid"),
  });
  const form = useForm<EditTaskOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
    },
  });
  const { editTask, isLoading, error } = useEditTask({ onSuccess: () => {
    toast.success(tTasks("notifications.updated"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => editTask(task.id, data))}>
        <TaskForm loading={isLoading} error={error} onCancel={onClose} isEditMode />
      </form>
    </FormProvider>
  );
}
