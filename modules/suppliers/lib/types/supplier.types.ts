import type { CreateSupplierInput, EditSupplierInput } from "../schemas/supplier.schemas";

export type SupplierSortBy = "name" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
}

export type SupplierDetails = Supplier;

export interface CreateSupplierDto {
  name: string;
  contactName?: string | null;
  email: string;
  phone?: string | null;
  isActive?: boolean;
}

export interface EditSupplierDto {
  name: string;
  contactName?: string | null;
  email: string;
  phone?: string | null;
  isActive?: boolean;
}

export interface SupplierFiltersDto {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy: SupplierSortBy;
  sortOrder: SortOrder;
}

export interface SupplierFilters {
  search: string;
  isActive: boolean | "";
  sortBy: SupplierSortBy;
  sortOrder: SortOrder;
}

export interface SuppliersResponse {
  suppliers: Supplier[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ALLOWED_LIMITS = new Set([5, 10, 20, 30]);
const ALLOWED_SORTS = new Set<SupplierSortBy>(["name", "createdAt"]);

function scalar(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(scalar(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function sanitizeSupplierFilters(input: unknown = {}): SupplierFiltersDto {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const page = positiveInteger(source.page, 1);
  const candidateLimit = positiveInteger(source.limit, 10);
  const rawSearch = scalar(source.search);
  const search = typeof rawSearch === "string" ? rawSearch.trim().slice(0, 200) : "";
  const rawActive = scalar(source.isActive);
  const isActive = rawActive === true || rawActive === "true"
    ? true
    : rawActive === false || rawActive === "false"
      ? false
      : undefined;
  const rawSort = scalar(source.sortBy);
  const sortBy = typeof rawSort === "string" && ALLOWED_SORTS.has(rawSort as SupplierSortBy)
    ? (rawSort as SupplierSortBy)
    : "name";
  const rawOrder = scalar(source.sortOrder);
  const sortOrder: SortOrder = rawOrder === "desc" ? "desc" : "asc";

  return {
    page,
    limit: ALLOWED_LIMITS.has(candidateLimit) ? candidateLimit : 10,
    ...(search ? { search } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    sortBy,
    sortOrder,
  };
}

export function supplierFiltersToUrl(filters: SupplierFilters): Partial<SupplierFiltersDto> {
  return {
    search: filters.search.trim() || undefined,
    isActive: filters.isActive === "" ? undefined : filters.isActive,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}

export function toCreateSupplierDto(input: CreateSupplierInput): CreateSupplierDto {
  return {
    name: input.name,
    email: input.email,
    contactName: input.contactName || null,
    phone: input.phone || null,
    isActive: input.isActive,
  };
}

export function toEditSupplierDto(input: EditSupplierInput): EditSupplierDto {
  return {
    name: input.name,
    email: input.email,
    contactName: input.contactName || null,
    phone: input.phone || null,
    isActive: input.isActive,
  };
}
