import type { Task } from "../types/task.types";

export const taskSeeds: readonly Task[] = [
  {
    id: "task-001",
    title: "Review supplier onboarding",
    description: "Check the latest supplier intake notes before the pilot review.",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-22",
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "task-002",
    title: "Update fleet maintenance notes",
    description: "Fold vehicle inspection reminders into the operations checklist.",
    status: "inProgress",
    priority: "medium",
    dueDate: "2026-07-24",
    createdAt: "2026-07-02T10:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z",
  },
  {
    id: "task-003",
    title: "Confirm dashboard empty states",
    description: "Verify that empty list states still expose the create action.",
    status: "done",
    priority: "low",
    dueDate: null,
    createdAt: "2026-07-03T11:00:00.000Z",
    updatedAt: "2026-07-03T11:00:00.000Z",
  },
  {
    id: "task-004",
    title: "Prepare Spanish copy review",
    description: "Collect task labels and validation strings for localization.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-07-28",
    createdAt: "2026-07-04T12:00:00.000Z",
    updatedAt: "2026-07-04T12:00:00.000Z",
  },
  {
    id: "task-005",
    title: "Audit URL filter behavior",
    description: "Exercise search, status, priority, sort, page, and limit parameters.",
    status: "inProgress",
    priority: "high",
    dueDate: "2026-07-26",
    createdAt: "2026-07-05T13:00:00.000Z",
    updatedAt: "2026-07-05T13:00:00.000Z",
  },
  {
    id: "task-006",
    title: "Document mock persistence limit",
    description: "Ensure UI copy does not imply durable storage.",
    status: "todo",
    priority: "low",
    dueDate: null,
    createdAt: "2026-07-06T14:00:00.000Z",
    updatedAt: "2026-07-06T14:00:00.000Z",
  },
  {
    id: "task-007",
    title: "Validate modal close states",
    description: "Check create, edit, detail, delete, and status modal reset behavior.",
    status: "done",
    priority: "medium",
    dueDate: "2026-07-20",
    createdAt: "2026-07-07T15:00:00.000Z",
    updatedAt: "2026-07-07T15:00:00.000Z",
  },
  {
    id: "task-008",
    title: "Review pagination edge cases",
    description: "Confirm later pages clamp when filters shrink the result set.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-07-30",
    createdAt: "2026-07-08T16:00:00.000Z",
    updatedAt: "2026-07-08T16:00:00.000Z",
  },
  {
    id: "task-009",
    title: "Run focused task tests",
    description: "Add deterministic tests for schemas, actions, services, and reset helpers.",
    status: "inProgress",
    priority: "high",
    dueDate: "2026-07-18",
    createdAt: "2026-07-09T17:00:00.000Z",
    updatedAt: "2026-07-09T17:00:00.000Z",
  },
  {
    id: "task-010",
    title: "Check sidebar navigation wiring",
    description: "Verify the Catalog entry points to the localized tasks route.",
    status: "todo",
    priority: "low",
    dueDate: null,
    createdAt: "2026-07-10T18:00:00.000Z",
    updatedAt: "2026-07-10T18:00:00.000Z",
  },
  {
    id: "task-011",
    title: "Polish responsive task cards",
    description: "Confirm mobile cards expose every row action available on desktop.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-01",
    createdAt: "2026-07-11T19:00:00.000Z",
    updatedAt: "2026-07-11T19:00:00.000Z",
  },
  {
    id: "task-012",
    title: "Archive verification notes",
    description: "Prepare final evidence after implementation and full verification pass.",
    status: "todo",
    priority: "high",
    dueDate: "2026-08-02",
    createdAt: "2026-07-12T20:00:00.000Z",
    updatedAt: "2026-07-12T20:00:00.000Z",
  },
];

const globalStore = globalThis as typeof globalThis & {
  __nextTemplateTasksStore?: Task[];
};

function cloneSeeds(): Task[] {
  return taskSeeds.map((task) => ({ ...task }));
}

export function getTasksStore(): Task[] {
  globalStore.__nextTemplateTasksStore ??= cloneSeeds();
  return globalStore.__nextTemplateTasksStore;
}

export function resetTasksStore(): Task[] {
  globalStore.__nextTemplateTasksStore = cloneSeeds();
  return globalStore.__nextTemplateTasksStore;
}
