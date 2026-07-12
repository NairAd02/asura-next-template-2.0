import "server-only";

import type { ServiceResponse } from "@/lib/api-responses";
import {
  queryCollection,
  createRecord,
  updateRecord,
  deleteRecord,
  findById,
} from "@/lib/mock/in-memory-store";
import {
  CreateItemCategoryDto,
  EditItemCategoryDto,
  ItemCategory,
  ItemCategoryDetails,
  ItemCategoryFiltersDto,
  ItemCategoriesResponse,
} from "../types/item-category.types";
import { itemCategoriesStore } from "../mock/item-categories.data";

const MOCK_ACTOR_ID = "mock-user-id-001";
const MOCK_ACTOR_INFO = {
  id: MOCK_ACTOR_ID,
  full_name: "Template Admin",
  email: "admin@template.dev",
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAllItemCategories(
  filters: ItemCategoryFiltersDto = {},
): Promise<ItemCategoriesResponse> {
  const { rows, pagination } = queryCollection({
    data: itemCategoriesStore as unknown as Record<string, unknown>[],
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    search: filters.search,
    searchFields: ["name", "description"] as any,
    filters: {
      isActive: filters.isActive,
    },
    sortBy: filters.sortBy ?? "name",
    sortOrder: filters.sortOrder ?? "asc",
  });

  return {
    itemCategories: rows as unknown as ItemCategory[],
    pagination,
  };
}

export async function getItemCategoryById(
  id: string,
): Promise<ServiceResponse<ItemCategoryDetails | null>> {
  try {
    const record = findById(itemCategoriesStore, id);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get item category: ${error}` } };
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createItemCategory(
  dto: CreateItemCategoryDto,
  formData?: FormData,
): Promise<ServiceResponse<ItemCategoryDetails>> {
  try {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const iconFile = formData?.get("iconCode") as File | null;
    const iconCode = iconFile?.name ?? dto.iconCode ?? null;

    const record: ItemCategory = {
      id,
      name: dto.name,
      description: dto.description ?? null,
      iconCode,
      isActive: dto.isActive ?? true,
      pricingType: dto.pricingType ?? "flat_rate",
      createdBy: MOCK_ACTOR_ID,
      createdAt: now,
      updatedBy: null,
      updatedAt: now,
      createdByUser: MOCK_ACTOR_INFO,
      updatedByUser: null,
    };

    const created = createRecord(itemCategoriesStore, record);
    return { success: true, data: created };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to create item category: ${error}` } };
  }
}

export async function editItemCategory(
  id: string,
  dto: EditItemCategoryDto,
  formData?: FormData,
): Promise<ServiceResponse<ItemCategoryDetails>> {
  try {
    const existing = findById(itemCategoriesStore, id);
    if (!existing) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item category not found" } };
    }

    const iconFile = formData?.get("iconCode") as File | null;
    const iconCode = iconFile?.name
      ?? (dto.iconCode instanceof File ? dto.iconCode.name : dto.iconCode as string | null)
      ?? existing.iconCode;

    const patch: Partial<ItemCategory> = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.pricingType !== undefined && { pricingType: dto.pricingType }),
      iconCode: iconCode ?? null,
      updatedBy: MOCK_ACTOR_ID,
      updatedAt: new Date().toISOString(),
      updatedByUser: MOCK_ACTOR_INFO,
    };

    const updated = updateRecord(itemCategoriesStore, id, patch);
    if (!updated) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item category not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to edit item category: ${error}` } };
  }
}

export async function toggleItemCategoryActive(
  id: string,
  isActive: boolean,
): Promise<ServiceResponse<ItemCategoryDetails>> {
  try {
    const updated = updateRecord(itemCategoriesStore, id, {
      isActive,
      updatedBy: MOCK_ACTOR_ID,
      updatedAt: new Date().toISOString(),
      updatedByUser: MOCK_ACTOR_INFO,
    });
    if (!updated) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item category not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to toggle item category: ${error}` } };
  }
}

export async function deleteItemCategory(
  id: string,
): Promise<ServiceResponse<void>> {
  try {
    const deleted = deleteRecord(itemCategoriesStore, id);
    if (!deleted) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item category not found" } };
    }
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to delete item category: ${error}` } };
  }
}

export async function deleteItemCategoriesBulk(
  ids: string[],
): Promise<ServiceResponse<{ deleted: number; failed: string[] }>> {
  const failed: string[] = [];
  let deleted = 0;

  for (const id of ids) {
    const ok = deleteRecord(itemCategoriesStore, id);
    if (ok) {
      deleted++;
    } else {
      failed.push(id);
    }
  }

  return { success: true, data: { deleted, failed } };
}

export async function toggleItemCategoriesBulk(
  ids: string[],
  isActive: boolean,
): Promise<ServiceResponse<{ updated: number; failed: string[] }>> {
  const failed: string[] = [];
  let updated = 0;
  const now = new Date().toISOString();

  for (const id of ids) {
    const record = updateRecord(itemCategoriesStore, id, {
      isActive,
      updatedBy: MOCK_ACTOR_ID,
      updatedAt: now,
      updatedByUser: MOCK_ACTOR_INFO,
    });
    if (record) {
      updated++;
    } else {
      failed.push(id);
    }
  }

  return { success: true, data: { updated, failed } };
}