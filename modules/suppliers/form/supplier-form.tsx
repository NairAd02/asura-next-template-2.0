"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFToggleField } from "@/components/form/rhf-components/rhf-toggle-field/rhf-toggle-field";
import FormActionFooter from "@/components/form/components/form-action-footer";
import { AlertComponent } from "@/components/ui/alert-component";

interface Props { loading?: boolean; error?: string | null; onCancel?: () => void; isEditMode?: boolean; }

export default function SupplierForm({ loading = false, error, onCancel, isEditMode = false }: Props) {
  const t = useTranslations("supplierForm");
  useFormContext();
  return (
    <div className="flex max-h-[75vh] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {error && <AlertComponent title={error} variant="destructive" />}
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <div className="border-b pb-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("basicInfo")}</h3></div>
          <RHFTextField name="name" label={t("name")} placeholder={t("namePlaceholder")} maxLength={120} />
          <RHFTextField name="contactName" label={t("contactName")} placeholder={t("contactNamePlaceholder")} maxLength={120} />
          <RHFTextField name="email" type="email" label={t("email")} placeholder={t("emailPlaceholder")} maxLength={254} transform="lowercase" />
          <RHFTextField name="phone" label={t("phone")} placeholder={t("phonePlaceholder")} maxLength={30} />
          <RHFToggleField name="isActive" label={t("isActive")} description={t("isActiveDescription")} />
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
