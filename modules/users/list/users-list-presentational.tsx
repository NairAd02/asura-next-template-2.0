"use client";
import { User } from "../lib/types/user.types";
import UsersListTableView from "./users-list-table-view";
import UsersListCardsView from "./users-list-cards-view";
import EditUserContainer from "../form/edit/edit-user-container";
import UserDetailsContainer from "../details/user-details-container";
import { Modal } from "@/components/modal/modal";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useEditUserListAction,
  useToggleUserStatusListAction,
  useViewUserListAction,
  useBulkDeactivateListAction,
  useResendInvitation,
} from "./hooks";

interface Props {
  users: User[];
  currentUserId: string | null;
}

export default function UsersListPresentational({
  users,
  currentUserId,
}: Props) {
  const t = useTranslations('userDetails');
  const tUsers = useTranslations('users');
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const {
    editingItemId: editingUserId,
    isModalOpen: isEditModalOpen,
    handleEditItem: handleEditUser,
    handleCloseModal: handleCloseEditModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditUserListAction();

  const {
    isTogglingUserStatus,
    handleToggleUserStatus,
  } = useToggleUserStatusListAction();

  const {
    viewingItemId: viewingUserId,
    isModalOpen,
    handleViewItem: handleViewUser,
    handleModalOpenChange,
  } = useViewUserListAction();

  const { isDeactivatingUsers, handleBulkDeactivate } =
    useBulkDeactivateListAction();

  const { resendInvitation, isLoading: isResendingInvitation } =
    useResendInvitation({
      onSuccess: () => {
        toast.success(tUsers('resendInvitation.successToast'), {
          position: "top-right",
        });
      },
      onError: (error) => {
        toast.error(error, { position: "top-right" });
      },
    });

  const handleResendInvitation = (userId: string) => {
    resendInvitation(userId, locale);
  };

  return (
    <div className="pb-4">
      <div className="hidden md:block">
        <UsersListTableView
          users={users}
          currentUserId={currentUserId}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
          isTogglingUserStatus={isTogglingUserStatus}
          onBulkDeactivate={handleBulkDeactivate}
          isDeactivatingUsers={isDeactivatingUsers}
          onResendInvitation={handleResendInvitation}
          isResendingInvitation={isResendingInvitation}
        />
      </div>
      <div className="block md:hidden">
        <UsersListCardsView
          users={users}
          currentUserId={currentUserId}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
          isTogglingUserStatus={isTogglingUserStatus}
          onResendInvitation={handleResendInvitation}
          isResendingInvitation={isResendingInvitation}
        />
      </div>

      <Modal
        open={isEditModalOpen}
        onOpenChange={handleEditModalOpenChange}
        title={t('editUser')}
        description={t('editUserDescription')}
        maxWidth="2xl"
        bodyClassName="px-0 py-0 pb-4"
      >
        {editingUserId && (
          <EditUserContainer
            userId={editingUserId}
            onClose={handleCloseEditModal}
          />
        )}
      </Modal>

      <Modal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        title={t('title')}
        description={t('description')}
        maxWidth="lg"
        maxHeight="lg"
      >
        {viewingUserId && <UserDetailsContainer userId={viewingUserId} />}
      </Modal>
    </div>
  );
}
