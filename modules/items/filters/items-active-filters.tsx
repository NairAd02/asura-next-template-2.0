"use client";

import { Button } from "@/components/ui/button";
import FilterBadge from "@/components/filters/filter-badge/filter-badge";
import { ListFilter, X } from "lucide-react";
import { ItemFilters } from "../lib/types/item.types";
import { useTranslations } from "next-intl";

interface Props {
  filters: ItemFilters;
  activeFiltersCount: number;
  handleChangeFilters: (newFilters: Partial<ItemFilters>) => void;
  handleResetFilters: () => void;
}

export default function ItemsActiveFilters({
  filters,
  activeFiltersCount,
  handleChangeFilters,
  handleResetFilters,
}: Props) {
  const t = useTranslations("items.filters");
  const tCard = useTranslations("itemCard");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ListFilter className="h-3.5 w-3.5" />
        <span>
          {activeFiltersCount} {t('active')}{" "}
          {activeFiltersCount === 1 ? t('filter') : t('filters')}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {filters.search && (
          <FilterBadge
            filterName={t('search')}
            filterValue={filters.search}
            handleDeleteFilter={() => handleChangeFilters({ search: "" })}
          />
        )}
        {filters.status !== "" && (
          <FilterBadge
            filterName={t('status')}
            filterValue={tCard(`statusValues.${filters.status}`)}
            handleDeleteFilter={() => handleChangeFilters({ status: "" })}
          />
        )}
        {filters.itemCategoryId && (
          <FilterBadge
            filterName={t('category')}
            filterValue={filters.itemCategoryId.label}
            handleDeleteFilter={() => handleChangeFilters({ itemCategoryId: null })}
          />
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto"
        onClick={handleResetFilters}
      >
        <X className="h-3 w-3" />
        {t('clearAll')}
      </Button>
    </div>
  );
}
