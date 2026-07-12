"use client";

import { Button } from "@/components/ui/button";
import FilterBadge from "@/components/filters/filter-badge/filter-badge";
import { ListFilter, X } from "lucide-react";
import { ItemCategoryFilters } from "./hooks/use-item-categories-filters";
import { useTranslations } from "next-intl";

interface Props {
  filters: ItemCategoryFilters;
  activeFiltersCount: number;
  handleChangeFilters: (newFilters: Partial<ItemCategoryFilters>) => void;
  handleResetFilters: () => void;
}

export default function ItemCategoriesActiveFilters({
  filters,
  activeFiltersCount,
  handleChangeFilters,
  handleResetFilters,
}: Props) {
  const t = useTranslations('itemCategories.filters');

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
        {filters.isActive !== "" && (
          <FilterBadge
            filterName={t('status')}
            filterValue={filters.isActive ? t('active') : t('inactive')}
            handleDeleteFilter={() => handleChangeFilters({ isActive: "" })}
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
