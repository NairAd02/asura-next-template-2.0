import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "editor", "viewer"]),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional().or(z.literal("")),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"]),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
