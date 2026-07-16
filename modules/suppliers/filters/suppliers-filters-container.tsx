"use client";

import FilterCard from "@/components/filters/filter-card/filter-card";
import useSuppliersFilters from "./hooks/use-suppliers-filters";
import SuppliersActiveFilters from "./suppliers-active-filters";
import SuppliersFiltersPresentational from "./suppliers-filters-presentational";

export default function SuppliersFiltersContainer() {
  const { filters, handleChangeFilters, getActiveFiltersCount, handleResetFilters } = useSuppliersFilters({});
  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={activeFiltersCount > 0 ? (
        <SuppliersActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          handleChangeFilters={handleChangeFilters}
          handleResetFilters={handleResetFilters}
        />
      ) : undefined}
    >
      <SuppliersFiltersPresentational filters={filters} handleChangeFilters={handleChangeFilters} />
    </FilterCard>
  );
}
