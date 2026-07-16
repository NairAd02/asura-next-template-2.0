"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import useUrlFilters from "@/hooks/use-url-filters";
import { supplierFiltersToUrl } from "../../lib/types/supplier.types";
import type { SupplierFilters } from "../../lib/types/supplier.types";

export default function useSuppliersFilters() {
  const params = useSearchParams();
  const { updateFiltersInUrl } = useUrlFilters({});
  const [filters, setFilters] = useState<SupplierFilters>(() => ({
    search: params.get("search") ?? "",
    isActive: params.get("isActive") === "true" ? true : params.get("isActive") === "false" ? false : "",
    sortBy: params.get("sortBy") === "createdAt" ? "createdAt" : "name",
    sortOrder: params.get("sortOrder") === "desc" ? "desc" : "asc",
  }));

  const handleChangeFilters = useCallback((patch: Partial<SupplierFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      updateFiltersInUrl({ ...supplierFiltersToUrl(next), page: 1 });
      return next;
    });
  }, [updateFiltersInUrl]);

  return { filters, handleChangeFilters };
}
