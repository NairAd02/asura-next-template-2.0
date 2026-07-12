import { z } from "zod";

export const createWidgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  type: z.enum(["type_a", "type_b"]).default("type_a"),
});

export type CreateWidgetSchema = z.infer<typeof createWidgetSchema>;
