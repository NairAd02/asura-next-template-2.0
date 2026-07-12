import {
  Mail,
  Shield,
  Calendar,
  Clock,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import {
  UserDetails,
  getUserRoleLabel,
  getUserStatusInfo,
  getUserStatusLabel,
} from "../lib/types/user.types";
import { formatDateTime } from "@/lib/utils/dates";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(fullName?: string | null, email?: string | null) {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted-foreground sm:text-xs">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-xs text-foreground break-all sm:text-sm",
            mono && "font-mono",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  user: UserDetails;
}

export function UserDetailsPresentational({ user }: Props) {
  const t = useTranslations('userDetailsSection');
  const tTable = useTranslations('table');
  const tUserRole = useTranslations('users.roleValues');
  const tUserStatus = useTranslations('users.statusValues');
  const { fullName, email, role, status, createdAt, updatedAt } = user;
  const statusInfo = getUserStatusInfo(status);
  const displayName = fullName || email || t('unknownUser');

  return (
    <div className="flex flex-col gap-5 font-sans">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center",
            "rounded-full bg-primary text-primary-foreground",
            "text-base sm:text-lg font-semibold tracking-wide select-none",
          )}
        >
          {getInitials(fullName, email)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
            {displayName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
            {getUserRoleLabel(role, tUserRole)}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs",
                statusInfo.className,
              )}
            >
              {getUserStatusLabel(status, tUserStatus)}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <SectionDivider label={t('account')} />
        <div className="divide-y divide-border">
          <InfoRow icon={Mail} label={tTable('email')} value={email ?? "—"} mono />
          <InfoRow icon={Shield} label={tTable('role')} value={getUserRoleLabel(role, tUserRole)} />
          <InfoRow
            icon={CircleDot}
            label={tTable('status')}
            value={getUserStatusLabel(status, tUserStatus)}
          />
        </div>
      </div>

      <div>
        <SectionDivider label={t('timestamps')} />
        <div className="divide-y divide-border">
          <InfoRow
            icon={Calendar}
            label={tTable('created')}
            value={formatDateTime(createdAt)}
          />
          <InfoRow
            icon={Clock}
            label={t('lastUpdated')}
            value={formatDateTime(updatedAt)}
          />
        </div>
      </div>
    </div>
  );
}
