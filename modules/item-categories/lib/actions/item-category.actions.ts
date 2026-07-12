"use server";

import {
  createItemCategory,
  editItemCategory,
  getAllItemCategories,
  getItemCategoryById,
  deleteItemCategory,
  deleteItemCategoriesBulk,
  toggleItemCategoryActive,
  toggleItemCategoriesBulk,
} from "../services/item-category.services";
import {
  CreateItemCategoryDto,
  ItemCategoryDetails,
  ItemCategoryFiltersDto,
  ItemCategoriesResponse,
  EditItemCategoryDto,
} from "../types/item-category.types";
import type { ServiceResponse } from "@/lib/api-responses";

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getAllItemCategoriesAction(
  options: ItemCategoryFiltersDto = {},
): Promise<ItemCategoriesResponse> {
  return await getAllItemCategories(options);
}

export async function getItemCategoryByIdAction(
  id: string,
) {
  return await getItemCategoryById(id);
}

export async function createItemCategoryAction(
  dto: CreateItemCategoryDto,
  formData: FormData
): Promise<ServiceResponse<ItemCategoryDetails>> {
  return await createItemCategory(dto, formData);
}

export async function editItemCategoryAction(
  itemCategoryId: string,
  dto: EditItemCategoryDto,
  formData?: FormData
): Promise<ServiceResponse<ItemCategoryDetails>> {
  return await editItemCategory(itemCategoryId, dto, formData);
}

export async function deleteItemCategoryAction(
  id: string,
): Promise<ServiceResponse<void>> {
  return await deleteItemCategory(id);
}

export async function deleteItemCategoriesBulkAction(
  ids: string[],
): Promise<ServiceResponse<{ deleted: number; failed: string[] }>> {
  return await deleteItemCategoriesBulk(ids);
}

export async function toggleItemCategoryActiveAction(
  id: string,
  isActive: boolean,
): Promise<ServiceResponse<ItemCategoryDetails>> {
  return await toggleItemCategoryActive(id, isActive);
}

export async function toggleItemCategoriesBulkAction(
  ids: string[],
  isActive: boolean,
): Promise<ServiceResponse<{ updated: number; failed: string[] }>> {
  return await toggleItemCategoriesBulk(ids, isActive);
}
