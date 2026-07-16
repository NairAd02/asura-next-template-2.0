import { z } from "zod";

export interface SupplierValidationMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  emailRequired: string;
  emailInvalid: string;
  emailMax: string;
  contactNameMax: string;
  phoneMax: string;
}

function supplierFields(messages: SupplierValidationMessages) {
  return {
    name: z
      .string({ required_error: messages.nameRequired })
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMin)
      .max(120, messages.nameMax),
    contactName: z.string().trim().max(120, messages.contactNameMax).optional(),
    email: z
      .string({ required_error: messages.emailRequired })
      .trim()
      .min(1, messages.emailRequired)
      .max(254, messages.emailMax)
      .email(messages.emailInvalid)
      .transform((value) => value.toLowerCase()),
    phone: z.string().trim().max(30, messages.phoneMax).optional(),
    isActive: z.boolean().default(true),
  };
}

export const createSupplierSchema = (messages: SupplierValidationMessages) =>
  z.object(supplierFields(messages));

export const editSupplierSchema = (messages: SupplierValidationMessages) =>
  z.object(supplierFields(messages));

export type CreateSupplierInput = z.input<ReturnType<typeof createSupplierSchema>>;
export type CreateSupplierOutput = z.output<ReturnType<typeof createSupplierSchema>>;
export type EditSupplierInput = z.input<ReturnType<typeof editSupplierSchema>>;
export type EditSupplierOutput = z.output<ReturnType<typeof editSupplierSchema>>;
