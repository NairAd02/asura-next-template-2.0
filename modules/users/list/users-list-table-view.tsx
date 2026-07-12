"use client";
import {
  User,
  UserRole,
  UserStatus,
  getUserRoleInfo,
  getUserRoleLabel,
  getUserStatusInfo,
  getUserStatusLabel,
} from "../lib/types/user.types";
import { DataTable, BulkActionsConfig } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, MailCheck, TableProperties, UserPlus, UserX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/utils/dates";

interface Props {
  users: User[];
  currentUserId?: string | null;
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  isTogglingUserStatus: boolean;
  onBulkDeactivate: (userIds: string[]) => Promise<void>;
  isDeactivatingUsers: boolean;
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

export default function UsersListTableView({
  users,
  currentUserId,
  onViewUser,
  onEditUser,
  onToggleUserStatus,
  isTogglingUserStatus,
  onBulkDeactivate,
  isDeactivatingUsers,
  onResendInvitation,
  isResendingInvitation,
}: Props) {
  const t = useTranslations('table');
  const tUserRole = useTranslations('users.roleValues');
  const tUserStatus = useTranslations('users.statusValues');
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      enableHiding: false,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const isSelf = row.original.id === currentUserId;
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={isSelf}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    {
      accessorKey: "fullName",
      header: "",
      cell: ({ row }) => {
        const fullName = row.original.fullName;
        const email = row.original.email;
        const role = row.original.role;
        const roleConfig = getUserRoleInfo(role);
        return (
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarFallback className={cn("text-xs font-semibold", roleConfig.className)}>
              {getInitials(fullName, email)}
            </AvatarFallback>
          </Avatar>
        );
      },
      size: 68,
    },
    {
      accessorKey: "name",
      header: t('name'),
      cell: ({ row }) => {
        const fullName = row.original.fullName;
        const email = row.original.email;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground leading-tight">
              {fullName || t('noName')}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {email}
            </span>
          </div>
        );
      },
      size: 220,
    },
    {
      accessorKey: "email",
      header: t('email'),
    },
    {
      accessorKey: "role",
      header: t('role'),
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        const config = getUserRoleInfo(role);
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent font-medium",
              config.className,
            )}
          >
            {getUserRoleLabel(role, tUserRole)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: t('status'),
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        const config = getUserStatusInfo(status);
        const isActive = status === "active";
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent font-medium gap-1.5",
              config.className,
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-green-500" : "bg-gray-400",
              )}
              aria-hidden="true"
            />
            {getUserStatusLabel(status, tUserStatus)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t('created'),
      cell: ({ row }) => {
        const value = row.getValue("createdAt") as string;
        return (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(value)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: t('actions'),
      cell: ({ row }) => {
        const userId = row.getValue("id") as string;
        const isSelf = userId === currentUserId;
        const status = row.original.status;
        const isInactive = status !== "active";
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewUser(userId)}
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('viewDetails')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isSelf}
                  onClick={() => onEditUser(userId)}
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSelf ? t('cannotEditYourself') : t('edit')}</p>
              </TooltipContent>
            </Tooltip>

            {isInactive && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isResendingInvitation}
                    onClick={() => onResendInvitation(userId)}
                  >
                    <MailCheck className="h-4 w-4 text-amber-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('resendInvitation')}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isSelf || isTogglingUserStatus}
                  onClick={() => onToggleUserStatus(userId)}
                >
                  {isInactive ? (
                    <UserPlus className="h-4 w-4 text-green-500" />
                  ) : (
                    <UserX className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isSelf ? t('cannotDeactivateYourself') : isInactive ? t('activate') : t('deactivate')}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      size: 160,
    },
  ];

  const bulkActionsConfig: BulkActionsConfig<string, User> = {
    actions: [
      {
        key: "deactivate",
        label: t('deactivate'),
        icon: UserX,
        variant: "destructive",
        onAction: onBulkDeactivate,
        isLoading: isDeactivatingUsers,
        confirmation: {
          title: t('deactivateUsers'),
          description: t('deactivateUsersDescription'),
          confirmLabel: t('confirmDeactivate'),
        },
      },
    ],
    entityName: {
      singular: t('user'),
      plural: t('users'),
    },
    getRowId: (row: User) => row.id,
  };

  return (
    <DataTable
      tableId="users-list"
      columns={columns}
      initialVisibilityState={{ id: false, email: false }}
      headerConfig={{
        title: t('users'),
        icon: <TableProperties className="w-6 h-6" />
      }}
      data={users}
      dataEmptyText={t('noUsersFound')}
      maxHeight="calc(100vh - 280px)"
      bulkActionsConfig={bulkActionsConfig}
      showPagination={false}
      stickyColumns={[
        {
          columnId: "select",
          position: "left",
          offset: "0px",
          width: "48px",
        },
        {
          columnId: "fullName",
          position: "left",
          offset: "48px",
          width: "68px",
        },
        {
          columnId: "name",
          position: "left",
          offset: "116px",
          width: "220px",
          shadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
        },
        {
          columnId: "actions",
          position: "right",
          offset: "0px",
          width: "180px",
          shadow: "-2px 0 5px -2px rgba(0,0,0,0.1)",
        },
      ]}
    />
  );
}
