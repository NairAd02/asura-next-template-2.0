// ─── Domain types ─────────────────────────────────────────────────────────────

export type ItemPricingType = "flat_rate" | "unit_based";

// ─── Enum Helpers ────────────────────────────────────────────────────────────

export const pricingTypeConfig: Record<
  ItemPricingType,
  { label: string; className: string }
> = {
  flat_rate: {
    label: "Flat Rate",
    className: "text-green-600 bg-green-100",
  },
  unit_based: {
    label: "Unit Based",
    className: "text-blue-600 bg-blue-100",
  },
};

export const getPricingTypeInfo = (pricingType: ItemPricingType) => {
  return (
    pricingTypeConfig[pricingType] || {
      label: pricingType,
      className: "text-gray-600 bg-gray-100",
    }
  );
};

export const getPricingTypeLabel = (
  pricingType: ItemPricingType,
  t?: (key: string) => string
) => {
  if (t) {
    return t(pricingType);
  }
  return getPricingTypeInfo(pricingType).label;
};

export interface UserInfo {
  id: string;
  full_name: string;
  email: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  description: string | null;
  iconCode: string | null;
  isActive: boolean;
  pricingType: ItemPricingType;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  createdByUser: UserInfo | null;
  updatedByUser: UserInfo | null;
}

export type ItemCategoryDetails = ItemCategory;

export interface ItemCategoriesResponse {
  itemCategories: ItemCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter DTOs ──────────────────────────────────────────────────────────────

export interface ItemCategoryFilters {
  search: string;
  isActive: boolean | ""; // "" means no filter
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface ItemCategoryFiltersDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // filters
  search?: string;
  isActive?: boolean;
}

export const convertItemCategoryFiltersDto = (
  itemCategoryFilters: ItemCategoryFilters,
): ItemCategoryFiltersDto => {
  return {
    search: itemCategoryFilters.search || undefined,
    isActive: itemCategoryFilters.isActive !== "" ? itemCategoryFilters.isActive : undefined,
    sortBy: itemCategoryFilters.sortBy || undefined,
    sortOrder: itemCategoryFilters.sortOrder || undefined,
  };
};

// ─── Flat-rate rule DTO ────────────────────────────────────────────────────────

export interface FlatRateRuleDto {
  price: number;
  currency: string;
}

// ─── Unit-based rule DTO ───────────────────────────────────────────────────────

export interface UnitBasedRuleDto {
  price: number;
  currency: string;
}

// ─── Create DTO ───────────────────────────────────────────────────────────────

export interface CreateItemCategoryDto {
  name: string;
  description?: string | null;
  iconCode?: string | null;
  isActive?: boolean;
  pricingType?: ItemPricingType;
  flatRateRule?: FlatRateRuleDto;
  unitBasedRule?: UnitBasedRuleDto;
}

export const convertCreateItemCategoryDto = (
  schema: any,
): CreateItemCategoryDto => {
  return {
    name: typeof schema.name === 'string' ? schema.name.trim() : '',
    description: typeof schema.description === 'string' ? schema.description.trim() || null : null,
    iconCode: typeof schema.iconCode === 'string' ? schema.iconCode.trim() || null : null,
    isActive: schema.isActive !== undefined ? schema.isActive : true,
    pricingType: schema.pricingType ?? 'flat_rate',
    flatRateRule: schema.flatRateRule ?? undefined,
    unitBasedRule: schema.unitBasedRule ?? undefined,
  };
};

// ─── Edit DTO ─────────────────────────────────────────────────────────────────

export interface EditItemCategoryDto {
  name?: string;
  description?: string | null;
  iconCode?: File | string | null;
  isActive?: boolean;
  pricingType?: ItemPricingType;
  flatRateRule?: FlatRateRuleDto;
  unitBasedRule?: UnitBasedRuleDto;
}

export const convertEditItemCategoryDto = (
  schema: any,
): EditItemCategoryDto => {
  return {
    name: typeof schema.name === 'string' ? schema.name.trim() : undefined,
    description: typeof schema.description === 'string' ? schema.description.trim() || null : undefined,
    iconCode: schema.iconCode,
    isActive: schema.isActive !== undefined ? schema.isActive : undefined,
    pricingType: schema.pricingType !== undefined ? schema.pricingType : undefined,
    flatRateRule: schema.flatRateRule ?? undefined,
    unitBasedRule: schema.unitBasedRule ?? undefined,
  };
};
