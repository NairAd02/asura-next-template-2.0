import { z } from "zod";

export interface VehicleValidationMessages {
  plateRequired: string;
  plateMin?: string;
  plateInvalid?: string;
  plateMax: string;
  vinRequired: string;
  vinInvalid?: string;
  vinMin: string;
  vinMax: string;
  makeRequired: string;
  makeMax: string;
  modelRequired: string;
  modelMax: string;
  yearRequired: string;
  yearInvalid: string;
  yearRange?: string;
  typeInvalid: string;
  statusInvalid: string;
  assignedDriverMax: string;
  branchRequired: string;
  branchMax: string;
  odometerInvalid: string;
  dateInvalid?: string;
  lastInspectionDateInvalid?: string;
  nextMaintenanceDateInvalid?: string;
  notesMax: string;
}

const VEHICLE_STATUSES = ["available", "assigned", "maintenance", "retired"] as const;
const VEHICLE_TYPES = ["sedan", "suv", "van", "truck", "motorcycle"] as const;
const PLATE_PATTERN = /^[A-Z0-9][A-Z0-9 -]{1,15}$/;
const VIN_PATTERN = /^[A-Z0-9-]+$/;
const MIN_FLEET_YEAR = 1990;

function blankToUndefined(value: unknown): unknown {
  return value === "" ? undefined : value;
}

function trimEnumValue(value: unknown): unknown {
  return typeof value === "string" ? value.trim() : value;
}

function optionalText(max: number, message: string) {
  return z
    .preprocess(
      (value) => value ?? "",
      z.string({ invalid_type_error: message }).trim().max(max, message),
    )
    .transform((value) => value || null);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function optionalDate(message: string) {
  return z
    .preprocess(
      (value) => value ?? "",
      z.string({ invalid_type_error: message }).trim(),
    )
    .transform((value) => value || null)
    .refine((value) => value === null || isIsoDate(value), message);
}

function vehicleFields(messages: VehicleValidationMessages) {
  const maxYear = new Date().getFullYear() + 1;
  const plateMin = messages.plateMin ?? messages.plateRequired;
  const plateInvalid = messages.plateInvalid ?? plateMin;
  const vinInvalid = messages.vinInvalid ?? messages.vinMin;
  const yearRange = messages.yearRange ?? messages.yearInvalid;
  const lastInspectionDateInvalid = messages.lastInspectionDateInvalid ?? messages.dateInvalid ?? messages.yearInvalid;
  const nextMaintenanceDateInvalid = messages.nextMaintenanceDateInvalid ?? messages.dateInvalid ?? messages.yearInvalid;

  return {
    plate: z
      .string({ required_error: messages.plateRequired, invalid_type_error: messages.plateRequired })
      .trim()
      .min(1, messages.plateRequired)
      .min(2, plateMin)
      .max(16, messages.plateMax)
      .transform((value) => value.toUpperCase())
      .refine((value) => PLATE_PATTERN.test(value), plateInvalid),
    vin: z
      .string({ required_error: messages.vinRequired, invalid_type_error: messages.vinRequired })
      .trim()
      .min(1, messages.vinRequired)
      .transform((value) => value.toUpperCase())
      .refine((value) => VIN_PATTERN.test(value), vinInvalid)
      .refine((value) => value.length >= 6, messages.vinMin)
      .refine((value) => value.length <= 17, messages.vinMax),
    make: z
      .string({ required_error: messages.makeRequired, invalid_type_error: messages.makeRequired })
      .trim()
      .min(1, messages.makeRequired)
      .max(80, messages.makeMax),
    model: z
      .string({ required_error: messages.modelRequired, invalid_type_error: messages.modelRequired })
      .trim()
      .min(1, messages.modelRequired)
      .max(80, messages.modelMax),
    year: z.preprocess(
      blankToUndefined,
      z
        .coerce
        .number({ required_error: messages.yearRequired, invalid_type_error: messages.yearRequired })
        .int(messages.yearInvalid)
        .min(MIN_FLEET_YEAR, yearRange)
        .max(maxYear, yearRange),
    ),
    type: z.preprocess(
      trimEnumValue,
      z.enum(VEHICLE_TYPES, {
        required_error: messages.typeInvalid,
        invalid_type_error: messages.typeInvalid,
      }),
    ),
    status: z.preprocess(
      trimEnumValue,
      z.enum(VEHICLE_STATUSES, {
        required_error: messages.statusInvalid,
        invalid_type_error: messages.statusInvalid,
      }),
    ),
    assignedDriver: optionalText(120, messages.assignedDriverMax),
    branch: z
      .string({ required_error: messages.branchRequired, invalid_type_error: messages.branchRequired })
      .trim()
      .min(1, messages.branchRequired)
      .max(120, messages.branchMax),
    odometer: z.preprocess(
      blankToUndefined,
      z
        .coerce
        .number({ required_error: messages.odometerInvalid, invalid_type_error: messages.odometerInvalid })
        .int(messages.odometerInvalid)
        .min(0, messages.odometerInvalid),
    ),
    lastInspectionDate: optionalDate(lastInspectionDateInvalid),
    nextMaintenanceDate: optionalDate(nextMaintenanceDateInvalid),
    notes: optionalText(500, messages.notesMax),
  };
}

export const createVehicleSchema = (messages: VehicleValidationMessages) =>
  z.object(vehicleFields(messages));

export const editVehicleSchema = (messages: VehicleValidationMessages) =>
  z.object(vehicleFields(messages));

export type CreateVehicleInput = z.input<ReturnType<typeof createVehicleSchema>>;
export type CreateVehicleOutput = z.output<ReturnType<typeof createVehicleSchema>>;
export type EditVehicleInput = z.input<ReturnType<typeof editVehicleSchema>>;
export type EditVehicleOutput = z.output<ReturnType<typeof editVehicleSchema>>;
