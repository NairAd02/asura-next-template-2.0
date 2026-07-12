"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Eye, MailCheck, UserPlus, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  User,
  getUserRoleInfo,
  getUserRoleLabel,
  getUserStatusInfo,
  getUserStatusLabel,
} from "../lib/types/user.types";

interface Props {
  user: User;
  isSelf?: boolean;
  onView: (userId: string) => void;
  onEdit: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  isTogglingUserStatus: boolean;
  onResendInvitation: (userId: string) => void;
  isResendingInvitation: boolean;
}

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

export function UserCard({
  user,
  isSelf,
  onView,
  onEdit,
  onToggleUserStatus,
  isTogglingUserStatus,
  onResendInvitation,
  isResendingInvitation,
}: Props) {
  const tUserRole = useTranslations('users.roleValues');
  const tUserStatus = useTranslations('users.statusValues');
  const roleInfo = getUserRoleInfo(user.role);
  const statusInfo = getUserStatusInfo(user.status);
  const isActive = user.status === "active";
  const displayName = user.fullName || user.email || "Unknown user";

  return (
    <div className="group rounded-lg border border-border bg-card shadow-xs hover:shadow-sm hover:border-border/80 transition-all flex flex-col">
      <div className="flex items-start gap-3 p-4">
        <Avatar className="h-10 w-10 ring-2 ring-background shrink-0">
          <AvatarFallback
            className={cn("text-xs font-semibold", roleInfo.className)}
          >
            {getInitials(user.fullName, user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm text-foreground leading-tight">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground mt-0.5">
            {user.email ?? "—"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-transparent text-[10px] font-medium",
                roleInfo.className,
              )}
            >
              {getUserRoleLabel(user.role, tUserRole)}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-transparent text-[10px] font-medium gap-1",
                statusInfo.className,
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-green-500" : "bg-gray-400",
                )}
                aria-hidden="true"
              />
              {getUserStatusLabel(user.status, tUserStatus)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 border-t border-border bg-muted/30 px-3 py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView(user.id)}
            >
              <Eye className="h-4 w-4 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View details</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isSelf}
              onClick={() => onEdit(user.id)}
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSelf ? "Cannot edit yourself" : "Edit"}</p>
          </TooltipContent>
        </Tooltip>
        {!isActive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isResendingInvitation}
                onClick={() => onResendInvitation(user.id)}
              >
                <MailCheck className="h-4 w-4 text-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resend invitation</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isSelf || isTogglingUserStatus}
              onClick={() => onToggleUserStatus(user.id)}
            >
              {!isActive ? (
                <UserPlus className="h-4 w-4 text-green-500" />
              ) : (
                <UserX className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSelf ? "Cannot deactivate yourself" : !isActive ? "Activate" : "Deactivate"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
