import type { User } from "../types/user.types";

// ─── Mock store ───────────────────────────────────────────────────────────────

function makeUser(
  id: string,
  email: string,
  fullName: string,
  role: User["role"],
  status: User["status"],
  createdAt: string,
): User {
  return {
    id,
    email,
    fullName,
    role,
    status,
    createdAt,
    updatedAt: createdAt,
  };
}

export const usersStore: User[] = [
  makeUser("mock-user-id-001", "admin@template.dev",   "Template Admin",   "admin",  "active",   "2024-01-01T08:00:00Z"),
  makeUser("usr-002",          "alice@template.dev",   "Alice Johnson",    "admin",  "active",   "2024-01-05T09:00:00Z"),
  makeUser("usr-003",          "bob@template.dev",     "Bob Martinez",     "editor", "active",   "2024-01-08T10:00:00Z"),
  makeUser("usr-004",          "carol@template.dev",   "Carol Williams",   "editor", "active",   "2024-01-10T11:00:00Z"),
  makeUser("usr-005",          "david@template.dev",   "David Chen",       "editor", "inactive", "2024-01-12T12:00:00Z"),
  makeUser("usr-006",          "emma@template.dev",    "Emma Thompson",    "viewer", "active",   "2024-01-15T09:30:00Z"),
  makeUser("usr-007",          "frank@template.dev",   "Frank Garcia",     "viewer", "active",   "2024-01-18T10:30:00Z"),
  makeUser("usr-008",          "grace@template.dev",   "Grace Lee",        "viewer", "active",   "2024-01-20T11:30:00Z"),
  makeUser("usr-009",          "henry@template.dev",   "Henry Wilson",     "viewer", "inactive", "2024-01-22T12:30:00Z"),
  makeUser("usr-010",          "iris@template.dev",    "Iris Brown",       "viewer", "active",   "2024-01-25T09:00:00Z"),
];
