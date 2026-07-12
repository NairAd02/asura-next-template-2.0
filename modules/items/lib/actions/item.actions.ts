"use server";

import {
  getAllItems,
  getItemById,
  editItem,
  changeItemStatus,
  getItemsStats,
} from "../services/item.services";
import {
  ChangeItemStatusDto,
  EditItemDto,
  ItemDetails,
  ItemFiltersDto,
  ItemsResponse,
  ItemsStats,
} from "../types/item.types";
import type { ServiceResponse } from "@/lib/api-responses";

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getAllItemsAction(
  options: ItemFiltersDto = {},
): Promise<ItemsResponse> {
  try {
    return await getAllItems(options);
  } catch (error) {
    throw new Error(`Failed to get items: ${error}`);
  }
}

export async function getItemByIdAction(
  id: string,
): Promise<ItemDetails> {
  try {
    const response = await getItemById(id);
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to get item");
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get item: ${error}`);
  }
}

export async function editItemAction(
  itemId: string,
  dto: EditItemDto,
  formData?: FormData,
): Promise<ServiceResponse<ItemDetails>> {
  return await editItem(itemId, dto, formData);
}

export async function getItemsStatsAction(): Promise<ItemsStats> {
  try {
    const response = await getItemsStats();
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to get items stats");
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get items stats: ${error}`);
  }
}

export async function changeItemStatusAction(
  itemId: string,
  dto: ChangeItemStatusDto,
): Promise<ServiceResponse<ItemDetails>> {
  return await changeItemStatus(itemId, dto);
}
