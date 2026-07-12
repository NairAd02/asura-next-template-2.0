import { z } from "zod";

export const onboardingSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
