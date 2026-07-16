import "server-only";

import { randomUUID } from "node:crypto";
import type { ServiceResponse } from "@/lib/api-responses";
import { deleteRecord, findById, updateRecord } from "@/lib/mock/in-memory-store";
import { getVehiclesStore } from "../mock/vehicles.data";
import { sanitizeVehicleFilters } from "../types/vehicle.types";
import type {
  CreateVehicleDto,
  EditVehicleDto,
  Vehicle,
  VehicleDetails,
  VehicleFiltersDto,
  VehicleStatus,
  VehiclesResponse,
} from "../types/vehicle.types";

const MOCK_USER_ID = "mock-user-id";

function failure<T>(code: string, message: string): ServiceResponse<T> {
  return { success: false, error: { code, message } };
}

function normalizeRegistration(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeText(value: string): string {
  return value.trim();
}

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function duplicatePlate(plate: string, excludedId?: string): boolean {
  const target = normalizeRegistration(plate);
  return getVehiclesStore().some(
    (vehicle) => vehicle.id !== excludedId && normalizeRegistration(vehicle.plate) === target,
  );
}

function duplicateVin(vin: string, excludedId?: string): boolean {
  const target = normalizeRegistration(vin);
  return getVehiclesStore().some(
    (vehicle) => vehicle.id !== excludedId && normalizeRegistration(vehicle.vin) === target,
  );
}

function compareVehicles(left: Vehicle, right: Vehicle, filters: VehicleFiltersDto): number {
  let comparison = 0;

  if (filters.sortBy === "year" || filters.sortBy === "odometer") {
    comparison = left[filters.sortBy] - right[filters.sortBy];
  } else {
    comparison = String(left[filters.sortBy]).localeCompare(String(right[filters.sortBy]), undefined, {
      sensitivity: "base",
    });
  }

  return filters.sortOrder === "asc" ? comparison : -comparison;
}

function matchesSearch(vehicle: Vehicle, search: string): boolean {
  return [
    vehicle.plate,
    vehicle.vin,
    vehicle.make,
    vehicle.model,
    vehicle.assignedDriver,
    vehicle.branch,
  ].some((value) => value?.toLocaleLowerCase().includes(search));
}

export async function getAllVehicles(input: unknown = {}): Promise<VehiclesResponse> {
  const filters: VehicleFiltersDto = sanitizeVehicleFilters(input);
  const search = filters.search?.toLocaleLowerCase();
  let vehicles = [...getVehiclesStore()];

  if (search) {
    vehicles = vehicles.filter((vehicle) => matchesSearch(vehicle, search));
  }
  if (filters.status) {
    vehicles = vehicles.filter((vehicle) => vehicle.status === filters.status);
  }
  if (filters.type) {
    vehicles = vehicles.filter((vehicle) => vehicle.type === filters.type);
  }

  vehicles.sort((left, right) => compareVehicles(left, right, filters));

  const total = vehicles.length;
  const totalPages = Math.ceil(total / filters.limit);
  const page = totalPages > 0 ? Math.min(filters.page, totalPages) : 1;
  const start = (page - 1) * filters.limit;

  return {
    vehicles: vehicles.slice(start, start + filters.limit),
    pagination: {
      page,
      limit: filters.limit,
      total,
      totalPages,
    },
  };
}

export async function getVehicleById(id: string): Promise<ServiceResponse<VehicleDetails>> {
  try {
    const vehicle = findById(getVehiclesStore(), id);
    return vehicle ? { success: true, data: vehicle } : failure("NOT_FOUND", "Vehicle not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to get vehicle: ${String(error)}`);
  }
}

export async function createVehicle(dto: CreateVehicleDto): Promise<ServiceResponse<VehicleDetails>> {
  try {
    if (duplicatePlate(dto.plate)) return failure("ALREADY_EXISTS", "Vehicle plate already exists");
    if (duplicateVin(dto.vin)) return failure("ALREADY_EXISTS", "Vehicle VIN already exists");

    const now = new Date().toISOString();
    const vehicle: Vehicle = {
      id: randomUUID(),
      plate: normalizeRegistration(dto.plate),
      vin: normalizeRegistration(dto.vin),
      make: normalizeText(dto.make),
      model: normalizeText(dto.model),
      year: dto.year,
      type: dto.type,
      status: dto.status,
      assignedDriver: normalizeOptional(dto.assignedDriver),
      branch: normalizeText(dto.branch),
      odometer: dto.odometer,
      lastInspectionDate: dto.lastInspectionDate ?? null,
      nextMaintenanceDate: dto.nextMaintenanceDate ?? null,
      notes: normalizeOptional(dto.notes),
      createdBy: MOCK_USER_ID,
      createdAt: now,
      updatedBy: null,
      updatedAt: now,
    };

    getVehiclesStore().push(vehicle);
    return { success: true, data: vehicle };
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to create vehicle: ${String(error)}`);
  }
}

export async function editVehicle(id: string, dto: EditVehicleDto): Promise<ServiceResponse<VehicleDetails>> {
  try {
    if (!findById(getVehiclesStore(), id)) return failure("NOT_FOUND", "Vehicle not found");
    if (duplicatePlate(dto.plate, id)) return failure("ALREADY_EXISTS", "Vehicle plate already exists");
    if (duplicateVin(dto.vin, id)) return failure("ALREADY_EXISTS", "Vehicle VIN already exists");

    const updated = updateRecord(getVehiclesStore(), id, {
      plate: normalizeRegistration(dto.plate),
      vin: normalizeRegistration(dto.vin),
      make: normalizeText(dto.make),
      model: normalizeText(dto.model),
      year: dto.year,
      type: dto.type,
      status: dto.status,
      assignedDriver: normalizeOptional(dto.assignedDriver),
      branch: normalizeText(dto.branch),
      odometer: dto.odometer,
      lastInspectionDate: dto.lastInspectionDate ?? null,
      nextMaintenanceDate: dto.nextMaintenanceDate ?? null,
      notes: normalizeOptional(dto.notes),
      updatedBy: MOCK_USER_ID,
      updatedAt: new Date().toISOString(),
    });

    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Vehicle not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to edit vehicle: ${String(error)}`);
  }
}

export async function deleteVehicle(id: string): Promise<ServiceResponse<void>> {
  try {
    return deleteRecord(getVehiclesStore(), id)
      ? { success: true, data: undefined }
      : failure("NOT_FOUND", "Vehicle not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to delete vehicle: ${String(error)}`);
  }
}

export async function changeVehicleStatus(
  id: string,
  status: VehicleStatus,
): Promise<ServiceResponse<VehicleDetails>> {
  try {
    const updated = updateRecord(getVehiclesStore(), id, {
      status,
      updatedBy: MOCK_USER_ID,
      updatedAt: new Date().toISOString(),
    });
    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Vehicle not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to change vehicle status: ${String(error)}`);
  }
}
