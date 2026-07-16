"use server";

import { z } from "zod";
import type { ServiceResponse } from "@/lib/api-responses";
import { createSupplierSchema, editSupplierSchema } from "../schemas/supplier.schemas";
import {
  createSupplier,
  deleteSupplier,
  editSupplier,
  getAllSuppliers,
  getSupplierById,
  toggleSupplierActive,
} from "../services/supplier.services";
import { toCreateSupplierDto, toEditSupplierDto } from "../types/supplier.types";
import type { SupplierDetails, SuppliersResponse } from "../types/supplier.types";

const SERVER_MESSAGES = {
  nameRequired: "NAME_REQUIRED",
  nameMin: "NAME_MIN",
  nameMax: "NAME_MAX",
  emailRequired: "EMAIL_REQUIRED",
  emailInvalid: "EMAIL_INVALID",
  emailMax: "EMAIL_MAX",
  contactNameMax: "CONTACT_NAME_MAX",
  phoneMax: "PHONE_MAX",
};

const idSchema = z.string().trim().min(1);

function validationFailure(issues: z.ZodIssue[]): ServiceResponse<never> {
  return {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid supplier data",
      details: {
        issues: issues.map((issue) => ({ path: issue.path.join("."), code: issue.message })),
      },
    },
  };
}

export async function getAllSuppliersAction(filters: unknown = {}): Promise<SuppliersResponse> {
  return await getAllSuppliers(filters);
}

export async function getSupplierByIdAction(id: string): Promise<ServiceResponse<SupplierDetails>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await getSupplierById(parsed.data) : validationFailure(parsed.error.issues);
}

export async function createSupplierAction(input: unknown): Promise<ServiceResponse<SupplierDetails>> {
  const parsed = createSupplierSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await createSupplier(toCreateSupplierDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function editSupplierAction(id: string, input: unknown): Promise<ServiceResponse<SupplierDetails>> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error.issues);
  const parsed = editSupplierSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await editSupplier(parsedId.data, toEditSupplierDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function deleteSupplierAction(id: string): Promise<ServiceResponse<void>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await deleteSupplier(parsed.data) : validationFailure(parsed.error.issues);
}

export async function toggleSupplierActiveAction(id: string, isActive: unknown): Promise<ServiceResponse<SupplierDetails>> {
  const parsed = z.object({ id: idSchema, isActive: z.boolean() }).safeParse({ id, isActive });
  return parsed.success
    ? await toggleSupplierActive(parsed.data.id, parsed.data.isActive)
    : validationFailure(parsed.error.issues);
}
