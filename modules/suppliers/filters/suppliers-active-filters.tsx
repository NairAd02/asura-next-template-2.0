"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SupplierFilters } from "../lib/types/supplier.types";

interface Props {
  filters: SupplierFilters;
  activeFiltersCount: number;
  handleChangeFilters: (patch: Partial<SupplierFilters>) => void;
  handleResetFilters: () => void;
}

export default function SuppliersActiveFilters({
  filters,
  activeFiltersCount,
  handleChangeFilters,
  handleResetFilters,
}: Props) {
  const t = useTranslations("filters");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">{t("activeFilters", { count: activeFiltersCount })}:</span>
      {filters.search && (
        <Badge variant="secondary" className="gap-1">
          {t("search")}: {filters.search}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ search: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {filters.isActive !== "" && (
        <Badge variant="secondary" className="gap-1">
          {filters.isActive ? t("active") : t("inactive")}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ isActive: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleResetFilters}>
        {t("clearAll")}
      </Button>
    </div>
  );
}
