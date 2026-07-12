"use client";

import SearchInput from "@/components/inputs/search-input/search-input";
import SelectInput from "@/components/inputs/select-input/select-input";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslations } from "next-intl";
import { ItemFilters, ITEM_STATUS_VALUES } from "../lib/types/item.types";
import { useEffect, useState } from "react";
import { getAllItemCategoriesAction } from "@/modules/item-categories/lib/actions/item-category.actions";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  filters: ItemFilters;
  handleChangeFilters: (newFilters: Partial<ItemFilters>) => void;
}

export default function ItemsFiltersPresentational({
  filters,
  handleChangeFilters,
}: Props) {
  const t = useTranslations("filters");
  const tCard = useTranslations("itemCard");
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    getAllItemCategoriesAction({ isActive: true, limit: 100 })
      .then((res) =>
        setCategoryOptions(res.itemCategories.map((c) => ({ label: c.name, value: c.id }))),
      )
      .catch(() => {});
  }, []);

  const statusOptions = ITEM_STATUS_VALUES.map((s) => ({
    label: tCard(`statusValues.${s}`),
    value: s,
  }));

  const sortByOptions = [
    { label: t("sortByCreated"), value: "createdAt" },
    { label: t("sortByName"), value: "name" },
    { label: t("sortByStatus"), value: "status" },
  ];

  return (
    <div className="grid gap-2 lg:gap-3 items-center grid-cols-1 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_1fr_auto]">
      <div className="sm:col-span-2 2xl:col-span-1">
        <SearchInput
          id="items-search"
          placeHolder={t("searchByName")}
          value={filters.search}
          onChange={(e) => handleChangeFilters({ search: e.target.value })}
        />
      </div>

      <div>
        <SelectInput
          placeholder={t("status")}
          value={filters.status}
          onValueChange={(value) =>
            handleChangeFilters({ status: value as ItemFilters["status"] })
          }
          options={statusOptions}
          clearable={{ handleClear: () => handleChangeFilters({ status: "" }) }}
        />
      </div>

      <div>
        <SelectInput
          placeholder={t("category")}
          value={filters.itemCategoryId?.id || ""}
          onValueChange={(value) => {
            const selectedCategory = categoryOptions.find((c) => c.value === value);
            handleChangeFilters({
              itemCategoryId: selectedCategory
                ? { id: selectedCategory.value, label: selectedCategory.label }
                : null,
            });
          }}
          options={categoryOptions}
          clearable={{
            handleClear: () => handleChangeFilters({ itemCategoryId: null }),
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <SelectInput
          placeholder={t("sortBy")}
          label={t("sortBy")}
          labelVariant="inside"
          value={filters.sortBy}
          onValueChange={(value) => handleChangeFilters({ sortBy: value })}
          options={sortByOptions}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            handleChangeFilters({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
          aria-label={
            filters.sortOrder === "asc" ? t("sortDescending") : t("sortAscending")
          }
        >
          {filters.sortOrder === "asc" ? (
            <ArrowDownAZ className="h-4 w-4" />
          ) : (
            <ArrowUpZA className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
