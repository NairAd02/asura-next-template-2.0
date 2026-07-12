"use client";
import useItemCategoriesFilters from "./hooks/use-item-categories-filters";
import ItemCategoriesFiltersPresentational from "./item-categories-filters-presentational";
import ItemCategoriesActiveFilters from "./item-categories-active-filters";
import FilterCard from "@/components/filters/filter-card/filter-card";

export default function ItemCategoriesFiltersContainer() {
  const {
    filters,
    handleChangeFilters,
    getActiveFiltersCount,
    handleResetFilters,
  } = useItemCategoriesFilters({});

  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={activeFiltersCount > 0 ? (
        <ItemCategoriesActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          handleChangeFilters={handleChangeFilters}
          handleResetFilters={handleResetFilters}
        />
      ) : undefined}
    >
      <ItemCategoriesFiltersPresentational
        filters={filters}
        handleChangeFilters={handleChangeFilters}
      />
    </FilterCard>
  );
}
