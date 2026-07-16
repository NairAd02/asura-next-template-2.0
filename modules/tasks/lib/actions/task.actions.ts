"use server";

import { z } from "zod";
import type { ServiceResponse } from "@/lib/api-responses";
import { createTaskSchema, editTaskSchema } from "../schemas/task.schemas";
import {
  changeTaskStatus,
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTaskById,
} from "../services/task.services";
import { TASK_STATUSES, toCreateTaskDto, toEditTaskDto } from "../types/task.types";
import type { TaskDetails, TasksResponse } from "../types/task.types";

const SERVER_MESSAGES = {
  titleRequired: "TITLE_REQUIRED",
  titleMin: "TITLE_MIN",
  titleMax: "TITLE_MAX",
  descriptionMax: "DESCRIPTION_MAX",
  statusInvalid: "STATUS_INVALID",
  priorityInvalid: "PRIORITY_INVALID",
  dueDateInvalid: "DUE_DATE_INVALID",
};

const idSchema = z.string().trim().min(1);
const statusSchema = z.enum(TASK_STATUSES);

function validationFailure(issues: z.ZodIssue[]): ServiceResponse<never> {
  return {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid task data",
      details: {
        issues: issues.map((issue) => ({ path: issue.path.join("."), code: issue.message })),
      },
    },
  };
}

export async function getAllTasksAction(filters: unknown = {}): Promise<TasksResponse> {
  return await getAllTasks(filters);
}

export async function getTaskByIdAction(id: string): Promise<ServiceResponse<TaskDetails>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await getTaskById(parsed.data) : validationFailure(parsed.error.issues);
}

export async function createTaskAction(input: unknown): Promise<ServiceResponse<TaskDetails>> {
  const parsed = createTaskSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await createTask(toCreateTaskDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function editTaskAction(id: string, input: unknown): Promise<ServiceResponse<TaskDetails>> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error.issues);

  const parsed = editTaskSchema(SERVER_MESSAGES).safeParse(input);
  return parsed.success
    ? await editTask(parsedId.data, toEditTaskDto(parsed.data))
    : validationFailure(parsed.error.issues);
}

export async function deleteTaskAction(id: string): Promise<ServiceResponse<void>> {
  const parsed = idSchema.safeParse(id);
  return parsed.success ? await deleteTask(parsed.data) : validationFailure(parsed.error.issues);
}

export async function changeTaskStatusAction(id: string, status: unknown): Promise<ServiceResponse<TaskDetails>> {
  const parsed = z.object({ id: idSchema, status: statusSchema }).safeParse({ id, status });
  return parsed.success
    ? await changeTaskStatus(parsed.data.id, parsed.data.status)
    : validationFailure(parsed.error.issues);
}
