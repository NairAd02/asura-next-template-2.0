"use client";

import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFPasswordField } from "@/components/form/rhf-components/rhf-password-field/rhf-password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AlertComponent } from "@/components/ui/alert-component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface OnboardingFormProps {
  email?: string;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export default function OnboardingForm({
  email,
  loading = false,
  error,
  onCancel,
}: OnboardingFormProps) {
  const t = useTranslations("activateAccount");

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-full overflow-auto">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {error && <AlertComponent title={error} variant="destructive" />}

            <div className="bg-white rounded-lg border p-4 space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("userInformation")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <RHFTextField
                  name="fullName"
                  label={t("fullName")}
                  placeholder={t("fullNamePlaceholder")}
                  fullWidth
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("security")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <RHFPasswordField
                  name="password"
                  label={t("password")}
                  placeholder={t("passwordPlaceholder")}
                  fullWidth
                />
                <RHFPasswordField
                  name="confirmPassword"
                  label={t("confirmPassword")}
                  placeholder={t("confirmPasswordPlaceholder")}
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 flex items-center justify-between gap-3 bg-background">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("activating")}
                </>
              ) : (
                t("activate")
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
