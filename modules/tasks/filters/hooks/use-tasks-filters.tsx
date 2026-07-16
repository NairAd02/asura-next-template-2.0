"use client";

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useUrlFilters from "@/hooks/use-url-filters";
import { taskFiltersToUrl, taskPriorityOptions, taskStatusOptions } from "../../lib/types/task.types";
import type { TaskFilters, TaskFiltersDto, TaskPriority, TaskSortBy, TaskStatus } from "../../lib/types/task.types";

const allowedStatuses = new Set<TaskStatus>(taskStatusOptions.map((option) => option.value));
const allowedPriorities = new Set<TaskPriority>(taskPriorityOptions.map((option) => option.value));
const allowedSorts = new Set<TaskSortBy>(["title", "status", "priority", "dueDate", "createdAt"]);

function statusFromParam(value: string | null): TaskStatus | "" {
  return value && allowedStatuses.has(value as TaskStatus) ? (value as TaskStatus) : "";
}

function priorityFromParam(value: string | null): TaskPriority | "" {
  return value && allowedPriorities.has(value as TaskPriority) ? (value as TaskPriority) : "";
}

function sortFromParam(value: string | null): TaskSortBy {
  return value && allowedSorts.has(value as TaskSortBy) ? (value as TaskSortBy) : "createdAt";
}

interface Props {
  setPagination?: Dispatch<SetStateAction<TaskFiltersDto>>;
  urlFilters?: boolean;
}

const defaultTaskFilters: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  sortOrder: "asc",
};

export default function useTasksFilters({ setPagination, urlFilters = true }: Props = {}) {
  const params = useSearchParams();
  const { updateFiltersInUrl } = useUrlFilters({});
  const [filters, setFilters] = useState<TaskFilters>(() => ({
    search: params.get("search") ?? "",
    status: statusFromParam(params.get("status")),
    priority: priorityFromParam(params.get("priority")),
    sortBy: sortFromParam(params.get("sortBy")),
    sortOrder: params.get("sortOrder") === "desc" ? "desc" : "asc",
  }));

  const handleChangeFilters = useCallback((patch: Partial<TaskFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      if (urlFilters) {
        updateFiltersInUrl({ ...taskFiltersToUrl(next), page: 1 });
      }
      return next;
    });
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultTaskFilters);
    if (urlFilters) {
      updateFiltersInUrl({ ...taskFiltersToUrl(defaultTaskFilters), page: 1 });
    }
    if (setPagination) {
      setPagination((current) => ({ ...current, page: 1 }));
    }
  }, [setPagination, updateFiltersInUrl, urlFilters]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    return count;
  }, [filters.priority, filters.search, filters.status]);

  return { filters, handleChangeFilters, handleResetFilters, getActiveFiltersCount };
}
