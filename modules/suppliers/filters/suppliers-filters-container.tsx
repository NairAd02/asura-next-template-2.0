"use client";

import useSuppliersFilters from "./hooks/use-suppliers-filters";
import SuppliersFiltersPresentational from "./suppliers-filters-presentational";

export default function SuppliersFiltersContainer() {
  const { filters, handleChangeFilters } = useSuppliersFilters();
  return <SuppliersFiltersPresentational filters={filters} onChange={handleChangeFilters} />;
}
