import type { Item } from "../types/item.types";

// ─── Mock store ───────────────────────────────────────────────────────────────

const MOCK_ACTOR_ID = "mock-user-id-001";

function makeItem(
  id: string,
  name: string,
  description: string | null,
  itemCategoryId: string | null,
  itemCategoryName: string | null,
  status: Item["status"],
  createdAt: string,
): Item {
  return {
    id,
    name,
    description,
    itemCategoryId,
    itemCategoryName,
    status,
    images: [],
    createdBy: MOCK_ACTOR_ID,
    createdAt,
    updatedAt: createdAt,
  };
}

export const itemsStore: Item[] = [
  makeItem("item-001", "iPhone 14 Pro",         "64GB Space Black, minor screen scratches",   "cat-001", "Electronics",   "active",   "2024-02-01T09:00:00Z"),
  makeItem("item-002", "MacBook Air M2",         "13-inch, charger included",                  "cat-001", "Electronics",   "active",   "2024-02-02T10:00:00Z"),
  makeItem("item-003", "Sony WH-1000XM5",        "Noise-cancelling headphones, no cable",      "cat-001", "Electronics",   "inactive", "2024-02-03T11:00:00Z"),
  makeItem("item-004", "Nike Air Max 270",       "Men's size 10, blue/white",                  "cat-002", "Clothing",      "active",   "2024-02-04T12:00:00Z"),
  makeItem("item-005", "Levi's 501 Jeans",       "Size 32x30, light wash",                     "cat-002", "Clothing",      "active",   "2024-02-05T09:30:00Z"),
  makeItem("item-006", "IKEA KALLAX Shelf",      "4-cube unit, white, some assembly needed",   "cat-003", "Furniture",     "active",   "2024-02-06T10:30:00Z"),
  makeItem("item-007", "Office Chair",           "Ergonomic, black mesh, adjustable arms",     "cat-003", "Furniture",     "active",   "2024-02-07T11:30:00Z"),
  makeItem("item-008", "Harry Potter Box Set",   "7-book complete collection, hardcover",      "cat-004", "Books",         "inactive", "2024-02-08T12:30:00Z"),
  makeItem("item-009", "LEGO Star Wars Set",     "Millennium Falcon, 1329 pieces",             "cat-005", "Toys",          "active",   "2024-02-09T09:00:00Z"),
  makeItem("item-010", "Yoga Mat",               "6mm thick, purple, non-slip surface",        "cat-006", "Sports",        "active",   "2024-02-10T10:00:00Z"),
  makeItem("item-011", "Instant Pot Duo 7-in-1", "6 quart multi-cooker, all accessories",      "cat-007", "Kitchen",       "active",   "2024-02-11T11:00:00Z"),
  makeItem("item-012", "Garden Hose 50ft",       "Expandable, with nozzle attachment",         "cat-008", "Garden",        "archived", "2024-02-12T12:00:00Z"),
  makeItem("item-013", "Car Floor Mats Set",     "All-weather rubber, fits Toyota Camry",      "cat-009", "Automotive",    "active",   "2024-02-13T09:30:00Z"),
  makeItem("item-014", "Vitamin D3 Supplements", "60 softgels, 2000 IU, unopened",             "cat-010", "Health",        "active",   "2024-02-14T10:30:00Z"),
  makeItem("item-015", "Gold Hoop Earrings",     "14k gold, 1 inch diameter, in box",          "cat-011", "Jewelry",       "active",   "2024-02-15T11:30:00Z"),
  makeItem("item-016", "Watercolor Paint Set",   "24 colors, artist grade, with brushes",      "cat-012", "Art & Crafts",  "active",   "2024-02-16T12:30:00Z"),
  makeItem("item-017", "Brother HL-L2350DW",     "Wireless monochrome laser printer",          "cat-013", "Office",        "inactive", "2024-02-17T09:00:00Z"),
  makeItem("item-018", "Dog Kennel Large",       "42-inch wire crate, foldable",               "cat-014", "Pet Supplies",  "active",   "2024-02-18T10:00:00Z"),
  makeItem("item-019", "Acoustic Guitar",        "Fender CD-60S, natural finish, with case",   "cat-015", "Music",         "active",   "2024-02-19T11:00:00Z"),
  makeItem("item-020", "Canon EOS R50",          "Mirrorless camera, 24.2MP, kit lens",        "cat-016", "Cameras",       "active",   "2024-02-20T12:00:00Z"),
];
