import { beforeEach, describe, expect, it } from "vitest";
import {
  changeVehicleStatusAction,
  createVehicleAction,
  editVehicleAction,
} from "./actions/vehicle.actions";
import { getVehiclesStore, resetVehiclesStore, vehicleSeeds } from "./mock/vehicles.data";
import { createVehicleSchema } from "./schemas/vehicle.schemas";
import {
  changeVehicleStatus,
  createVehicle,
  deleteVehicle,
  editVehicle,
  getAllVehicles,
  getVehicleById,
} from "./services/vehicle.services";
import {
  sanitizeVehicleFilters,
  vehicleFiltersToUrl,
} from "./types/vehicle.types";
import type { CreateVehicleDto } from "./types/vehicle.types";

const messages = {
  plateRequired: "plate-required",
  plateMin: "plate-min",
  plateInvalid: "plate-invalid",
  plateMax: "plate-max",
  vinRequired: "vin-required",
  vinInvalid: "vin-invalid",
  vinMin: "vin-min",
  vinMax: "vin-max",
  makeRequired: "make-required",
  makeMax: "make-max",
  modelRequired: "model-required",
  modelMax: "model-max",
  yearRequired: "year-required",
  yearInvalid: "year-invalid",
  yearRange: "year-range",
  typeInvalid: "type-invalid",
  statusInvalid: "status-invalid",
  assignedDriverMax: "assigned-driver-max",
  branchRequired: "branch-required",
  branchMax: "branch-max",
  odometerInvalid: "odometer-invalid",
  lastInspectionDateInvalid: "last-inspection-date-invalid",
  nextMaintenanceDateInvalid: "next-maintenance-date-invalid",
  notesMax: "notes-max",
};

const validVehicle: CreateVehicleDto = {
  plate: " flt-900 ",
  vin: " vin-fleet900 ",
  make: "  Toyota ",
  model: "  Tacoma ",
  year: 2024,
  type: "truck",
  status: "available",
  assignedDriver: "  Jordan Miles ",
  branch: "  North Depot ",
  odometer: 1200,
  lastInspectionDate: "2026-04-01",
  nextMaintenanceDate: "2026-10-01",
  notes: "  New regional support truck. ",
};

beforeEach(() => {
  resetVehiclesStore();
});

describe("vehicle filters and validation", () => {
  it("sanitizes unsupported query values and preserves supported URL state", () => {
    expect(sanitizeVehicleFilters({
      page: "invalid",
      limit: "7",
      search: "  North  ",
      status: "offline",
      type: "boat",
      sortBy: "unsupported",
      sortOrder: "sideways",
    })).toEqual({
      page: 1,
      limit: 10,
      search: "North",
      sortBy: "plate",
      sortOrder: "asc",
    });

    expect(sanitizeVehicleFilters({
      page: "2",
      limit: "20",
      search: ["  Transit  "],
      status: "maintenance",
      type: "van",
      sortBy: "odometer",
      sortOrder: "desc",
    })).toEqual({
      page: 2,
      limit: 20,
      search: "Transit",
      status: "maintenance",
      type: "van",
      sortBy: "odometer",
      sortOrder: "desc",
    });

    expect(vehicleFiltersToUrl({
      search: "  depot ",
      status: "available",
      type: "suv",
      sortBy: "createdAt",
      sortOrder: "desc",
    })).toEqual({
      search: "depot",
      status: "available",
      type: "suv",
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    expect(vehicleFiltersToUrl({
      search: "   ",
      status: "",
      type: "",
      sortBy: "plate",
      sortOrder: "asc",
    })).toEqual({
      search: undefined,
      status: undefined,
      type: undefined,
      sortBy: "plate",
      sortOrder: "asc",
    });
  });

  it("normalizes schema input and rejects invalid server input without mutation", async () => {
    const parsed = createVehicleSchema(messages).parse(validVehicle);
    expect(parsed).toMatchObject({
      plate: "FLT-900",
      vin: "VIN-FLEET900",
      make: "Toyota",
      model: "Tacoma",
      assignedDriver: "Jordan Miles",
      branch: "North Depot",
      notes: "New regional support truck.",
    });

    expect(() => createVehicleSchema(messages).parse({
      ...validVehicle,
      year: 1980,
      odometer: -1,
      lastInspectionDate: "not-a-date",
    })).toThrow();

    const before = getVehiclesStore().length;
    const response = await createVehicleAction({ plate: "", vin: "bad", year: "nope" });
    expect(response.success).toBe(false);
    if (!response.success) expect(response.error.code).toBe("VALIDATION_ERROR");
    expect(getVehiclesStore()).toHaveLength(before);
  });

  it("queries search, filters, sorting, second pages, and out-of-range pages", async () => {
    const vinMatch = await getAllVehicles({ search: "vin-flt002", limit: 5 });
    expect(vinMatch.vehicles.map((vehicle) => vehicle.id)).toEqual(["vehicle-002"]);

    const branchMatch = await getAllVehicles({ search: "south yard", sortBy: "plate" });
    expect(branchMatch.vehicles.map((vehicle) => vehicle.id)).toEqual(["vehicle-003", "vehicle-008"]);

    const maintenanceTrucks = await getAllVehicles({
      status: "maintenance",
      type: "truck",
      sortBy: "odometer",
      sortOrder: "desc",
    });
    expect(maintenanceTrucks.vehicles.map((vehicle) => vehicle.id)).toEqual(["vehicle-008", "vehicle-003"]);

    const secondPage = await getAllVehicles({ page: 2, limit: 5, sortBy: "plate", sortOrder: "asc" });
    expect(secondPage.pagination).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
    expect(secondPage.vehicles.map((vehicle) => vehicle.plate)).toEqual([
      "FLT-006",
      "FLT-007",
      "FLT-008",
      "FLT-009",
      "FLT-010",
    ]);

    const clampedPage = await getAllVehicles({ page: 20, limit: 5 });
    expect(clampedPage.pagination).toEqual({ page: 3, limit: 5, total: 12, totalPages: 3 });
    expect(clampedPage.vehicles.map((vehicle) => vehicle.plate)).toEqual(["FLT-011", "FLT-012"]);
  });
});

describe("vehicle services", () => {
  it("creates normalized data, keeps it in the live store, and resets deep-cloned seeds", async () => {
    const response = await createVehicle(validVehicle);
    expect(response.success).toBe(true);
    if (!response.success) return;

    expect(response.data).toMatchObject({
      plate: "FLT-900",
      vin: "VIN-FLEET900",
      make: "Toyota",
      model: "Tacoma",
      assignedDriver: "Jordan Miles",
      branch: "North Depot",
      notes: "New regional support truck.",
      createdBy: "mock-user-id",
      updatedBy: null,
    });
    expect(getVehiclesStore().some((vehicle) => vehicle.id === response.data.id)).toBe(true);

    const reset = resetVehiclesStore();
    expect(reset).toHaveLength(12);
    expect(reset).not.toBe(vehicleSeeds);
    expect(reset[0]).not.toBe(vehicleSeeds[0]);
  });

  it("enforces duplicate plate and VIN while allowing an edit to keep its own identifiers", async () => {
    const duplicatePlate = await createVehicle({
      ...validVehicle,
      plate: "  flt-001 ",
      vin: "unique-vin-900",
    });
    expect(duplicatePlate.success).toBe(false);
    if (!duplicatePlate.success) expect(duplicatePlate.error.code).toBe("ALREADY_EXISTS");

    const duplicateVin = await createVehicle({
      ...validVehicle,
      plate: "FLT-901",
      vin: " vin-flt001a ",
    });
    expect(duplicateVin.success).toBe(false);
    if (!duplicateVin.success) expect(duplicateVin.error.code).toBe("ALREADY_EXISTS");

    const ownIdentifiers = await editVehicle("vehicle-001", {
      ...validVehicle,
      plate: " flt-001 ",
      vin: " vin-flt001a ",
      status: "assigned",
      odometer: 19000,
    });
    expect(ownIdentifiers.success).toBe(true);
    if (ownIdentifiers.success) {
      expect(ownIdentifiers.data.plate).toBe("FLT-001");
      expect(ownIdentifiers.data.vin).toBe("VIN-FLT001A");
      expect(ownIdentifiers.data.status).toBe("assigned");
      expect(ownIdentifiers.data.updatedBy).toBe("mock-user-id");
    }

    const otherDuplicate = await editVehicleAction("vehicle-002", {
      ...validVehicle,
      plate: "FLT-001",
      vin: "VIN-FLT002B",
    });
    expect(otherDuplicate.success).toBe(false);
    if (!otherDuplicate.success) expect(otherDuplicate.error.code).toBe("ALREADY_EXISTS");
  });

  it("returns NOT_FOUND consistently and mutates status/delete targets", async () => {
    for (const response of [
      await getVehicleById("missing"),
      await editVehicle("missing", validVehicle),
      await changeVehicleStatus("missing", "retired"),
      await deleteVehicle("missing"),
    ]) {
      expect(response.success).toBe(false);
      if (!response.success) expect(response.error.code).toBe("NOT_FOUND");
    }

    const invalidStatus = await changeVehicleStatusAction("vehicle-001", "offline");
    expect(invalidStatus.success).toBe(false);
    if (!invalidStatus.success) expect(invalidStatus.error.code).toBe("VALIDATION_ERROR");
    expect(getVehiclesStore()[0].status).toBe("available");

    const changed = await changeVehicleStatusAction("vehicle-001", "maintenance");
    expect(changed.success).toBe(true);
    if (changed.success) {
      expect(changed.data.status).toBe("maintenance");
      expect(changed.data.updatedBy).toBe("mock-user-id");
    }

    const deleted = await deleteVehicle("vehicle-001");
    expect(deleted.success).toBe(true);
    expect(getVehiclesStore()).toHaveLength(11);
    const missingAfterDelete = await getVehicleById("vehicle-001");
    expect(missingAfterDelete.success).toBe(false);
  });
});
