"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  convertUserFiltersDto,
  UserFiltersDto,
} from "../../lib/types/user.types";
import useUrlFilters from "@/hooks/use-url-filters";
import { useSearchParams } from "next/navigation";

export interface UserFilters {
  search: string;
  role: string; // "" | "admin" | "employee"
  status: string; // "" | "active" | "inactive"
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface Props {
  setPagination?: Dispatch<SetStateAction<UserFiltersDto>>;
  urlFilters?: boolean;
}

export default function useUsersFilters({
  setPagination,
  urlFilters = true,
}: Props) {
  const { updateFiltersInUrl } = useUrlFilters({});
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<UserFilters>(() => ({
    search: searchParams.get("search") || "",
    role: searchParams.get("role") || "",
    status: searchParams.get("status") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  }));

  const handleChangeFilters = useCallback(
    (updatedFilters: Partial<UserFilters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updatedFilters };
        if (urlFilters) {
          updateFiltersInUrl({
            ...convertUserFiltersDto(newFilters),
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
      role: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    if (urlFilters) {
      updateFiltersInUrl({
        search: undefined,
        role: undefined,
        status: undefined,
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
    if (filters.role) count++;
    if (filters.status) count++;
    return count;
  }, [filters.search, filters.role, filters.status]);

  return {
    filters,
    handleChangeFilters,
    handleResetFilters,
    getActiveFiltersCount,
  };
}
