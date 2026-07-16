"use client";

import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/inputs/search-input/search-input";
import SelectInput from "@/components/inputs/select-input/select-input";
import { Button } from "@/components/ui/button";
import type { SupplierFilters } from "../lib/types/supplier.types";

interface Props {
  filters: SupplierFilters;
  handleChangeFilters: (patch: Partial<SupplierFilters>) => void;
}

export default function SuppliersFiltersPresentational({ filters, handleChangeFilters }: Props) {
  const t = useTranslations("suppliers.filters");
  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_auto] 2xl:gap-3">
      <div className="sm:col-span-2 2xl:col-span-1">
        <SearchInput id="suppliers-search" placeHolder={t("searchPlaceholder")} value={filters.search} onChange={(event) => handleChangeFilters({ search: event.target.value })} />
      </div>
      <SelectInput
        placeholder={t("status")}
        value={filters.isActive === "" ? "" : String(filters.isActive)}
        onValueChange={(value) => handleChangeFilters({ isActive: value === "true" ? true : value === "false" ? false : "" })}
        options={[{ label: t("active"), value: "true" }, { label: t("inactive"), value: "false" }]}
        clearable={{ handleClear: () => handleChangeFilters({ isActive: "" }) }}
      />
      <div className="flex items-center gap-2">
        <SelectInput
          placeholder={t("sortBy")}
          label={t("sortBy")}
          labelVariant="inside"
          value={filters.sortBy}
          onValueChange={(value) => handleChangeFilters({ sortBy: value === "createdAt" ? "createdAt" : "name" })}
          options={[{ label: t("sortName"), value: "name" }, { label: t("sortCreated"), value: "createdAt" }]}
          fullWidth={false}
        />
        <Button size="icon" variant="outline" aria-label={t("toggleSort")} onClick={() => handleChangeFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}>
          {filters.sortOrder === "asc" ? <ArrowDownAZ className="size-4" /> : <ArrowUpZA className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
