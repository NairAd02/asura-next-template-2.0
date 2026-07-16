import "server-only";

import { randomUUID } from "node:crypto";
import type { ServiceResponse } from "@/lib/api-responses";
import { deleteRecord, findById, updateRecord } from "@/lib/mock/in-memory-store";
import { getSuppliersStore } from "../mock/suppliers.data";
import { sanitizeSupplierFilters } from "../types/supplier.types";
import type {
  CreateSupplierDto,
  EditSupplierDto,
  Supplier,
  SupplierDetails,
  SupplierFiltersDto,
  SuppliersResponse,
} from "../types/supplier.types";

const MOCK_USER_ID = "mock-user-id";

function failure<T>(code: string, message: string): ServiceResponse<T> {
  return { success: false, error: { code, message } };
}

function normalizedName(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function duplicateName(name: string, excludedId?: string): boolean {
  const target = normalizedName(name);
  return getSuppliersStore().some(
    (supplier) => supplier.id !== excludedId && normalizedName(supplier.name) === target,
  );
}

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export async function getAllSuppliers(input: unknown = {}): Promise<SuppliersResponse> {
  const filters: SupplierFiltersDto = sanitizeSupplierFilters(input);
  const search = filters.search?.toLocaleLowerCase();
  let suppliers = [...getSuppliersStore()];

  if (search) {
    suppliers = suppliers.filter((supplier) =>
      [supplier.name, supplier.contactName, supplier.email, supplier.phone].some(
        (value) => value?.toLocaleLowerCase().includes(search),
      ),
    );
  }
  if (filters.isActive !== undefined) {
    suppliers = suppliers.filter((supplier) => supplier.isActive === filters.isActive);
  }

  suppliers.sort((left, right) => {
    const comparison = filters.sortBy === "createdAt"
      ? left.createdAt.localeCompare(right.createdAt)
      : left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  const total = suppliers.length;
  const totalPages = Math.ceil(total / filters.limit);
  const page = totalPages > 0 ? Math.min(filters.page, totalPages) : 1;
  const start = (page - 1) * filters.limit;
  return {
    suppliers: suppliers.slice(start, start + filters.limit),
    pagination: {
      page,
      limit: filters.limit,
      total,
      totalPages,
    },
  };
}

export async function getSupplierById(id: string): Promise<ServiceResponse<SupplierDetails>> {
  try {
    const supplier = findById(getSuppliersStore(), id);
    return supplier ? { success: true, data: supplier } : failure("NOT_FOUND", "Supplier not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to get supplier: ${String(error)}`);
  }
}

export async function createSupplier(dto: CreateSupplierDto): Promise<ServiceResponse<SupplierDetails>> {
  try {
    if (duplicateName(dto.name)) return failure("ALREADY_EXISTS", "Supplier name already exists");
    const now = new Date().toISOString();
    const supplier: Supplier = {
      id: randomUUID(),
      name: dto.name.trim(),
      contactName: normalizeOptional(dto.contactName),
      email: dto.email.trim().toLocaleLowerCase(),
      phone: normalizeOptional(dto.phone),
      isActive: dto.isActive ?? true,
      createdBy: MOCK_USER_ID,
      createdAt: now,
      updatedBy: null,
      updatedAt: now,
    };
    getSuppliersStore().push(supplier);
    return { success: true, data: supplier };
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to create supplier: ${String(error)}`);
  }
}

export async function editSupplier(id: string, dto: EditSupplierDto): Promise<ServiceResponse<SupplierDetails>> {
  try {
    if (!findById(getSuppliersStore(), id)) return failure("NOT_FOUND", "Supplier not found");
    if (duplicateName(dto.name, id)) return failure("ALREADY_EXISTS", "Supplier name already exists");
    const updated = updateRecord(getSuppliersStore(), id, {
      name: dto.name.trim(),
      contactName: normalizeOptional(dto.contactName),
      email: dto.email.trim().toLocaleLowerCase(),
      phone: normalizeOptional(dto.phone),
      isActive: dto.isActive ?? true,
      updatedBy: MOCK_USER_ID,
      updatedAt: new Date().toISOString(),
    });
    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Supplier not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to edit supplier: ${String(error)}`);
  }
}

export async function deleteSupplier(id: string): Promise<ServiceResponse<void>> {
  try {
    return deleteRecord(getSuppliersStore(), id)
      ? { success: true, data: undefined }
      : failure("NOT_FOUND", "Supplier not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to delete supplier: ${String(error)}`);
  }
}

export async function toggleSupplierActive(id: string, isActive: boolean): Promise<ServiceResponse<SupplierDetails>> {
  try {
    const updated = updateRecord(getSuppliersStore(), id, {
      isActive,
      updatedBy: MOCK_USER_ID,
      updatedAt: new Date().toISOString(),
    });
    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Supplier not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to toggle supplier: ${String(error)}`);
  }
}
