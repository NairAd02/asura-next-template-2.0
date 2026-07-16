"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaskFilters } from "../lib/types/task.types";

interface Props {
  filters: TaskFilters;
  activeFiltersCount: number;
  handleChangeFilters: (patch: Partial<TaskFilters>) => void;
  handleResetFilters: () => void;
}

export default function TasksActiveFilters({
  filters,
  activeFiltersCount,
  handleChangeFilters,
  handleResetFilters,
}: Props) {
  const t = useTranslations("filters");
  const tasksT = useTranslations("tasks.filters");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">{t("activeFilters", { count: activeFiltersCount })}:</span>
      {filters.search && (
        <Badge variant="secondary" className="gap-1">
          {t("search")}: {filters.search}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ search: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {filters.status && (
        <Badge variant="secondary" className="gap-1">
          {tasksT("status")}: {tasksT(`statusOptions.${filters.status}`)}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ status: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {filters.priority && (
        <Badge variant="secondary" className="gap-1">
          {tasksT("priority")}: {tasksT(`priorityOptions.${filters.priority}`)}
          <button type="button" aria-label={t("removeFilter")} onClick={() => handleChangeFilters({ priority: "" })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleResetFilters}>
        {t("clearAll")}
      </Button>
    </div>
  );
}
