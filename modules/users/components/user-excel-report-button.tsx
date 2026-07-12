"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useUserReport } from "../lib/hooks/use-user-report";
import { UserFiltersDto } from "../lib/types/user.types";
import { useTranslations } from "next-intl";

interface Props {
  filters?: UserFiltersDto;
}

export default function UserExcelReportButton({ filters = {} }: Props) {
  const t = useTranslations("users.report");
  const { isLoading, generateReport } = useUserReport({
    filters,
  });

  return (
    <Button
      variant="outline"
      onClick={() => generateReport(filters)}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {t("generating")}
        </>
      ) : (
        <>
          <Download />
          {t("export")}
        </>
      )}
    </Button>
  );
}
