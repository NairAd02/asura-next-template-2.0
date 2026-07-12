import type { ItemCategory } from "../types/item-category.types";

// ─── Mock store ───────────────────────────────────────────────────────────────
// Live in-memory array mutated by the mock service. Import `itemCategoriesStore`
// only from `item-category.services.ts` to keep mutations centralised.

const MOCK_ACTOR = {
  id: "mock-user-id-001",
  full_name: "Template Admin",
  email: "admin@template.dev",
};

function makeCategory(
  id: string,
  name: string,
  description: string | null,
  pricingType: ItemCategory["pricingType"],
  isActive: boolean,
  createdAt: string,
): ItemCategory {
  return {
    id,
    name,
    description,
    iconCode: null,
    isActive,
    pricingType,
    createdBy: MOCK_ACTOR.id,
    createdAt,
    updatedBy: null,
    updatedAt: createdAt,
    createdByUser: MOCK_ACTOR,
    updatedByUser: null,
  };
}

export const itemCategoriesStore: ItemCategory[] = [
  makeCategory("cat-001", "Electronics",     "Phones, tablets, laptops, and accessories",      "flat_rate",   true,  "2024-01-10T08:00:00Z"),
  makeCategory("cat-002", "Clothing",         "Apparel, footwear, and fashion accessories",     "unit_based",  true,  "2024-01-11T09:00:00Z"),
  makeCategory("cat-003", "Furniture",        "Home and office furniture",                      "flat_rate",   true,  "2024-01-12T10:00:00Z"),
  makeCategory("cat-004", "Books",            "Physical books, textbooks, and magazines",       "unit_based",  true,  "2024-01-13T11:00:00Z"),
  makeCategory("cat-005", "Toys",             "Children's toys and games",                      "flat_rate",   true,  "2024-01-14T12:00:00Z"),
  makeCategory("cat-006", "Sports",           "Sporting goods and fitness equipment",           "unit_based",  true,  "2024-01-15T13:00:00Z"),
  makeCategory("cat-007", "Kitchen",          "Cookware, appliances, and kitchen tools",        "flat_rate",   true,  "2024-01-16T08:30:00Z"),
  makeCategory("cat-008", "Garden",           "Plants, tools, and outdoor equipment",           "unit_based",  false, "2024-01-17T09:30:00Z"),
  makeCategory("cat-009", "Automotive",       "Car parts, accessories, and tools",              "flat_rate",   true,  "2024-01-18T10:30:00Z"),
  makeCategory("cat-010", "Health & Beauty",  "Personal care, vitamins, and cosmetics",         "unit_based",  true,  "2024-01-19T11:30:00Z"),
  makeCategory("cat-011", "Jewelry",          "Fine jewelry, watches, and accessories",         "flat_rate",   true,  "2024-01-20T12:30:00Z"),
  makeCategory("cat-012", "Art & Crafts",     "Art supplies, craft kits, and hobby items",     "unit_based",  true,  "2024-01-21T13:30:00Z"),
  makeCategory("cat-013", "Office Supplies",  "Stationery, printers, and office equipment",    "flat_rate",   false, "2024-01-22T08:00:00Z"),
  makeCategory("cat-014", "Pet Supplies",     "Food, toys, and accessories for pets",           "unit_based",  true,  "2024-01-23T09:00:00Z"),
  makeCategory("cat-015", "Musical Instruments", "Guitars, keyboards, drums, and accessories", "flat_rate",   true,  "2024-01-24T10:00:00Z"),
  makeCategory("cat-016", "Cameras",          "Digital cameras, lenses, and photography gear", "flat_rate",   true,  "2024-01-25T11:00:00Z"),
  makeCategory("cat-017", "Video Games",      "Consoles, games, and gaming accessories",        "unit_based",  true,  "2024-01-26T12:00:00Z"),
  makeCategory("cat-018", "Tools",            "Power tools, hand tools, and hardware",          "flat_rate",   false, "2024-01-27T13:00:00Z"),
  makeCategory("cat-019", "Baby Products",    "Clothing, toys, and care items for babies",     "unit_based",  true,  "2024-01-28T08:00:00Z"),
  makeCategory("cat-020", "Food & Beverage",  "Non-perishable food and specialty drinks",       "flat_rate",   true,  "2024-01-29T09:00:00Z"),
];
