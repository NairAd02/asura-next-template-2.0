"use client";

import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/inputs/search-input/search-input";
import SelectInput from "@/components/inputs/select-input/select-input";
import { Button } from "@/components/ui/button";
import { taskPriorityOptions, taskStatusOptions } from "../lib/types/task.types";
import type { TaskFilters, TaskSortBy } from "../lib/types/task.types";

interface Props {
  filters: TaskFilters;
  handleChangeFilters: (patch: Partial<TaskFilters>) => void;
}

const sortOptions: TaskSortBy[] = ["title", "status", "priority", "dueDate", "createdAt"];

export default function TasksFiltersPresentational({ filters, handleChangeFilters }: Props) {
  const t = useTranslations("tasks.filters");

  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 2xl:grid-cols-[2fr_1fr_1fr_auto] 2xl:gap-3">
      <div className="sm:col-span-2 2xl:col-span-1">
        <SearchInput id="tasks-search" placeHolder={t("searchPlaceholder")} value={filters.search} onChange={(event) => handleChangeFilters({ search: event.target.value })} />
      </div>
      <SelectInput
        placeholder={t("status")}
        value={filters.status}
        onValueChange={(value) => handleChangeFilters({ status: value === "" ? "" : (value as TaskFilters["status"]) })}
        options={taskStatusOptions.map((option) => ({ label: t(`statusOptions.${option.value}`), value: option.value }))}
        clearable={{ handleClear: () => handleChangeFilters({ status: "" }) }}
      />
      <SelectInput
        placeholder={t("priority")}
        value={filters.priority}
        onValueChange={(value) => handleChangeFilters({ priority: value === "" ? "" : (value as TaskFilters["priority"]) })}
        options={taskPriorityOptions.map((option) => ({ label: t(`priorityOptions.${option.value}`), value: option.value }))}
        clearable={{ handleClear: () => handleChangeFilters({ priority: "" }) }}
      />
      <div className="flex items-center gap-2">
        <SelectInput
          placeholder={t("sortBy")}
          label={t("sortBy")}
          labelVariant="inside"
          value={filters.sortBy}
          onValueChange={(value) => handleChangeFilters({ sortBy: sortOptions.includes(value as TaskSortBy) ? (value as TaskSortBy) : "createdAt" })}
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
