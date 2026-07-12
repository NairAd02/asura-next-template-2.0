import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getReportFilePath } from "@/lib/excel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 },
    );
  }

  const filePath = await getReportFilePath(filename);

  if (!filePath) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);

    // Extract the original filename (after the UUID prefix)
    const originalFilename = filename.includes("_")
      ? filename.substring(filename.indexOf("_") + 1)
      : filename;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${originalFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to read report file" },
      { status: 500 },
    );
  }
}
