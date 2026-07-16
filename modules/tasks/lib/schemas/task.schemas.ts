import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/task.types";

export interface TaskValidationMessages {
  titleRequired: string;
  titleMin: string;
  titleMax: string;
  descriptionMax: string;
  statusInvalid: string;
  priorityInvalid: string;
  dueDateInvalid: string;
}

function trimEnumValue(value: unknown): unknown {
  return typeof value === "string" ? value.trim() : value;
}

function optionalText(max: number, message: string) {
  return z
    .preprocess(
      (value) => value ?? "",
      z.string({ invalid_type_error: message }).trim().max(max, message),
    )
    .transform((value) => value || null);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function optionalDate(message: string) {
  return z
    .preprocess(
      (value) => value ?? "",
      z.string({ invalid_type_error: message }).trim(),
    )
    .transform((value) => value || null)
    .refine((value) => value === null || isIsoDate(value), message);
}

function taskFields(messages: TaskValidationMessages) {
  return {
    title: z
      .string({ required_error: messages.titleRequired, invalid_type_error: messages.titleRequired })
      .trim()
      .min(1, messages.titleRequired)
      .min(2, messages.titleMin)
      .max(120, messages.titleMax),
    description: optionalText(500, messages.descriptionMax),
    status: z
      .preprocess(
        trimEnumValue,
        z.enum(TASK_STATUSES, {
          required_error: messages.statusInvalid,
          invalid_type_error: messages.statusInvalid,
        }),
      ),
    priority: z
      .preprocess(
        trimEnumValue,
        z.enum(TASK_PRIORITIES, {
          required_error: messages.priorityInvalid,
          invalid_type_error: messages.priorityInvalid,
        }),
      ),
    dueDate: optionalDate(messages.dueDateInvalid),
  };
}

export const createTaskSchema = (messages: TaskValidationMessages) =>
  z.object({
    ...taskFields(messages),
    status: taskFields(messages).status.default("todo"),
    priority: taskFields(messages).priority.default("medium"),
  });

export const editTaskSchema = (messages: TaskValidationMessages) =>
  z.object(taskFields(messages));

export type CreateTaskInput = z.input<ReturnType<typeof createTaskSchema>>;
export type CreateTaskOutput = z.output<ReturnType<typeof createTaskSchema>>;
export type EditTaskInput = z.input<ReturnType<typeof editTaskSchema>>;
export type EditTaskOutput = z.output<ReturnType<typeof editTaskSchema>>;
