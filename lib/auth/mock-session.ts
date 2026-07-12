import "server-only";

// ─── Mock Session ─────────────────────────────────────────────────────────────
// Placeholder for the auth layer (implemented in a future iteration).
// Replace this module with a real session provider (e.g. NextAuth, Auth.js)
// when adding authentication to a project derived from this template.

export interface MockActor {
  userId: string;
  email: string;
  fullName: string;
}

const MOCK_USER: MockActor = {
  userId: "mock-user-id-001",
  email: "admin@template.dev",
  fullName: "Template Admin",
};

export async function getCurrentActor(): Promise<{ userId: string | null }> {
  return { userId: MOCK_USER.userId };
}

export async function getMockUser(): Promise<MockActor> {
  return MOCK_USER;
}
