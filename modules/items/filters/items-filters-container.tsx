"use client";

import useItemsFilters from "./hooks/use-items-filters";
import ItemsFiltersPresentational from "./items-filters-presentational";
import ItemsActiveFilters from "./items-active-filters";
import FilterCard from "@/components/filters/filter-card/filter-card";

export default function ItemsFiltersContainer() {
  const {
    filters,
    handleChangeFilters,
    getActiveFiltersCount,
    handleResetFilters,
  } = useItemsFilters({});

  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={
        activeFiltersCount > 0 ? (
          <ItemsActiveFilters
            filters={filters}
            activeFiltersCount={activeFiltersCount}
            handleChangeFilters={handleChangeFilters}
            handleResetFilters={handleResetFilters}
          />
        ) : undefined
      }
    >
      <ItemsFiltersPresentational
        filters={filters}
        handleChangeFilters={handleChangeFilters}
      />
    </FilterCard>
  );
}
