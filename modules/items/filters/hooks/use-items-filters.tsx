"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  convertItemFiltersDto,
  ItemFilters,
  ItemFiltersDto,
  ItemStatus,
} from "../../lib/types/item.types";
import useUrlFilters from "@/hooks/use-url-filters";
import { useSearchParams } from "next/navigation";

interface Props {
  setPagination?: Dispatch<SetStateAction<ItemFiltersDto>>;
  urlFilters?: boolean;
}

export default function useItemsFilters({
  setPagination,
  urlFilters = true,
}: Props) {
  const { updateFiltersInUrl } = useUrlFilters({});
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ItemFilters>(() => ({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as ItemStatus) || "",
    itemCategoryId: null,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  }));

  const handleChangeFilters = useCallback(
    (updatedFilters: Partial<ItemFilters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updatedFilters };
        if (urlFilters) {
          updateFiltersInUrl({
            ...convertItemFiltersDto(newFilters),
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
      status: "",
      itemCategoryId: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    if (urlFilters) {
      updateFiltersInUrl({
        search: undefined,
        status: undefined,
        itemCategoryId: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
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
    if (filters.status !== "") count++;
    if (filters.itemCategoryId) count++;
    return count;
  }, [filters.search, filters.status, filters.itemCategoryId]);

  return {
    filters,
    handleChangeFilters,
    handleResetFilters,
    getActiveFiltersCount,
  };
}
