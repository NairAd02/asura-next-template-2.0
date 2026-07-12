"use server";

import {
  changePassword,
  deactivateUser,
  deactivateUsers,
  editUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  getUsersForSelect,
  getUsersStats,
  inviteUser,
  resendInvitation,
  resetPassword,
  signOutUser,
  toggleUserStatus,
  updateCurrentUserProfile,
} from "../services/user.services";
import {
  ChangePasswordDto,
  CreateUserDto,
  EditUserDto,
  ResetPasswordDto,
  UpdateCurrentUserProfileDto,
  UserFiltersDto,
  UsersResponse,
  UsersStats,
} from "../types/user.types";

export async function getAllUsersAction(
  options: UserFiltersDto = {},
): Promise<UsersResponse> {
  try {
    return await getAllUsers(options);
  } catch (error) {
    throw new Error(`Failed to get users: ${error}`);
  }
}

export async function getUserByIdAction(userId: string) {
  return await getUserById(userId);
}

export async function getCurrentUserAction() {
  return await getCurrentUser();
}

export async function editUserAction(userId: string, dto: EditUserDto) {
  return await editUser(userId, dto);
}

export async function toggleUserStatusAction(userId: string) {
  return await toggleUserStatus(userId);
}

export async function deactivateUserAction(userId: string) {
  return await deactivateUser(userId);
}

export async function deactivateUsersAction(userIds: string[]) {
  return await deactivateUsers(userIds);
}

export async function signOutAction() {
  return await signOutUser();
}

export async function getUsersStatsAction(): Promise<UsersStats> {
  try {
    const response = await getUsersStats();
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to get users stats");
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get users stats: ${error}`);
  }
}

export async function inviteUserAction(dto: CreateUserDto) {
  return await inviteUser(dto);
}

export async function getUsersForSelectAction() {
  return await getUsersForSelect();
}

export async function resendInvitationAction(userId: string, locale: string) {
  return await resendInvitation(userId, locale);
}

export async function resetPasswordAction(dto: ResetPasswordDto) {
  return await resetPassword(dto);
}

export async function changePasswordAction(dto: ChangePasswordDto) {
  return await changePassword(dto);
}

export async function updateCurrentUserProfileAction(dto: UpdateCurrentUserProfileDto) {
  return await updateCurrentUserProfile(dto);
}
