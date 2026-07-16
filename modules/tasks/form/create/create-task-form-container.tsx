"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { createTaskSchema } from "../../lib/schemas/task.schemas";
import type { CreateTaskOutput } from "../../lib/schemas/task.schemas";
import { useCreateTask } from "../../lib/hooks/use-create-task";
import TaskForm from "../task-form";

export default function CreateTaskFormContainer({ onClose }: { onClose?: () => void }) {
  const t = useTranslations("taskForm");
  const tTasks = useTranslations("tasks");
  const router = useRouter();
  const schema = createTaskSchema({
    titleRequired: t("validation.titleRequired"),
    titleMin: t("validation.titleMin"),
    titleMax: t("validation.titleMax"),
    descriptionMax: t("validation.descriptionMax"),
    statusInvalid: t("validation.statusInvalid"),
    priorityInvalid: t("validation.priorityInvalid"),
    dueDateInvalid: t("validation.dueDateInvalid"),
  });
  const form = useForm<CreateTaskOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    },
  });
  const { createTask, isLoading, error } = useCreateTask({ onSuccess: () => {
    toast.success(tTasks("notifications.created"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => createTask(data))}>
        <TaskForm loading={isLoading} error={error} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
