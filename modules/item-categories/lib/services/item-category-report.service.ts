import {
  generateExcelBuffer,
  saveReportToFile,
  generateReportFilename,
  type ExcelColumnDef,
  type ReportResponse,
} from "@/lib/excel";
import { getAllItemCategories } from "./item-category.services";
import {
  ItemCategory,
  ItemCategoryFiltersDto,
} from "../types/item-category.types";

const ITEM_CATEGORY_COLUMNS: ExcelColumnDef<ItemCategory>[] = [
  {
    header: "Name",
    key: "name",
    accessor: (row) => row.name ?? "",
    width: 25,
  },
  {
    header: "Description",
    key: "description",
    accessor: (row) => row.description ?? "",
    width: 40,
  },
  {
    header: "Icon Code",
    key: "iconCode",
    accessor: (row) => row.iconCode ?? "",
    width: 20,
  },
  {
    header: "Active",
    key: "isActive",
    accessor: (row) => (row.isActive ? "Yes" : "No"),
    width: 12,
  },
  {
    header: "Pricing Type",
    key: "pricingType",
    accessor: (row) => row.pricingType?.replace('_', ' ') ?? "",
    width: 18,
  },
  {
    header: "Created By",
    key: "createdBy",
    accessor: (row) => row.createdByUser ? `${row.createdByUser.full_name} (${row.createdByUser.email})` : row.createdBy ?? "",
    width: 35,
  },
  {
    header: "Created At",
    key: "createdAt",
    accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    width: 16,
  },
  {
    header: "Updated By",
    key: "updatedBy",
    accessor: (row) => row.updatedByUser ? `${row.updatedByUser.full_name} (${row.updatedByUser.email})` : row.updatedBy ?? "",
    width: 35,
  },
  {
    header: "Updated At",
    key: "updatedAt",
    accessor: (row) => new Date(row.updatedAt).toLocaleDateString(),
    width: 16,
  },
];

export async function generateItemCategoryReport(
  filters: ItemCategoryFiltersDto = {},
): Promise<ReportResponse> {
  try {
    // Fetch all matching item categories (override pagination to get everything)
    const result = await getAllItemCategories({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const { itemCategories } = result;

    const filename = generateReportFilename({
      baseName: "item-categories",
      filters,
    });

    const buffer = await generateExcelBuffer({
      filename,
      metadata: {
        title: "Item Categories Report",
        generatedAt: new Date(),
        filters,
      },
      sheets: [
        {
          sheetName: "Item Categories",
          columns: ITEM_CATEGORY_COLUMNS,
          data: itemCategories,
        },
      ],
    });

    const savedFilename = await saveReportToFile(buffer, filename);

    return {
      success: true,
      downloadUrl: `/api/reports/download/${savedFilename}`,
      filename: savedFilename,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "REPORT_GENERATION_ERROR",
        message: `Failed to generate item categories report: ${error}`,
      },
    };
  }
}

export async function generateItemCategoryReportBuffer(
  filters: ItemCategoryFiltersDto = {},
): Promise<{ buffer: Buffer; filename: string }> {
  // Fetch all matching item categories (override pagination to get everything)
  const result = await getAllItemCategories({
    ...filters,
    page: 1,
    limit: 10000,
  });

  const { itemCategories } = result;

  const filename = generateReportFilename({
    baseName: "item-categories",
    filters,
  });

  const buffer = await generateExcelBuffer({
    filename,
    metadata: {
      title: "Item Categories Report",
      generatedAt: new Date(),
      filters,
    },
    sheets: [
      {
        sheetName: "Item Categories",
        columns: ITEM_CATEGORY_COLUMNS,
        data: itemCategories,
      },
    ],
  });

  return { buffer, filename };
}
