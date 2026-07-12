import { NextRequest, NextResponse } from "next/server";
import { generateItemCategoryReportBuffer } from "@/modules/item-categories/lib/services/item-category-report.service";
import { ItemCategoryFiltersDto } from "@/modules/item-categories/lib/types/item-category.types";

export async function POST(request: NextRequest) {
  try {
    const filters: ItemCategoryFiltersDto = await request.json();

    const { buffer, filename } = await generateItemCategoryReportBuffer(filters);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to generate item category report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
