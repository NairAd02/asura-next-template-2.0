"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { AlertComponent } from "@/components/ui/alert-component";
import FormActionFooter from "@/components/form/components/form-action-footer";
import { RHFNumberField } from "@/components/form/rhf-components/rhf-number-field/rhf-number-field";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { RHFTextAreaField } from "@/components/form/rhf-components/rhf-text-area-field/rhf-text-area-field";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { vehicleStatusOptions, vehicleTypeOptions } from "../lib/types/vehicle.types";

interface Props {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export default function VehicleForm({ loading = false, error, onCancel, isEditMode = false }: Props) {
  const t = useTranslations("vehicleForm");
  useFormContext();
  const currentYear = new Date().getFullYear() + 1;

  return (
    <div className="flex max-h-[75vh] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {error && <AlertComponent title={error} variant="destructive" />}
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <div className="border-b pb-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("identity")}</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <RHFTextField name="plate" label={t("plate")} placeholder={t("platePlaceholder")} maxLength={16} transform="uppercase" />
            <RHFTextField name="vin" label={t("vin")} placeholder={t("vinPlaceholder")} maxLength={17} transform="uppercase" allowedPattern={/[A-Za-z0-9-]/} />
            <RHFTextField name="make" label={t("make")} placeholder={t("makePlaceholder")} maxLength={80} />
            <RHFTextField name="model" label={t("model")} placeholder={t("modelPlaceholder")} maxLength={80} />
            <RHFNumberField name="year" label={t("year")} placeholder={t("yearPlaceholder")} min={1980} max={currentYear} />
            <RHFSelectField name="type" label={t("typeLabel")} placeholder={t("typePlaceholder")} options={vehicleTypeOptions.map((option) => ({ label: t(`typeOptions.${option.value}`), value: option.value }))} />
          </div>
        </div>
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <div className="border-b pb-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("operations")}</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <RHFSelectField name="status" label={t("status")} placeholder={t("statusPlaceholder")} options={vehicleStatusOptions.map((option) => ({ label: t(`statusOptions.${option.value}`), value: option.value }))} />
            <RHFTextField name="branch" label={t("branch")} placeholder={t("branchPlaceholder")} maxLength={120} />
            <RHFTextField name="assignedDriver" label={t("assignedDriver")} placeholder={t("assignedDriverPlaceholder")} maxLength={120} />
            <RHFNumberField name="odometer" label={t("odometer")} placeholder={t("odometerPlaceholder")} min={0} />
            <RHFTextField name="lastInspectionDate" label={t("lastInspectionDate")} placeholder={t("datePlaceholder")} maxLength={10} />
            <RHFTextField name="nextMaintenanceDate" label={t("nextMaintenanceDate")} placeholder={t("datePlaceholder")} maxLength={10} />
          </div>
          <RHFTextAreaField name="notes" label={t("notes")} placeholder={t("notesPlaceholder")} rows={3} />
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
