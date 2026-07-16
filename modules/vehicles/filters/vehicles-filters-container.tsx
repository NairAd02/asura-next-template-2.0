"use client";

import FilterCard from "@/components/filters/filter-card/filter-card";
import VehiclesFiltersPresentational from "./vehicles-filters-presentational";
import VehiclesActiveFilters from "./vehicles-active-filters";
import useVehiclesFilters from "./hooks/use-vehicles-filters";

export default function VehiclesFiltersContainer() {
  const { filters, handleChangeFilters, getActiveFiltersCount, handleResetFilters } = useVehiclesFilters({});
  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={activeFiltersCount > 0 ? (
        <VehiclesActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          handleChangeFilters={handleChangeFilters}
          handleResetFilters={handleResetFilters}
        />
      ) : undefined}
    >
      <VehiclesFiltersPresentational filters={filters} handleChangeFilters={handleChangeFilters} />
    </FilterCard>
  );
}
