import { z } from "zod";

export const editWidgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
  type: z.enum(["type_a", "type_b"]),
});

export type EditWidgetSchema = z.infer<typeof editWidgetSchema>;
