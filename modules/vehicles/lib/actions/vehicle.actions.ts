"use server";

import { z } from "zod";
import type { ServiceResponse } from "@/lib/api-responses";
import { createVehicleSchema, editVehicleSchema } from "../schemas/vehicle.schemas";
import {
  changeVehicleStatus,
  createVehicle,
  deleteVehicle,
  editVehicle,
  getAllVehicles,
  getVehicleById,
} from "../services/vehicle.services";
import { toCreateVehicleDto, toEditVehicleDto } from "../types/vehicle.types";
import type { VehicleDetails, VehiclesResponse } from "../types/vehicle.types";

const SERVER_MESSAGES = {
  plateRequired: "PLATE_REQUIRED",
  plateMin: "PLATE_MIN",
  plateInvalid: "PLATE_INVALID",
  plateMax: "PLATE_MAX",
  vinRequired: "VIN_REQUIRED",
  vinInvalid: "VIN_INVALID",
  vinMin: "VIN_MIN",
  vinMax: "VIN_MAX",
  makeRequired: "MAKE_REQUIRED",
  makeMax: "MAKE_MAX",
  modelRequired: "MODEL_REQUIRED",
  modelMax: "MODEL_MAX",
  yearRequired: "YEAR_REQUIRED",
  yearInvalid: "YEAR_INVALID",
  yearRange: "YEAR_RANGE",
  typeInvalid: "TYPE_INVALID",
  statusInvalid: "STATUS_INVALID",
  assignedDriverMax: "ASSIGNED_DRIVER_MAX",
  branchRequired: "BRANCH_REQUIRED",
  branchMax: "BRANCH_MAX",
  odometerInvalid: "ODOMETER_INVALID",
  lastInspectionDateInvalid: "LAST_INSPECTION_DATE_INVALID",
  nextMaintenanceDateInvalid: "NEXT_MAINTENANCE_DATE_INVALID",
  notesMax: "NOTES_MAX",
};

const VEHICLE_STATUSES = ["available", "assigned", "maintenance", "retired"] as const;
const idSchema = z.string().trim().min(1);
const statusSchema = z.enum(VEHICLE_STATUSES);

function validationFailure(issues: z.ZodIssue[]): ServiceResponse<never> {
  return {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid vehicle data",
      details: {
        issues: issues.map((issue) => ({ path: issue.path.join("."), code: issue.message })),
      },
    },
  };
}

export async function getAllVehiclesAction(filters: unknown = {}): Promise<VehiclesResponse> {
  return await getAllVehicles(filters);
}

export async function getVehicleByIdAction(id: string): Promise<ServiceResponse<VehicleDetails>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await getVehicleById(parsed.data) : validationFailure(parsed.error.issues);
}

export async function createVehicleAction(input: unknown): Promise<ServiceResponse<VehicleDetails>> {
  const parsed = createVehicleSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await createVehicle(toCreateVehicleDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function editVehicleAction(id: string, input: unknown): Promise<ServiceResponse<VehicleDetails>> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error.issues);

  const parsed = editVehicleSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await editVehicle(parsedId.data, toEditVehicleDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function deleteVehicleAction(id: string): Promise<ServiceResponse<void>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await deleteVehicle(parsed.data) : validationFailure(parsed.error.issues);
}

export async function changeVehicleStatusAction(
  id: string,
  status: unknown,
): Promise<ServiceResponse<VehicleDetails>> {
  const parsed = z.object({ id: idSchema, status: statusSchema }).safeParse({ id, status });
  return parsed.success
    ? await changeVehicleStatus(parsed.data.id, parsed.data.status)
    : validationFailure(parsed.error.issues);
}
