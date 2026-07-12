import "server-only";

import type { ServiceResponse } from "@/lib/api-responses";
import {
  queryCollection,
  createRecord,
  updateRecord,
  findById,
} from "@/lib/mock/in-memory-store";
import {
  ChangePasswordDto,
  CreateUserDto,
  EditUserDto,
  ResetPasswordDto,
  UpdateCurrentUserProfileDto,
  User,
  UserDetails,
  UserFiltersDto,
  UsersResponse,
  UsersStats,
  UserStatus,
} from "../types/user.types";
import { usersStore } from "../mock/users.data";
import { getMockUser } from "@/lib/auth/mock-session";

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<ServiceResponse<UserDetails | null>> {
  try {
    const actor = await getMockUser();
    const record = findById(usersStore, actor.userId);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get current user: ${error}` } };
  }
}

export async function getUserById(
  userId: string,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const record = findById(usersStore, userId);
    if (!record) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get user: ${error}` } };
  }
}

export async function getAllUsers(
  filters: UserFiltersDto = {},
): Promise<UsersResponse> {
  const { rows, pagination } = queryCollection({
    data: usersStore as unknown as Record<string, unknown>[],
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    search: filters.search,
    searchFields: ["email", "fullName"] as any,
    filters: {
      role: filters.role || undefined,
      status: filters.status || undefined,
    },
    sortBy: filters.sortBy ?? "fullName",
    sortOrder: filters.sortOrder ?? "asc",
  });

  return {
    users: rows as unknown as User[],
    pagination,
  };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function editUser(
  userId: string,
  dto: EditUserDto,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const updated = updateRecord(usersStore, userId, {
      role: dto.role,
      status: dto.status,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to update user: ${error}` } };
  }
}

export async function toggleUserStatus(
  userId: string,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const existing = findById(usersStore, userId);
    if (!existing) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    const newStatus: UserStatus = existing.status === "active" ? "inactive" : "active";
    const updated = updateRecord(usersStore, userId, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to toggle user status: ${error}` } };
  }
}

export async function deactivateUser(
  userId: string,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const updated = updateRecord(usersStore, userId, {
      status: "inactive" as UserStatus,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to deactivate user: ${error}` } };
  }
}

export async function deactivateUsers(
  userIds: string[],
): Promise<ServiceResponse<{ deactivated: number; failed: string[] }>> {
  const failed: string[] = [];
  let deactivated = 0;
  const now = new Date().toISOString();

  for (const id of userIds) {
    const record = updateRecord(usersStore, id, { status: "inactive" as UserStatus, updatedAt: now });
    if (record) {
      deactivated++;
    } else {
      failed.push(id);
    }
  }

  return { success: true, data: { deactivated, failed } };
}

export async function signOutUser(): Promise<ServiceResponse<void>> {
  return { success: true, data: undefined };
}

export async function inviteUser(
  dto: CreateUserDto,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: User = {
      id,
      email: dto.email,
      fullName: dto.fullName ?? null,
      role: dto.role,
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    };

    const created = createRecord(usersStore, record);
    return { success: true, data: created };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to invite user: ${error}` } };
  }
}

export async function getUsersStats(): Promise<ServiceResponse<UsersStats>> {
  try {
    const totalUsers = usersStore.length;
    const admins = usersStore.filter((u) => u.role === "admin").length;
    const editors = usersStore.filter((u) => u.role === "editor").length;
    const viewers = usersStore.filter((u) => u.role === "viewer").length;
    const active = usersStore.filter((u) => u.status === "active").length;
    const inactive = usersStore.filter((u) => u.status === "inactive").length;

    return {
      success: true,
      data: { totalUsers, admins, editors, viewers, active, inactive },
    };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get users stats: ${error}` } };
  }
}

export async function getUsersForSelect(): Promise<ServiceResponse<{ id: string; fullName: string | null; email: string }[]>> {
  try {
    const users = usersStore.map((u) => ({ id: u.id, fullName: u.fullName, email: u.email ?? "" }));
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get users: ${error}` } };
  }
}

export async function resendInvitation(
  _userId: string,
  _locale: string,
): Promise<ServiceResponse<void>> {
  return { success: true, data: undefined };
}

export async function resetPassword(
  _dto: ResetPasswordDto,
): Promise<ServiceResponse<void>> {
  return { success: true, data: undefined };
}

export async function changePassword(
  _dto: ChangePasswordDto,
): Promise<ServiceResponse<void>> {
  return { success: true, data: undefined };
}

export async function updateCurrentUserProfile(
  dto: UpdateCurrentUserProfileDto,
): Promise<ServiceResponse<UserDetails>> {
  try {
    const actor = await getMockUser();
    const updated = updateRecord(usersStore, actor.userId, {
      fullName: dto.fullName ?? null,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to update profile: ${error}` } };
  }
}