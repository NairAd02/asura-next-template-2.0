"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useItemCategoryReport } from "../lib/hooks/use-item-category-report";
import { ItemCategoryFiltersDto } from "../lib/types/item-category.types";
import { useTranslations } from "next-intl";

interface Props {
  filters?: ItemCategoryFiltersDto;
}

export default function ItemCategoryExcelReportButton({ filters = {} }: Props) {
  const t = useTranslations("itemCategories.report");
  const { isLoading, generateReport } = useItemCategoryReport({
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
