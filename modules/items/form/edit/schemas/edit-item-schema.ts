import { z } from "zod";

export const editItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  itemCategoryId: z.string().optional().or(z.literal("")),
  images: z.array(z.instanceof(File)).default([]),
});

export type EditItemSchema = z.infer<typeof editItemSchema>;
