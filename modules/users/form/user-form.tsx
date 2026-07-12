"use client";

import { RHFTextField } from "@/components/form/rhf-components/rhf-text-field/rhf-text-field";
import { RHFSelectField } from "@/components/form/rhf-components/rhf-select-field/rhf-select-field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { AlertComponent } from "@/components/ui/alert-component";
import {
  getUserRoleLabel,
  getUserStatusLabel,
} from "@/modules/users/lib/types/user.types";

interface UserFormProps {
  /** When true, hides editable fields and shows read-only profile info. */
  email?: string;
  fullName?: string | null;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export default function UserForm({
  email,
  fullName,
  loading = false,
  error,
  onCancel,
}: UserFormProps) {
  const t = useTranslations("userForm");

  const roleOptions = [
    { label: getUserRoleLabel("admin"), value: "admin" },
    { label: getUserRoleLabel("editor"), value: "editor" },
    { label: getUserRoleLabel("viewer"), value: "viewer" },
  ];

  const statusOptions = [
    { label: getUserStatusLabel("active"), value: "active" },
    {
      label: getUserStatusLabel("inactive"),
      value: "inactive",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {error && <AlertComponent title={error} variant="destructive" />}

        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("user")}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {t("fullNameLabel")}
              </p>
              <p className="text-sm text-foreground">
                {fullName || "—"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{t("email")}</p>
              <p className="text-sm text-foreground font-mono break-all">
                {email || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("access")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <RHFSelectField
              name="role"
              label={t("role")}
              placeholder={t("rolePlaceholder")}
              options={roleOptions}
              fullWidth
            />
            <RHFSelectField
              name="status"
              label={t("status")}
              placeholder={t("statusPlaceholder")}
              options={statusOptions}
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
              {t("saving")}
            </>
          ) : (
            t("save")
          )}
        </Button>
      </div>
    </div>
  );
}

// Re-export RHFTextField to satisfy tree-shaking; keeping as side-effect free.
export { RHFTextField };
