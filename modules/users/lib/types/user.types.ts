import { UserFilters } from "../../filters/hooks/use-users-filters";
import { EditUserSchema } from "../../form/edit/schemas/edit-user-schema";
import { CreateUserSchema } from "../../form/create/schemas/create-user-schema";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor" | "viewer";

export type UserStatus = "active" | "inactive";

// ─── Enum Helpers ────────────────────────────────────────────────────────────

export const userRoleConfig: Record<
  UserRole,
  { label: string; className: string }
> = {
  admin: {
    label: "Admin",
    className: "text-indigo-600 bg-indigo-100",
  },
  editor: {
    label: "Editor",
    className: "text-blue-600 bg-blue-100",
  },
  viewer: {
    label: "Viewer",
    className: "text-gray-600 bg-gray-100",
  },
};

export const userStatusConfig: Record<
  UserStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "text-green-600 bg-green-100",
  },
  inactive: {
    label: "Inactive",
    className: "text-gray-600 bg-gray-100",
  },
};

export const getUserRoleInfo = (role: UserRole) => {
  return (
    userRoleConfig[role] || {
      label: role,
      className: "text-gray-600 bg-gray-100",
    }
  );
};

export const getUserStatusInfo = (status: UserStatus) => {
  return (
    userStatusConfig[status] || {
      label: status,
      className: "text-gray-600 bg-gray-100",
    }
  );
};

export const getUserRoleLabel = (
  role: UserRole,
  t?: (key: string) => string
) => {
  if (t) {
    return t(role);
  }
  return getUserRoleInfo(role).label;
};

export const getUserStatusLabel = (
  status: UserStatus,
  t?: (key: string) => string
) => {
  if (t) {
    return t(status);
  }
  return getUserStatusInfo(status).label;
};

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserDetails = User;

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter DTOs ──────────────────────────────────────────────────────────────

export interface UserFiltersDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // filters
  search?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
}

export const convertUserFiltersDto = (
  userFilters: UserFilters,
): UserFiltersDto => {
  return {
    search: userFilters.search || undefined,
    role: (userFilters.role as UserRole) || undefined,
    status: (userFilters.status as UserStatus) || undefined,
    sortBy: userFilters.sortBy || undefined,
    sortOrder: userFilters.sortOrder || undefined,
  };
};

// ─── Edit DTO ─────────────────────────────────────────────────────────────────

export interface EditUserDto {
  role: UserRole;
  status: UserStatus;
}

export const convertEditUserDto = (schema: EditUserSchema): EditUserDto => {
  return {
    role: schema.role as UserRole,
    status: schema.status as UserStatus,
  };
};

// ─── Create DTO ────────────────────────────────────────────────────────────────

export interface CreateUserDto {
  email: string;
  role: UserRole;
  fullName?: string | null;
  locale?: string;
}

export const convertCreateUserDto = (schema: CreateUserSchema, locale?: string): CreateUserDto => {
  return {
    email: String(schema.email),
    role: schema.role as UserRole,
    fullName: schema.fullName ? String(schema.fullName) : null,
    locale,
  };
};

// ─── Reset Password DTO ────────────────────────────────────────────────────────

export interface ResetPasswordDto {
  password: string;
}

// ─── Change Password DTO ───────────────────────────────────────────────────────

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// ─── Update Profile DTO ────────────────────────────────────────────────────────

export interface UpdateCurrentUserProfileDto {
  fullName?: string | null;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface UsersStats {
  totalUsers: number;
  admins: number;
  editors: number;
  viewers: number;
  active: number;
  inactive: number;
}
