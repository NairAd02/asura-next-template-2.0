"use client";

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useUrlFilters from "@/hooks/use-url-filters";
import { supplierFiltersToUrl } from "../../lib/types/supplier.types";
import type { SupplierFilters, SupplierFiltersDto } from "../../lib/types/supplier.types";

interface Props {
  setPagination?: Dispatch<SetStateAction<SupplierFiltersDto>>;
  urlFilters?: boolean;
}

const defaultSupplierFilters: SupplierFilters = {
  search: "",
  isActive: "",
  sortBy: "name",
  sortOrder: "asc",
};

export default function useSuppliersFilters({ setPagination, urlFilters = true }: Props = {}) {
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
      if (urlFilters) {
        updateFiltersInUrl({ ...supplierFiltersToUrl(next), page: 1 });
      }
      return next;
    });
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultSupplierFilters);
    if (urlFilters) {
      updateFiltersInUrl({ ...supplierFiltersToUrl(defaultSupplierFilters), page: 1 });
    }
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.isActive !== "") count++;
    return count;
  }, [filters.search, filters.isActive]);

  return { filters, handleChangeFilters, handleResetFilters, getActiveFiltersCount };
}
