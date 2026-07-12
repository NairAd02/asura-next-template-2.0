"use client";

import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertComponent } from "@/components/ui/alert-component";
import {
  getUserRoleLabel,
} from "@/modules/users/lib/types/user.types";
import { useTranslations } from "next-intl";

interface CreateUserFormProps {
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export default function CreateUserForm({
  loading = false,
  error,
  onCancel,
}: CreateUserFormProps) {
  const t = useTranslations("userForm");
  const roleOptions = [
    { label: getUserRoleLabel("admin"), value: "admin" },
    { label: getUserRoleLabel("editor"), value: "editor" },
    { label: getUserRoleLabel("viewer"), value: "viewer" },
  ];

  return (
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
            <RHFTextField
              name="email"
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              fullWidth
            />
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
              {t("access")}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <RHFSelectField
              name="role"
              label={t("role")}
              placeholder={t("rolePlaceholder")}
              options={roleOptions}
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
              {t("sendingInvite")}
            </>
          ) : (
            t("sendInvite")
          )}
        </Button>
      </div>
    </div>
  );
}
