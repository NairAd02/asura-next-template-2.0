"use client";

import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/inputs/search-input/search-input";
import SelectInput from "@/components/inputs/select-input/select-input";
import { Button } from "@/components/ui/button";
import { vehicleStatusOptions, vehicleTypeOptions } from "../lib/types/vehicle.types";
import type { VehicleFilters, VehicleSortBy } from "../lib/types/vehicle.types";

interface Props {
  filters: VehicleFilters;
  handleChangeFilters: (patch: Partial<VehicleFilters>) => void;
}

const sortOptions: VehicleSortBy[] = ["plate", "status", "year", "odometer", "createdAt"];

export default function VehiclesFiltersPresentational({ filters, handleChangeFilters }: Props) {
  const t = useTranslations("vehicles.filters");

  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_1fr_auto] 2xl:gap-3">
      <div className="sm:col-span-2 2xl:col-span-1">
        <SearchInput id="vehicles-search" placeHolder={t("searchPlaceholder")} value={filters.search} onChange={(event) => handleChangeFilters({ search: event.target.value })} />
      </div>
      <SelectInput
        placeholder={t("status")}
        value={filters.status}
        onValueChange={(value) => handleChangeFilters({ status: value === "" ? "" : (value as VehicleFilters["status"]) })}
        options={vehicleStatusOptions.map((option) => ({ label: t(`statusOptions.${option.value}`), value: option.value }))}
        clearable={{ handleClear: () => handleChangeFilters({ status: "" }) }}
      />
      <SelectInput
        placeholder={t("type")}
        value={filters.type}
        onValueChange={(value) => handleChangeFilters({ type: value === "" ? "" : (value as VehicleFilters["type"]) })}
        options={vehicleTypeOptions.map((option) => ({ label: t(`typeOptions.${option.value}`), value: option.value }))}
        clearable={{ handleClear: () => handleChangeFilters({ type: "" }) }}
      />
      <div className="flex items-center gap-2">
        <SelectInput
          placeholder={t("sortBy")}
          label={t("sortBy")}
          labelVariant="inside"
          value={filters.sortBy}
          onValueChange={(value) => handleChangeFilters({ sortBy: sortOptions.includes(value as VehicleSortBy) ? (value as VehicleSortBy) : "plate" })}
          options={sortOptions.map((sort) => ({ label: t(`sort.${sort}`), value: sort }))}
          fullWidth={false}
        />
        <Button size="icon" variant="outline" aria-label={t("toggleSort")} onClick={() => handleChangeFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}>
          {filters.sortOrder === "asc" ? <ArrowDownAZ className="size-4" /> : <ArrowUpZA className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
