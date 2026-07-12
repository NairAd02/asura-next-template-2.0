"use client";

import { useTranslations } from "next-intl";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertComponent } from "@/components/ui/alert-component";
import { RHFPasswordField } from "@/components/form/rhf-components/rhf-password-field/rhf-password-field";

interface Props {
  loading?: boolean;
  error?: string | null;
}

export function ResetPasswordForm({ loading = false, error }: Props) {
  const t = useTranslations("resetPassword");

  return (
    <div className="space-y-4">
      {error && <AlertComponent title={error} variant="destructive" />}

      <RHFPasswordField
        name="password"
        label={t("newPassword")}
        placeholder="••••••••"
      />

      <RHFPasswordField
        name="confirmPassword"
        label={t("confirmPassword")}
        placeholder="••••••••"
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            {t("submit")}
          </>
        )}
      </Button>
    </div>
  );
}
