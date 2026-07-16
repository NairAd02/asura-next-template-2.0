"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { AlertComponent } from "@/components/ui/alert-component";
import FormActionFooter from "@/components/form/components/form-action-footer";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { RHFTextAreaField } from "@/components/form/rhf-components/rhf-text-area-field/rhf-text-area-field";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { taskPriorityOptions, taskStatusOptions } from "../lib/types/task.types";

interface Props {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export default function TaskForm({ loading = false, error, onCancel, isEditMode = false }: Props) {
  const t = useTranslations("taskForm");
  useFormContext();

  return (
    <div className="flex max-h-[75vh] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {error && <AlertComponent title={error} variant="destructive" />}
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <div className="border-b pb-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("basicInfo")}</h3></div>
          <RHFTextField name="title" label={t("title")} placeholder={t("titlePlaceholder")} maxLength={120} />
          <RHFTextAreaField name="description" label={t("description")} placeholder={t("descriptionPlaceholder")} rows={3} />
        </div>
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <div className="border-b pb-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("planning")}</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <RHFSelectField name="status" label={t("status")} placeholder={t("statusPlaceholder")} options={taskStatusOptions.map((option) => ({ label: t(`statusOptions.${option.value}`), value: option.value }))} />
            <RHFSelectField name="priority" label={t("priority")} placeholder={t("priorityPlaceholder")} options={taskPriorityOptions.map((option) => ({ label: t(`priorityOptions.${option.value}`), value: option.value }))} />
            <RHFTextField name="dueDate" label={t("dueDate")} placeholder={t("datePlaceholder")} maxLength={10} />
          </div>
        </div>
      </div>
      <FormActionFooter
        loading={loading}
        onCancel={onCancel ?? (() => {})}
        cancelButtonText={t("cancel")}
        submitButtonText={t(isEditMode ? "save" : "create")}
        loadingText={t(isEditMode ? "saving" : "creating")}
      />
    </div>
  );
}
