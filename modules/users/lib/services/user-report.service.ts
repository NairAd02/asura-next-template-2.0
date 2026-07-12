import {
  generateExcelBuffer,
  saveReportToFile,
  generateReportFilename,
  type ExcelColumnDef,
  type ReportResponse,
} from "@/lib/excel";
import { getAllUsers } from "./user.services";
import {
  User,
  UserFiltersDto,
  getUserRoleLabel,
  getUserStatusLabel,
} from "../types/user.types";

const USER_COLUMNS: ExcelColumnDef<User>[] = [
  {
    header: "Email",
    key: "email",
    accessor: (row) => row.email ?? "",
    width: 30,
  },
  {
    header: "Full Name",
    key: "fullName",
    accessor: (row) => row.fullName ?? "",
    width: 25,
  },
  {
    header: "Role",
    key: "role",
    accessor: (row) => getUserRoleLabel(row.role),
    width: 15,
  },
  {
    header: "Status",
    key: "status",
    accessor: (row) => getUserStatusLabel(row.status),
    width: 15,
  },
  {
    header: "Created At",
    key: "createdAt",
    accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    width: 16,
  },
  {
    header: "Updated At",
    key: "updatedAt",
    accessor: (row) => new Date(row.updatedAt).toLocaleDateString(),
    width: 16,
  },
];

export async function generateUserReport(
  filters: UserFiltersDto = {},
): Promise<ReportResponse> {
  try {
    // Fetch all matching users (override pagination to get everything)
    const result = await getAllUsers({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const { users } = result;

    const filename = generateReportFilename({
      baseName: "users",
      filters,
    });

    const buffer = await generateExcelBuffer({
      filename,
      metadata: {
        title: "Users Report",
        generatedAt: new Date(),
        filters,
      },
      sheets: [
        {
          sheetName: "Users",
          columns: USER_COLUMNS,
          data: users,
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
        message: `Failed to generate users report: ${error}`,
      },
    };
  }
}

export async function generateUserReportBuffer(
  filters: UserFiltersDto = {},
): Promise<{ buffer: Buffer; filename: string }> {
  // Fetch all matching users (override pagination to get everything)
  const result = await getAllUsers({
    ...filters,
    page: 1,
    limit: 10000,
  });

  const { users } = result;

  const filename = generateReportFilename({
    baseName: "users",
    filters,
  });

  const buffer = await generateExcelBuffer({
    filename,
    metadata: {
      title: "Users Report",
      generatedAt: new Date(),
      filters,
    },
    sheets: [
      {
        sheetName: "Users",
        columns: USER_COLUMNS,
        data: users,
      },
    ],
  });

  return { buffer, filename };
}
