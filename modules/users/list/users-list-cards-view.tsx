"use client";
import { User } from "../lib/types/user.types";
import { UserCard } from "../components/user-card";
import { CardViewWrapper, HeaderConfig } from "@/components/ui/card-view-wrapper";
import { TableProperties } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  users: User[];
  currentUserId?: string | null;
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  isTogglingUserStatus: boolean;
  onResendInvitation: (userId: string) => void;
  isResendingInvitation: boolean;
}

export default function UsersListCardsView({
  users,
  currentUserId,
  onViewUser,
  onEditUser,
  onToggleUserStatus,
  isTogglingUserStatus,
  onResendInvitation,
  isResendingInvitation,
}: Props) {
  const t = useTranslations('table');
  const headerConfig: HeaderConfig = {
    title: t('users'),
    icon: <TableProperties className="w-6 h-6" />,
  };

  return (
    <CardViewWrapper headerConfig={headerConfig}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isSelf={user.id === currentUserId}
            onView={onViewUser}
            onEdit={onEditUser}
            onToggleUserStatus={onToggleUserStatus}
            isTogglingUserStatus={isTogglingUserStatus}
            onResendInvitation={onResendInvitation}
            isResendingInvitation={isResendingInvitation}
          />
        ))}
      </div>
    </CardViewWrapper>
  );
}
