import type { CreateVehicleOutput, EditVehicleOutput } from "../schemas/vehicle.schemas";

export type VehicleStatus = "available" | "assigned" | "maintenance" | "retired";
export type VehicleType = "sedan" | "suv" | "van" | "truck" | "motorcycle";
export type VehicleSortBy = "plate" | "status" | "year" | "odometer" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface Vehicle {
  id: string;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  assignedDriver: string | null;
  branch: string;
  odometer: number;
  lastInspectionDate: string | null;
  nextMaintenanceDate: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
}

export type VehicleDetails = Vehicle;

export interface CreateVehicleDto {
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  assignedDriver?: string | null;
  branch: string;
  odometer: number;
  lastInspectionDate?: string | null;
  nextMaintenanceDate?: string | null;
  notes?: string | null;
}

export interface EditVehicleDto {
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  assignedDriver?: string | null;
  branch: string;
  odometer: number;
  lastInspectionDate?: string | null;
  nextMaintenanceDate?: string | null;
  notes?: string | null;
}

export interface VehicleFiltersDto {
  page: number;
  limit: number;
  search?: string;
  status?: VehicleStatus;
  type?: VehicleType;
  sortBy: VehicleSortBy;
  sortOrder: SortOrder;
}

export interface VehicleFilters {
  search: string;
  status: VehicleStatus | "";
  type: VehicleType | "";
  sortBy: VehicleSortBy;
  sortOrder: SortOrder;
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VehicleStatusInfo {
  label: string;
  labelKey: string;
  className: string;
}

interface VehicleTypeInfo {
  label: string;
  labelKey: string;
}

const VEHICLE_STATUSES = ["available", "assigned", "maintenance", "retired"] as const;
const VEHICLE_TYPES = ["sedan", "suv", "van", "truck", "motorcycle"] as const;
const ALLOWED_LIMITS = new Set([5, 10, 20, 30]);
const ALLOWED_SORTS = new Set<VehicleSortBy>(["plate", "status", "year", "odometer", "createdAt"]);

const vehicleStatusConfig: Record<VehicleStatus, VehicleStatusInfo> = {
  available: {
    label: "Available",
    labelKey: "statuses.available",
    className: "bg-emerald-100 text-emerald-700",
  },
  assigned: {
    label: "Assigned",
    labelKey: "statuses.assigned",
    className: "bg-sky-100 text-sky-700",
  },
  maintenance: {
    label: "Maintenance",
    labelKey: "statuses.maintenance",
    className: "bg-amber-100 text-amber-700",
  },
  retired: {
    label: "Retired",
    labelKey: "statuses.retired",
    className: "bg-gray-100 text-gray-700",
  },
};

export const vehicleStatusOptions: readonly (VehicleStatusInfo & { value: VehicleStatus })[] =
  VEHICLE_STATUSES.map((value) => ({ value, ...vehicleStatusConfig[value] }));

export const vehicleTypeOptions: readonly (VehicleTypeInfo & { value: VehicleType })[] = [
  { value: "sedan", label: "Sedan", labelKey: "types.sedan" },
  { value: "suv", label: "SUV", labelKey: "types.suv" },
  { value: "van", label: "Van", labelKey: "types.van" },
  { value: "truck", label: "Truck", labelKey: "types.truck" },
  { value: "motorcycle", label: "Motorcycle", labelKey: "types.motorcycle" },
];

export function getVehicleStatusInfo(status: VehicleStatus): VehicleStatusInfo {
  return vehicleStatusConfig[status];
}

function scalar(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(scalar(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isVehicleStatus(value: unknown): value is VehicleStatus {
  return typeof value === "string" && VEHICLE_STATUSES.includes(value as VehicleStatus);
}

function isVehicleType(value: unknown): value is VehicleType {
  return typeof value === "string" && VEHICLE_TYPES.includes(value as VehicleType);
}

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function sanitizeVehicleFilters(input: unknown = {}): VehicleFiltersDto {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const page = positiveInteger(source.page, 1);
  const candidateLimit = positiveInteger(source.limit, 10);
  const rawSearch = scalar(source.search);
  const search = typeof rawSearch === "string" ? rawSearch.trim().slice(0, 200) : "";
  const rawStatus = scalar(source.status);
  const status = isVehicleStatus(rawStatus) ? rawStatus : undefined;
  const rawType = scalar(source.type);
  const type = isVehicleType(rawType) ? rawType : undefined;
  const rawSort = scalar(source.sortBy);
  const sortBy = typeof rawSort === "string" && ALLOWED_SORTS.has(rawSort as VehicleSortBy)
    ? (rawSort as VehicleSortBy)
    : "plate";
  const rawOrder = scalar(source.sortOrder);
  const sortOrder: SortOrder = rawOrder === "desc" ? "desc" : "asc";

  return {
    page,
    limit: ALLOWED_LIMITS.has(candidateLimit) ? candidateLimit : 10,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    sortBy,
    sortOrder,
  };
}

export function vehicleFiltersToUrl(filters: VehicleFilters): Partial<VehicleFiltersDto> {
  return {
    search: filters.search.trim() || undefined,
    status: filters.status || undefined,
    type: filters.type || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}

export function toCreateVehicleDto(input: CreateVehicleOutput): CreateVehicleDto {
  return {
    plate: input.plate.trim().toUpperCase(),
    vin: input.vin.trim().toUpperCase(),
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year,
    type: input.type,
    status: input.status,
    assignedDriver: normalizeOptional(input.assignedDriver),
    branch: input.branch.trim(),
    odometer: input.odometer,
    lastInspectionDate: input.lastInspectionDate,
    nextMaintenanceDate: input.nextMaintenanceDate,
    notes: normalizeOptional(input.notes),
  };
}

export function toEditVehicleDto(input: EditVehicleOutput): EditVehicleDto {
  return {
    plate: input.plate.trim().toUpperCase(),
    vin: input.vin.trim().toUpperCase(),
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year,
    type: input.type,
    status: input.status,
    assignedDriver: normalizeOptional(input.assignedDriver),
    branch: input.branch.trim(),
    odometer: input.odometer,
    lastInspectionDate: input.lastInspectionDate,
    nextMaintenanceDate: input.nextMaintenanceDate,
    notes: normalizeOptional(input.notes),
  };
}
