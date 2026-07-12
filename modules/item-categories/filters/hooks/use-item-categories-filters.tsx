"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  convertItemCategoryFiltersDto,
  ItemCategoryFiltersDto,
} from "../../lib/types/item-category.types";
import useUrlFilters from "@/hooks/use-url-filters";
import { useSearchParams } from "next/navigation";

export interface ItemCategoryFilters {
  search: string;
  isActive: boolean | ""; // "" means no filter
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface Props {
  setPagination?: Dispatch<SetStateAction<ItemCategoryFiltersDto>>;
  urlFilters?: boolean;
}

export default function useItemCategoriesFilters({
  setPagination,
  urlFilters = true,
}: Props) {
  const { updateFiltersInUrl } = useUrlFilters({});
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ItemCategoryFilters>(() => ({
    search: searchParams.get("search") || "",
    isActive: searchParams.get("isActive") === "true" ? true : searchParams.get("isActive") === "false" ? false : "",
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  }));

  const handleChangeFilters = useCallback(
    (updatedFilters: Partial<ItemCategoryFilters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updatedFilters };
        if (urlFilters) {
          updateFiltersInUrl({
            ...convertItemCategoryFiltersDto(newFilters),
            page: 1,
          });
        }
        return newFilters;
      });
      if (setPagination) {
        setPagination((oldPagination) => ({ ...oldPagination, page: 1 }));
      }
    },
    [urlFilters, updateFiltersInUrl, setPagination],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      isActive: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    if (urlFilters) {
      updateFiltersInUrl({
        search: undefined,
        isActive: undefined,
        sortBy: "name",
        sortOrder: "asc",
        page: 1,
      });
    }
    if (setPagination) {
      setPagination((oldPagination) => ({ ...oldPagination, page: 1 }));
    }
  }, [urlFilters, updateFiltersInUrl, setPagination]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.isActive !== "") count++;
    return count;
  }, [filters.search, filters.isActive]);

  return {
    filters,
    handleChangeFilters,
    handleResetFilters,
    getActiveFiltersCount,
  };
}
