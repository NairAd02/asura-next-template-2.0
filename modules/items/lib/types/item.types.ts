// ─── Enums ────────────────────────────────────────────────────────────────────

export type ItemStatus = "active" | "inactive" | "archived";

export const ITEM_STATUS_VALUES: ItemStatus[] = [
  "active",
  "inactive",
  "archived",
];

// ─── Image object ──────────────────────────────────────────────────────────────

export interface ItemImage {
  url: string;
  name: string;
  captured_at: string;
  captured_by: string;
  size_bytes: number;
  mime_type: string;
  note?: string;
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface Item {
  id: string;
  name: string;
  description: string | null;
  itemCategoryId: string | null;
  itemCategoryName: string | null;
  status: ItemStatus;
  images: ItemImage[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemDetails = Item;

export interface ItemsResponse {
  items: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter DTOs ──────────────────────────────────────────────────────────────

export interface SelectedItemCategory {
  id: string;
  label: string;
}

export interface ItemsStats {
  totalItems: number;
  active: number;
  inactive: number;
  archived: number;
}

export interface ItemFilters {
  search: string;
  status: ItemStatus | "";
  itemCategoryId: SelectedItemCategory | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface ItemFiltersDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // filters
  search?: string;
  status?: ItemStatus;
  itemCategoryId?: string;
}

export const convertItemFiltersDto = (
  itemFilters: ItemFilters,
): ItemFiltersDto => {
  return {
    search: itemFilters.search || undefined,
    status: itemFilters.status !== "" ? itemFilters.status : undefined,
    itemCategoryId: itemFilters.itemCategoryId?.id,
    sortBy: itemFilters.sortBy || undefined,
    sortOrder: itemFilters.sortOrder || undefined,
  };
};

// ─── Edit DTO ─────────────────────────────────────────────────────────────────

export interface EditItemDto {
  name?: string;
  description?: string | null;
  itemCategoryId?: string | null;
}

// ─── Change Status DTO ────────────────────────────────────────────────────────

export interface ChangeItemStatusDto {
  status: ItemStatus;
  reason?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export const getItemStatusLabel = (
  status: ItemStatus,
  t?: (key: string) => string
): string => {
  if (t) {
    return t(status);
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};
