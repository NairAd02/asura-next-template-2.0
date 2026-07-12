import "server-only";

import type { ServiceResponse } from "@/lib/api-responses";
import {
  queryCollection,
  updateRecord,
  findById,
} from "@/lib/mock/in-memory-store";
import {
  ChangeItemStatusDto,
  EditItemDto,
  Item,
  ItemDetails,
  ItemFiltersDto,
  ItemsResponse,
  ItemsStats,
} from "../types/item.types";
import { itemsStore } from "../mock/items.data";

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAllItems(
  filters: ItemFiltersDto = {},
): Promise<ItemsResponse> {
  const { rows, pagination } = queryCollection({
    data: itemsStore as unknown as Record<string, unknown>[],
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    search: filters.search,
    searchFields: ["name", "description", "itemCategoryName"] as any,
    filters: {
      status: filters.status,
      itemCategoryId: filters.itemCategoryId,
    },
    sortBy: filters.sortBy ?? "name",
    sortOrder: filters.sortOrder ?? "asc",
  });

  return {
    items: rows as unknown as Item[],
    pagination,
  };
}

export async function getItemById(
  id: string,
): Promise<ServiceResponse<ItemDetails | null>> {
  try {
    const record = findById(itemsStore, id);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get item: ${error}` } };
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function editItem(
  id: string,
  dto: EditItemDto,
  _formData?: FormData,
): Promise<ServiceResponse<ItemDetails>> {
  try {
    const existing = findById(itemsStore, id);
    if (!existing) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item not found" } };
    }

    const patch: Partial<Item> = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.itemCategoryId !== undefined && { itemCategoryId: dto.itemCategoryId }),
      updatedAt: new Date().toISOString(),
    };

    const updated = updateRecord(itemsStore, id, patch);
    if (!updated) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to edit item: ${error}` } };
  }
}

export async function changeItemStatus(
  id: string,
  dto: ChangeItemStatusDto,
): Promise<ServiceResponse<ItemDetails>> {
  try {
    const updated = updateRecord(itemsStore, id, {
      status: dto.status,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return { success: false, error: { code: "NOT_FOUND", message: "Item not found" } };
    }
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to change item status: ${error}` } };
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getItemsStats(): Promise<ServiceResponse<ItemsStats>> {
  try {
    const totalItems = itemsStore.length;
    const active = itemsStore.filter((i) => i.status === "active").length;
    const inactive = itemsStore.filter((i) => i.status === "inactive").length;
    const archived = itemsStore.filter((i) => i.status === "archived").length;

    return {
      success: true,
      data: { totalItems, active, inactive, archived },
    };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: `Failed to get items stats: ${error}` } };
  }
}
