import type { CreateTaskOutput, EditTaskOutput } from "../schemas/task.schemas";

export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskSortBy = "title" | "status" | "priority" | "dueDate" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskDetails = Task;

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface EditTaskDto {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface TaskFiltersDto {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TaskStatusInfo {
  label: string;
  labelKey: string;
  className: string;
}

interface TaskPriorityInfo {
  label: string;
  labelKey: string;
  className: string;
}

export const TASK_STATUSES = ["todo", "inProgress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

const ALLOWED_LIMITS = new Set([5, 10, 20, 30]);
const ALLOWED_SORTS = new Set<TaskSortBy>(["title", "status", "priority", "dueDate", "createdAt"]);

const taskStatusConfig: Record<TaskStatus, TaskStatusInfo> = {
  todo: {
    label: "To do",
    labelKey: "statuses.todo",
    className: "bg-slate-100 text-slate-700",
  },
  inProgress: {
    label: "In progress",
    labelKey: "statuses.inProgress",
    className: "bg-sky-100 text-sky-700",
  },
  done: {
    label: "Done",
    labelKey: "statuses.done",
    className: "bg-emerald-100 text-emerald-700",
  },
};

const taskPriorityConfig: Record<TaskPriority, TaskPriorityInfo> = {
  low: {
    label: "Low",
    labelKey: "priorities.low",
    className: "bg-gray-100 text-gray-700",
  },
  medium: {
    label: "Medium",
    labelKey: "priorities.medium",
    className: "bg-amber-100 text-amber-700",
  },
  high: {
    label: "High",
    labelKey: "priorities.high",
    className: "bg-rose-100 text-rose-700",
  },
};

export const taskStatusOptions: readonly (TaskStatusInfo & { value: TaskStatus })[] =
  TASK_STATUSES.map((value) => ({ value, ...taskStatusConfig[value] }));

export const taskPriorityOptions: readonly (TaskPriorityInfo & { value: TaskPriority })[] =
  TASK_PRIORITIES.map((value) => ({ value, ...taskPriorityConfig[value] }));

export function getTaskStatusInfo(status: TaskStatus): TaskStatusInfo {
  return taskStatusConfig[status];
}

export function getTaskPriorityInfo(priority: TaskPriority): TaskPriorityInfo {
  return taskPriorityConfig[priority];
}

function scalar(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(scalar(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus);
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && TASK_PRIORITIES.includes(value as TaskPriority);
}

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function sanitizeTaskFilters(input: unknown = {}): TaskFiltersDto {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const page = positiveInteger(source.page, 1);
  const candidateLimit = positiveInteger(source.limit, 10);
  const rawSearch = scalar(source.search);
  const search = typeof rawSearch === "string" ? rawSearch.trim().slice(0, 200) : "";
  const rawStatus = scalar(source.status);
  const status = isTaskStatus(rawStatus) ? rawStatus : undefined;
  const rawPriority = scalar(source.priority);
  const priority = isTaskPriority(rawPriority) ? rawPriority : undefined;
  const rawSort = scalar(source.sortBy);
  const sortBy = typeof rawSort === "string" && ALLOWED_SORTS.has(rawSort as TaskSortBy)
    ? (rawSort as TaskSortBy)
    : "createdAt";
  const rawOrder = scalar(source.sortOrder);
  const sortOrder: SortOrder = rawOrder === "desc" ? "desc" : "asc";

  return {
    page,
    limit: ALLOWED_LIMITS.has(candidateLimit) ? candidateLimit : 10,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    sortBy,
    sortOrder,
  };
}

export function taskFiltersToUrl(filters: TaskFilters): Partial<TaskFiltersDto> {
  return {
    search: filters.search.trim() || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}

export function toCreateTaskDto(input: CreateTaskOutput): CreateTaskDto {
  return {
    title: input.title.trim(),
    description: normalizeOptional(input.description),
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate ?? null,
  };
}

export function toEditTaskDto(input: EditTaskOutput): EditTaskDto {
  return {
    title: input.title.trim(),
    description: normalizeOptional(input.description),
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate ?? null,
  };
}
