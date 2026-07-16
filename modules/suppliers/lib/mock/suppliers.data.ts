import type { Supplier } from "../types/supplier.types";

export const supplierSeeds: readonly Supplier[] = [
  { id: "supplier-001", name: "Acme Components", contactName: "Alice Morgan", email: "alice@acme.test", phone: "+1 555 0101", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-02T09:00:00.000Z", updatedBy: null, updatedAt: "2025-01-02T09:00:00.000Z" },
  { id: "supplier-002", name: "Blue Harbor Logistics", contactName: "Bruno Díaz", email: "bruno@blueharbor.test", phone: "+34 910 100 202", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-04T10:00:00.000Z", updatedBy: null, updatedAt: "2025-01-04T10:00:00.000Z" },
  { id: "supplier-003", name: "Cedar Office Supply", contactName: "Carla Reyes", email: "carla@cedar.test", phone: null, isActive: false, createdBy: "mock-user-id", createdAt: "2025-01-06T11:00:00.000Z", updatedBy: null, updatedAt: "2025-01-06T11:00:00.000Z" },
  { id: "supplier-004", name: "Delta Industrial", contactName: null, email: "sales@delta.test", phone: "+1 555 0104", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-08T12:00:00.000Z", updatedBy: null, updatedAt: "2025-01-08T12:00:00.000Z" },
  { id: "supplier-005", name: "Evergreen Packaging", contactName: "Elena Soto", email: "elena@evergreen.test", phone: "+52 55 1000 5005", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-10T13:00:00.000Z", updatedBy: null, updatedAt: "2025-01-10T13:00:00.000Z" },
  { id: "supplier-006", name: "Futura Electronics", contactName: "Fabio Costa", email: "fabio@futura.test", phone: null, isActive: false, createdBy: "mock-user-id", createdAt: "2025-01-12T14:00:00.000Z", updatedBy: null, updatedAt: "2025-01-12T14:00:00.000Z" },
  { id: "supplier-007", name: "Granite Tools", contactName: "Grace Lee", email: "grace@granite.test", phone: "+1 555 0107", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-14T15:00:00.000Z", updatedBy: null, updatedAt: "2025-01-14T15:00:00.000Z" },
  { id: "supplier-008", name: "Horizon Textiles", contactName: "Hugo Martín", email: "hugo@horizon.test", phone: "+34 910 100 808", isActive: false, createdBy: "mock-user-id", createdAt: "2025-01-16T16:00:00.000Z", updatedBy: null, updatedAt: "2025-01-16T16:00:00.000Z" },
  { id: "supplier-009", name: "Ion Safety Systems", contactName: "Irene Pérez", email: "irene@ion.test", phone: null, isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-18T17:00:00.000Z", updatedBy: null, updatedAt: "2025-01-18T17:00:00.000Z" },
  { id: "supplier-010", name: "Juniper Foods", contactName: "Jorge Ramos", email: "jorge@juniper.test", phone: "+53 5 100 1010", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-20T18:00:00.000Z", updatedBy: null, updatedAt: "2025-01-20T18:00:00.000Z" },
  { id: "supplier-011", name: "Keystone Medical", contactName: null, email: "orders@keystone.test", phone: "+1 555 0111", isActive: false, createdBy: "mock-user-id", createdAt: "2025-01-22T19:00:00.000Z", updatedBy: null, updatedAt: "2025-01-22T19:00:00.000Z" },
  { id: "supplier-012", name: "Lumen Printworks", contactName: "Lucía Vega", email: "lucia@lumen.test", phone: "+52 55 1000 1212", isActive: true, createdBy: "mock-user-id", createdAt: "2025-01-24T20:00:00.000Z", updatedBy: null, updatedAt: "2025-01-24T20:00:00.000Z" },
];

const globalStore = globalThis as typeof globalThis & {
  __nextTemplateSuppliersStore?: Supplier[];
};

function cloneSeeds(): Supplier[] {
  return supplierSeeds.map((supplier) => ({ ...supplier }));
}

export function getSuppliersStore(): Supplier[] {
  globalStore.__nextTemplateSuppliersStore ??= cloneSeeds();
  return globalStore.__nextTemplateSuppliersStore;
}
