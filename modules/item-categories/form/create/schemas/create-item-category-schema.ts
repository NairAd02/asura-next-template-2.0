import { z } from "zod";

const priceRuleSchema = z.object({
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0),
  currency: z.string().min(1, "Currency is required"),
});

export const createItemCategorySchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().or(z.literal("")),
    iconCode: z.instanceof(File).optional().or(z.literal("")),
    isActive: z.boolean().default(true),
    pricingType: z.enum(["flat_rate", "unit_based"]).default("flat_rate"),
    flatRateRule: priceRuleSchema.optional(),
    unitBasedRule: priceRuleSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricingType === "flat_rate") {
      if (!data.flatRateRule || data.flatRateRule.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A price greater than 0 is required for flat rate pricing.",
          path: ["flatRateRule", "price"],
        });
      }
      if (!data.flatRateRule?.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required for flat rate pricing.",
          path: ["flatRateRule", "currency"],
        });
      }
    }
    if (data.pricingType === "unit_based") {
      if (!data.unitBasedRule || data.unitBasedRule.price < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A price is required for unit-based pricing.",
          path: ["unitBasedRule", "price"],
        });
      }
      if (!data.unitBasedRule?.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required for unit-based pricing.",
          path: ["unitBasedRule", "currency"],
        });
      }
    }
  });

export type CreateItemCategorySchema = z.infer<typeof createItemCategorySchema>;
export type PriceRuleSchema = z.infer<typeof priceRuleSchema>;
