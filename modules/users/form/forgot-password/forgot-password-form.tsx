"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertComponent } from "@/components/ui/alert-component";
import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";

interface Props {
  loading?: boolean;
  error?: string | null;
  sent?: boolean;
  sentToEmail?: string;
  onCancel?: () => void;
  backHref?: string;
}

export function ForgotPasswordForm({
  loading = false,
  error,
  sent = false,
  sentToEmail,
  onCancel,
  backHref,
}: Props) {
  const t = useTranslations("forgotPassword");

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-medium">{t("successTitle")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("successDescription", { email: sentToEmail ?? "" })}
          </p>
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="w-full">
            {t("cancel")}
          </Button>
        )}
        {!onCancel && backHref && (
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href={backHref}>{t("backToLogin")}</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <AlertComponent title={error} variant="destructive" />}

      <RHFTextField
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        type="email"
        fullWidth
        disabled
      />

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              {t("submit")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
