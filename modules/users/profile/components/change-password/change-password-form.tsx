"use client";

import { useTranslations } from "next-intl";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertComponent } from "@/components/ui/alert-component";
import { RHFPasswordField } from "@/components/form/rhf-components/rhf-password-field/rhf-password-field";

interface Props {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ChangePasswordForm({
  loading = false,
  error,
  onCancel,
}: Props) {
  const t = useTranslations("userProfile");

  return (
    <div className="space-y-4">
      {error && <AlertComponent title={error} variant="destructive" />}

      <RHFPasswordField
        name="oldPassword"
        label={t("security.currentPassword")}
        placeholder="••••••••"
      />

      <RHFPasswordField
        name="newPassword"
        label={t("security.newPassword")}
        placeholder="••••••••"
      />

      <RHFPasswordField
        name="confirmPassword"
        label={t("security.confirmPassword")}
        placeholder="••••••••"
      />

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          {t("security.back")}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("security.changing")}
            </>
          ) : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              {t("security.savePassword")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
