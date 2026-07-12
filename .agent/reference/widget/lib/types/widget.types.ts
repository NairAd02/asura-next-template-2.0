// ─── Domain types ─────────────────────────────────────────────────────────────

export type WidgetType = "type_a" | "type_b";

// ─── Enum Helpers ─────────────────────────────────────────────────────────────

export const widgetTypeConfig: Record<WidgetType, { label: string; className: string }> = {
  type_a: { label: "Type A", className: "text-blue-600 bg-blue-100" },
  type_b: { label: "Type B", className: "text-green-600 bg-green-100" },
};

export const getWidgetTypeInfo = (type: WidgetType) =>
  widgetTypeConfig[type] || { label: type, className: "text-gray-600 bg-gray-100" };

// ─── Interfaces de entidad ────────────────────────────────────────────────────

export interface UserInfo {
  id: string;
  full_name: string;
  email: string;
}

export interface Widget {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  type: WidgetType;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  createdByUser: UserInfo | null;
  updatedByUser: UserInfo | null;
}

export interface WidgetDetails extends Widget {}

// ─── Response types ───────────────────────────────────────────────────────────

export interface WidgetsResponse {
  widgets: Widget[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter DTOs ──────────────────────────────────────────────────────────────

export interface WidgetFilters {
  search: string;
  isActive: boolean | ""; // "" means no filter
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface WidgetFiltersDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

export const convertWidgetFiltersDto = (filters: WidgetFilters): WidgetFiltersDto => ({
  search: filters.search || undefined,
  isActive: filters.isActive !== "" ? filters.isActive : undefined,
  sortBy: filters.sortBy || undefined,
  sortOrder: filters.sortOrder || undefined,
});

// ─── Create DTO ───────────────────────────────────────────────────────────────

export interface CreateWidgetDto {
  name: string;
  description?: string | null;
  isActive?: boolean;
  type?: WidgetType;
}

export const convertCreateWidgetDto = (schema: any): CreateWidgetDto => ({
  name: typeof schema.name === "string" ? schema.name.trim() : "",
  description: typeof schema.description === "string" ? schema.description.trim() || null : null,
  isActive: schema.isActive !== undefined ? schema.isActive : true,
  type: schema.type ?? "type_a",
});

// ─── Edit DTO ─────────────────────────────────────────────────────────────────

export interface EditWidgetDto {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  type?: WidgetType;
}

export const convertEditWidgetDto = (schema: any): EditWidgetDto => ({
  name: typeof schema.name === "string" ? schema.name.trim() : undefined,
  description: typeof schema.description === "string" ? schema.description.trim() || null : undefined,
  isActive: schema.isActive !== undefined ? schema.isActive : undefined,
  type: schema.type !== undefined ? schema.type : undefined,
});
