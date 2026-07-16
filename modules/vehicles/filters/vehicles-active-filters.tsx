"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VehicleFilters } from "../lib/types/vehicle.types";

interface Props {
  filters: VehicleFilters;
  activeFiltersCount: number;
  handleChangeFilters: (patch: Partial<VehicleFilters>) => void;
  handleResetFilters: () => void;
}

export default function VehiclesActiveFilters({
  filters,
  activeFiltersCount,
  handleChangeFilters,
  handleResetFilters,
}: Props) {
  const t = useTranslations("filters");
  const vehiclesT = useTranslations("vehicles.filters");

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
      {filters.status && (
        <Badge variant="secondary" className="gap-1">
          {vehiclesT("status")}: {vehiclesT(`statusOptions.${filters.status}`)}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ status: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {filters.type && (
        <Badge variant="secondary" className="gap-1">
          {vehiclesT("type")}: {vehiclesT(`typeOptions.${filters.type}`)}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ type: "" })}>
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
