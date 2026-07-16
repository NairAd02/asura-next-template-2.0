import { beforeEach, describe, expect, it } from "vitest";
import {
  createSupplierAction,
  editSupplierAction,
} from "./actions/supplier.actions";
import { getSuppliersStore, resetSuppliersStore, supplierSeeds } from "./mock/suppliers.data";
import { createSupplierSchema } from "./schemas/supplier.schemas";
import {
  createSupplier,
  deleteSupplier,
  editSupplier,
  getAllSuppliers,
  getSupplierById,
  toggleSupplierActive,
} from "./services/supplier.services";
import {
  sanitizeSupplierFilters,
  supplierFiltersToUrl,
} from "./types/supplier.types";

const messages = {
  nameRequired: "name-required",
  nameMin: "name-min",
  nameMax: "name-max",
  emailRequired: "email-required",
  emailInvalid: "email-invalid",
  emailMax: "email-max",
  contactNameMax: "contact-max",
  phoneMax: "phone-max",
};

beforeEach(() => {
  resetSuppliersStore();
});

describe("supplier filters and validation", () => {
  it("sanitizes unsupported query values while preserving explicit false", () => {
    expect(sanitizeSupplierFilters({
      page: "invalid",
      limit: "7",
      search: "  Acme  ",
      isActive: "false",
      sortBy: "unsupported",
      sortOrder: "sideways",
    })).toEqual({
      page: 1,
      limit: 10,
      search: "Acme",
      isActive: false,
      sortBy: "name",
      sortOrder: "asc",
    });

    expect(supplierFiltersToUrl({
      search: "  harbor ",
      isActive: false,
      sortBy: "createdAt",
      sortOrder: "desc",
    })).toEqual({
      search: "harbor",
      isActive: false,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("normalizes valid schema input and rejects invalid server input without mutation", async () => {
    const parsed = createSupplierSchema(messages).parse({
      name: "  North Supply  ",
      email: "  SALES@NORTH.TEST  ",
    });
    expect(parsed).toMatchObject({
      name: "North Supply",
      email: "sales@north.test",
      isActive: true,
    });

    const before = getSuppliersStore().length;
    const response = await createSupplierAction({ name: "", email: "not-an-email" });
    expect(response.success).toBe(false);
    if (!response.success) expect(response.error.code).toBe("VALIDATION_ERROR");
    expect(getSuppliersStore()).toHaveLength(before);
  });

  it("filters all supported contact fields and returns accurate sorted pages", async () => {
    const emailMatch = await getAllSuppliers({ search: "ALICE@ACME", limit: 5 });
    expect(emailMatch.suppliers.map((supplier) => supplier.id)).toEqual(["supplier-001"]);

    const inactive = await getAllSuppliers({ isActive: false, page: 2, limit: 5 });
    expect(inactive.pagination).toEqual({ page: 1, limit: 5, total: 4, totalPages: 1 });
    expect(inactive.suppliers.every((supplier) => !supplier.isActive)).toBe(true);

    const secondPage = await getAllSuppliers({ page: 2, limit: 5, sortBy: "name", sortOrder: "asc" });
    expect(secondPage.pagination).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
    expect(secondPage.suppliers.map((supplier) => supplier.name)).toEqual([
      "Futura Electronics",
      "Granite Tools",
      "Horizon Textiles",
      "Ion Safety Systems",
      "Juniper Foods",
    ]);
  });
});

describe("supplier services", () => {
  it("creates normalized data, preserves it in the live store, and resets to deep-cloned seeds", async () => {
    const response = await createSupplier({
      name: "  Nova Supply  ",
      email: "  NOVA@EXAMPLE.TEST ",
      contactName: "  Nora  ",
      phone: "   ",
    });
    expect(response.success).toBe(true);
    if (!response.success) return;

    expect(response.data).toMatchObject({
      name: "Nova Supply",
      email: "nova@example.test",
      contactName: "Nora",
      phone: null,
      isActive: true,
    });
    expect(getSuppliersStore().some((supplier) => supplier.id === response.data.id)).toBe(true);

    const reset = resetSuppliersStore();
    expect(reset).toHaveLength(12);
    expect(reset).not.toBe(supplierSeeds);
    expect(reset[0]).not.toBe(supplierSeeds[0]);
  });

  it("enforces duplicate names while allowing an edit to retain its own name", async () => {
    const duplicate = await createSupplier({
      name: "  ACME COMPONENTS ",
      email: "duplicate@example.test",
    });
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) expect(duplicate.error.code).toBe("ALREADY_EXISTS");

    const ownName = await editSupplier("supplier-001", {
      name: " acme components ",
      email: "UPDATED@ACME.TEST",
      isActive: false,
    });
    expect(ownName.success).toBe(true);
    if (ownName.success) {
      expect(ownName.data.email).toBe("updated@acme.test");
      expect(ownName.data.isActive).toBe(false);
      expect(ownName.data.updatedBy).toBe("mock-user-id");
    }

    const otherDuplicate = await editSupplierAction("supplier-002", {
      name: "ACME COMPONENTS",
      email: "blue@example.test",
      isActive: true,
    });
    expect(otherDuplicate.success).toBe(false);
    if (!otherDuplicate.success) expect(otherDuplicate.error.code).toBe("ALREADY_EXISTS");
  });

  it("returns NOT_FOUND consistently and mutates toggle/delete targets", async () => {
    for (const response of [
      await getSupplierById("missing"),
      await editSupplier("missing", { name: "Missing", email: "missing@example.test" }),
      await toggleSupplierActive("missing", false),
      await deleteSupplier("missing"),
    ]) {
      expect(response.success).toBe(false);
      if (!response.success) expect(response.error.code).toBe("NOT_FOUND");
    }

    const toggled = await toggleSupplierActive("supplier-001", false);
    expect(toggled.success).toBe(true);
    if (toggled.success) expect(toggled.data.isActive).toBe(false);

    const deleted = await deleteSupplier("supplier-001");
    expect(deleted.success).toBe(true);
    expect(getSuppliersStore()).toHaveLength(11);
  });
});
