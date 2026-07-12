"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Pencil,
  Lock,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserDetails,
  getUserRoleInfo,
  getUserStatusInfo,
  getUserRoleLabel,
  getUserStatusLabel,
} from "@/modules/users/lib/types/user.types";
import { formatDateTime } from "@/lib/utils/dates";
import { EditProfileForm } from "./components/edit-profile-form";
import { UpdateProfileSchema } from "./schemas/update-profile-schema";
import ChangePasswordFormContainer from "./components/change-password/change-password-form-container";
import ForgotPasswordFormContainer from "@/modules/users/form/forgot-password/forgot-password-form-container";

interface Props {
  user: UserDetails;
  isUpdating: boolean;
  updateError: string | null;
  onSave: (data: UpdateProfileSchema) => void;
  onPasswordChange: () => void;
}

type SecurityView = null | "forgot" | "change";

function getInitials(fullName: string | null, email: string | null): string {
  if (fullName) {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

export function ProfilePresentational({
  user,
  isUpdating,
  updateError,
  onSave,
  onPasswordChange,
}: Props) {
  const t = useTranslations("userProfile");
  const tUserRole = useTranslations("users.roleValues");
  const tUserStatus = useTranslations("users.statusValues");
  const [editingName, setEditingName] = useState(false);
  const [securityView, setSecurityView] = useState<SecurityView>(null);

  const roleInfo = getUserRoleInfo(user.role);
  const statusInfo = getUserStatusInfo(user.status);
  const initials = getInitials(user.fullName, user.email);

  const handleSave = (data: UpdateProfileSchema) => {
    onSave(data);
    setEditingName(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Avatar & identity header ───────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-semibold select-none">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold truncate">
            {user.fullName || t("noName")}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              className={`text-xs font-medium ${roleInfo.className}`}
              variant="outline"
            >
              {getUserRoleLabel(user.role, tUserRole)}
            </Badge>
            <Badge
              className={`text-xs font-medium ${statusInfo.className}`}
              variant="outline"
            >
              {getUserStatusLabel(user.status, tUserStatus)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Personal Information ───────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {t("sections.personalInfo")}
          </h3>
          {!editingName && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setEditingName(true)}
            >
              <Pencil className="h-3 w-3" />
              {t("editName")}
            </Button>
          )}
        </div>

        {editingName ? (
          <EditProfileForm
            defaultFullName={user.fullName ?? ""}
            isLoading={isUpdating}
            error={updateError}
            onSubmit={handleSave}
            onCancel={() => setEditingName(false)}
          />
        ) : (
          <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<User className="h-3.5 w-3.5" />}
              label={t("fields.fullName")}
              value={user.fullName || "—"}
            />
            <InfoRow
              icon={<Mail className="h-3.5 w-3.5" />}
              label={t("fields.email")}
              value={user.email || "—"}
              mono
            />
          </div>
        )}
      </section>

      <Separator />

      {/* ── System Information ────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          {t("sections.systemInfo")}
        </h3>
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow
            icon={<Shield className="h-3.5 w-3.5" />}
            label={t("fields.role")}
            value={getUserRoleLabel(user.role, tUserRole)}
          />
          <InfoRow
            icon={<Shield className="h-3.5 w-3.5" />}
            label={t("fields.status")}
            value={getUserStatusLabel(user.status, tUserStatus)}
          />
          <InfoRow
            icon={<Calendar className="h-3.5 w-3.5" />}
            label={t("fields.createdAt")}
            value={formatDateTime(user.createdAt)}
          />
          <InfoRow
            icon={<Clock className="h-3.5 w-3.5" />}
            label={t("fields.updatedAt")}
            value={formatDateTime(user.updatedAt)}
          />
        </div>
      </section>

      <Separator />

      {/* ── Security ──────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          {t("sections.security")}
        </h3>

        {securityView === null && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setSecurityView("change")}
            >
              <KeyRound className="h-4 w-4" />
              {t("security.changePassword")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setSecurityView("forgot")}
            >
              <Lock className="h-4 w-4" />
              {t("security.forgotPassword")}
            </Button>
          </div>
        )}

        {securityView === "forgot" && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium">{t("security.forgotTitle")}</p>
            <ForgotPasswordFormContainer
              defaultEmail={user.email ?? ""}
              onCancel={() => setSecurityView(null)}
            />
          </div>
        )}

        {securityView === "change" && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium mb-4">{t("security.changeTitle")}</p>
            <ChangePasswordFormContainer
              onCancel={() => setSecurityView(null)}
              onPasswordChange={onPasswordChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {icon}
        {label}
      </p>
      <p className={`text-sm truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
