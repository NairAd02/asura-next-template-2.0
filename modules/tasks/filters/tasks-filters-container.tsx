"use client";

import FilterCard from "@/components/filters/filter-card/filter-card";
import TasksActiveFilters from "./tasks-active-filters";
import TasksFiltersPresentational from "./tasks-filters-presentational";
import useTasksFilters from "./hooks/use-tasks-filters";

export default function TasksFiltersContainer() {
  const { filters, handleChangeFilters, getActiveFiltersCount, handleResetFilters } = useTasksFilters({});
  const activeFiltersCount = getActiveFiltersCount;

  return (
    <FilterCard
      activeFilters={activeFiltersCount > 0 ? (
        <TasksActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          handleChangeFilters={handleChangeFilters}
          handleResetFilters={handleResetFilters}
        />
      ) : undefined}
    >
      <TasksFiltersPresentational filters={filters} handleChangeFilters={handleChangeFilters} />
    </FilterCard>
  );
}
