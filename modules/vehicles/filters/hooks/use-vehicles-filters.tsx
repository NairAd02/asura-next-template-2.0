"use client";

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useUrlFilters from "@/hooks/use-url-filters";
import { vehicleFiltersToUrl, vehicleStatusOptions, vehicleTypeOptions } from "../../lib/types/vehicle.types";
import type { VehicleFilters, VehicleFiltersDto, VehicleSortBy, VehicleStatus, VehicleType } from "../../lib/types/vehicle.types";

const allowedStatuses = new Set<VehicleStatus>(vehicleStatusOptions.map((option) => option.value));
const allowedTypes = new Set<VehicleType>(vehicleTypeOptions.map((option) => option.value));
const allowedSorts = new Set<VehicleSortBy>(["plate", "status", "year", "odometer", "createdAt"]);

function statusFromParam(value: string | null): VehicleStatus | "" {
  return value && allowedStatuses.has(value as VehicleStatus) ? (value as VehicleStatus) : "";
}

function typeFromParam(value: string | null): VehicleType | "" {
  return value && allowedTypes.has(value as VehicleType) ? (value as VehicleType) : "";
}

function sortFromParam(value: string | null): VehicleSortBy {
  return value && allowedSorts.has(value as VehicleSortBy) ? (value as VehicleSortBy) : "plate";
}

interface Props {
  setPagination?: Dispatch<SetStateAction<VehicleFiltersDto>>;
  urlFilters?: boolean;
}

const defaultVehicleFilters: VehicleFilters = {
  search: "",
  status: "",
  type: "",
  sortBy: "plate",
  sortOrder: "asc",
};

export default function useVehiclesFilters({ setPagination, urlFilters = true }: Props = {}) {
  const params = useSearchParams();
  const { updateFiltersInUrl } = useUrlFilters({});
  const [filters, setFilters] = useState<VehicleFilters>(() => ({
    search: params.get("search") ?? "",
    status: statusFromParam(params.get("status")),
    type: typeFromParam(params.get("type")),
    sortBy: sortFromParam(params.get("sortBy")),
    sortOrder: params.get("sortOrder") === "desc" ? "desc" : "asc",
  }));

  const handleChangeFilters = useCallback((patch: Partial<VehicleFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      if (urlFilters) {
        updateFiltersInUrl({ ...vehicleFiltersToUrl(next), page: 1 });
      }
      return next;
    });
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultVehicleFilters);
    if (urlFilters) {
      updateFiltersInUrl({ ...vehicleFiltersToUrl(defaultVehicleFilters), page: 1 });
    }
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.type) count++;
    return count;
  }, [filters.search, filters.status, filters.type]);

  return { filters, handleChangeFilters, handleResetFilters, getActiveFiltersCount };
}
