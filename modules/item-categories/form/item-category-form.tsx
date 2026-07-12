"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFTextAreaField } from "@/components/form/rhf-components/rhf-text-area-field/rhf-text-area-field";
import { RHFToggleField } from "@/components/form/rhf-components/rhf-toggle-field/rhf-toggle-field";
import { RHFImageUpload } from "@/components/form/rhf-components/rhf-image-upload/rhf-image-upload";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { RHFNumberField } from "@/components/form/rhf-components/rhf-number-field/rhf-number-field";
import { AlertComponent } from "@/components/ui/alert-component";
import { DollarSign, Hash } from "lucide-react";
import { useTranslations } from "next-intl";
import FormActionFooter from "@/components/form/components/form-action-footer";

const CURRENCY_OPTIONS = [
  { label: "MXN", value: "MXN" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];

const PRICING_TYPE_OPTIONS = [
  { label: "Flat Rate", value: "flat_rate" },
  { label: "Unit Based", value: "unit_based" },
];

interface ItemCategoryFormProps {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  isEditMode?: boolean;
  fileIconCodeRecived?: { loading: boolean; error: string | null };
}

export default function ItemCategoryForm({
  loading = false,
  error,
  onCancel,
  isEditMode = false,
  fileIconCodeRecived,
}: ItemCategoryFormProps) {
  const t = useTranslations('itemCategoryForm');
  const { control } = useFormContext();

  const pricingType = useWatch({ control, name: "pricingType" });
  const isFlatRate = pricingType === "flat_rate";
  const isUnitBased = pricingType === "unit_based";

  return (
    <div className="flex flex-col h-full max-h-[75vh]">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {error && <AlertComponent title={error} variant="destructive" />}

        {/* Basic info */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('basicInfo')}
            </h3>
          </div>
          <div className="flex flex-col xs:flex-row items-center w-full gap-6">
            <RHFImageUpload
              name="iconCode"
              variant="avatar"
              showDescription={false}
              avatarSize={100}
              label={t('iconCode')}
              {...(fileIconCodeRecived && { loading: fileIconCodeRecived.loading })}
            />
            <div className="flex flex-col w-full gap-2">
              <RHFTextField
                name="name"
                label={t('name')}
                placeholder={t('namePlaceholder')}
                fullWidth
              />
              <RHFTextAreaField
                name="description"
                label={t('description')}
                placeholder={t('descriptionPlaceholder')}
                fullWidth
                rows={3}
              />
            </div>
          </div>

          <RHFToggleField
            name="isActive"
            label={t('isActive')}
            description={t('isActiveDescription')}
          />
        </div>

        {/* Pricing configuration */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('pricingConfiguration')}
            </h3>
          </div>

          <RHFSelectField
            name="pricingType"
            label={t('pricingType')}
            options={PRICING_TYPE_OPTIONS}
            placeholder={t('pricingTypePlaceholder')}
          />

          {isFlatRate && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-foreground">{t('flatRatePrice')}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t('flatRateDescription')}</p>
              <div className="grid grid-cols-2 gap-3">
                <RHFNumberField
                  name="flatRateRule.price"
                  label={t('price')}
                  placeholder="0.00"
                  min={0.01}
                  fullWidth
                />
                <RHFSelectField
                  name="flatRateRule.currency"
                  label={t('currency')}
                  options={CURRENCY_OPTIONS}
                  placeholder="MXN"
                  fullWidth
                />
              </div>
            </div>
          )}

          {isUnitBased && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-foreground">{t('unitBasedPrice')}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t('unitBasedDescription')}</p>
              <div className="grid grid-cols-2 gap-3">
                <RHFNumberField
                  name="unitBasedRule.price"
                  label={t('price')}
                  placeholder="0.00"
                  min={0}
                  fullWidth
                />
                <RHFSelectField
                  name="unitBasedRule.currency"
                  label={t('currency')}
                  options={CURRENCY_OPTIONS}
                  placeholder="MXN"
                  fullWidth
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <FormActionFooter
        loading={loading}
        onCancel={onCancel || (() => { })}
        cancelButtonText={t('cancel')}
        submitButtonText={!isEditMode ? t('createItemCategory') : t('editItemCategory')}
        loadingText={!isEditMode ? t('creating') : t('editing')}
      />
    </div>
  );
}

export { RHFTextField };
