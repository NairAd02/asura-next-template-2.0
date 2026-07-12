import { z } from "zod";

export const editUserSchema = z.object({
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"]),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
