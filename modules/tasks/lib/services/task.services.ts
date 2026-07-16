import "server-only";

import { randomUUID } from "node:crypto";
import type { ServiceResponse } from "@/lib/api-responses";
import { deleteRecord, findById, updateRecord } from "@/lib/mock/in-memory-store";
import { getTasksStore } from "../mock/tasks.data";
import { sanitizeTaskFilters } from "../types/task.types";
import type {
  CreateTaskDto,
  EditTaskDto,
  Task,
  TaskDetails,
  TaskFiltersDto,
  TaskPriority,
  TasksResponse,
  TaskStatus,
} from "../types/task.types";

const STATUS_ORDER: Record<TaskStatus, number> = { todo: 1, inProgress: 2, done: 3 };
const PRIORITY_ORDER: Record<TaskPriority, number> = { low: 1, medium: 2, high: 3 };

function failure<T>(code: string, message: string): ServiceResponse<T> {
  return { success: false, error: { code, message } };
}

function normalizeTitle(value: string): string {
  return value.trim();
}

function normalizedTitleKey(value: string): string {
  return normalizeTitle(value).toLocaleLowerCase();
}

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function duplicateTitle(title: string, excludedId?: string): boolean {
  const target = normalizedTitleKey(title);
  return getTasksStore().some((task) => task.id !== excludedId && normalizedTitleKey(task.title) === target);
}

function matchesSearch(task: Task, search: string): boolean {
  return [task.title, task.description].some((value) => value?.toLocaleLowerCase().includes(search));
}

function compareNullableDate(left: string | null, right: string | null): number {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left.localeCompare(right);
}

function compareTasks(left: Task, right: Task, filters: TaskFiltersDto): number {
  let comparison = 0;

  if (filters.sortBy === "status") {
    comparison = STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
  } else if (filters.sortBy === "priority") {
    comparison = PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority];
  } else if (filters.sortBy === "dueDate") {
    comparison = compareNullableDate(left.dueDate, right.dueDate);
  } else {
    comparison = left[filters.sortBy].localeCompare(right[filters.sortBy], undefined, {
      sensitivity: "base",
    });
  }

  return filters.sortOrder === "asc" ? comparison : -comparison;
}

export async function getAllTasks(input: unknown = {}): Promise<TasksResponse> {
  const filters: TaskFiltersDto = sanitizeTaskFilters(input);
  const search = filters.search?.toLocaleLowerCase();
  let tasks = [...getTasksStore()];

  if (search) {
    tasks = tasks.filter((task) => matchesSearch(task, search));
  }
  if (filters.status) {
    tasks = tasks.filter((task) => task.status === filters.status);
  }
  if (filters.priority) {
    tasks = tasks.filter((task) => task.priority === filters.priority);
  }

  tasks.sort((left, right) => compareTasks(left, right, filters));

  const total = tasks.length;
  const totalPages = Math.ceil(total / filters.limit);
  const page = totalPages > 0 ? Math.min(filters.page, totalPages) : 1;
  const start = (page - 1) * filters.limit;

  return {
    tasks: tasks.slice(start, start + filters.limit),
    pagination: {
      page,
      limit: filters.limit,
      total,
      totalPages,
    },
  };
}

export async function getTaskById(id: string): Promise<ServiceResponse<TaskDetails>> {
  try {
    const task = findById(getTasksStore(), id);
    return task ? { success: true, data: task } : failure("NOT_FOUND", "Task not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to get task: ${String(error)}`);
  }
}

export async function createTask(dto: CreateTaskDto): Promise<ServiceResponse<TaskDetails>> {
  try {
    if (duplicateTitle(dto.title)) return failure("ALREADY_EXISTS", "Task title already exists");

    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: normalizeTitle(dto.title),
      description: normalizeOptional(dto.description),
      status: dto.status ?? "todo",
      priority: dto.priority ?? "medium",
      dueDate: dto.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };

    getTasksStore().push(task);
    return { success: true, data: task };
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to create task: ${String(error)}`);
  }
}

export async function editTask(id: string, dto: EditTaskDto): Promise<ServiceResponse<TaskDetails>> {
  try {
    if (!findById(getTasksStore(), id)) return failure("NOT_FOUND", "Task not found");
    if (duplicateTitle(dto.title, id)) return failure("ALREADY_EXISTS", "Task title already exists");

    const updated = updateRecord(getTasksStore(), id, {
      title: normalizeTitle(dto.title),
      description: normalizeOptional(dto.description),
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ?? null,
      updatedAt: new Date().toISOString(),
    });

    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Task not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to edit task: ${String(error)}`);
  }
}

export async function deleteTask(id: string): Promise<ServiceResponse<void>> {
  try {
    return deleteRecord(getTasksStore(), id)
      ? { success: true, data: undefined }
      : failure("NOT_FOUND", "Task not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to delete task: ${String(error)}`);
  }
}

export async function changeTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<ServiceResponse<TaskDetails>> {
  try {
    const updated = updateRecord(getTasksStore(), id, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return updated ? { success: true, data: updated } : failure("NOT_FOUND", "Task not found");
  } catch (error) {
    return failure("INTERNAL_ERROR", `Failed to change task status: ${String(error)}`);
  }
}
