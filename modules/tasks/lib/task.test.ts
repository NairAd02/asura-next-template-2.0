import { beforeEach, describe, expect, it } from "vitest";
import {
  changeTaskStatusAction,
  createTaskAction,
  editTaskAction,
} from "./actions/task.actions";
import { getTasksStore, resetTasksStore, taskSeeds } from "./mock/tasks.data";
import { createTaskSchema } from "./schemas/task.schemas";
import {
  changeTaskStatus,
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTaskById,
} from "./services/task.services";
import {
  sanitizeTaskFilters,
  taskFiltersToUrl,
} from "./types/task.types";
import type { CreateTaskDto } from "./types/task.types";

const messages = {
  titleRequired: "title-required",
  titleMin: "title-min",
  titleMax: "title-max",
  descriptionMax: "description-max",
  statusInvalid: "status-invalid",
  priorityInvalid: "priority-invalid",
  dueDateInvalid: "due-date-invalid",
};

const validTask: CreateTaskDto = {
  title: "  Finalize pilot checklist ",
  description: "  Review the final mock workflow notes. ",
  status: "todo",
  priority: "high",
  dueDate: "2026-08-03",
};

beforeEach(() => {
  resetTasksStore();
});

describe("task filters and validation", () => {
  it("sanitizes unsupported query values and preserves supported URL state", () => {
    expect(sanitizeTaskFilters({
      page: "invalid",
      limit: "7",
      search: "  supplier  ",
      status: "blocked",
      priority: "urgent",
      sortBy: "unsupported",
      sortOrder: "sideways",
    })).toEqual({
      page: 1,
      limit: 10,
      search: "supplier",
      sortBy: "createdAt",
      sortOrder: "asc",
    });

    expect(sanitizeTaskFilters({
      page: "2",
      limit: "20",
      search: ["  Modal  "],
      status: "inProgress",
      priority: "high",
      sortBy: "dueDate",
      sortOrder: "desc",
    })).toEqual({
      page: 2,
      limit: 20,
      search: "Modal",
      status: "inProgress",
      priority: "high",
      sortBy: "dueDate",
      sortOrder: "desc",
    });

    expect(taskFiltersToUrl({
      search: "  notes ",
      status: "todo",
      priority: "medium",
      sortBy: "priority",
      sortOrder: "desc",
    })).toEqual({
      search: "notes",
      status: "todo",
      priority: "medium",
      sortBy: "priority",
      sortOrder: "desc",
    });

    expect(taskFiltersToUrl({
      search: "   ",
      status: "",
      priority: "",
      sortBy: "createdAt",
      sortOrder: "asc",
    })).toEqual({
      search: undefined,
      status: undefined,
      priority: undefined,
      sortBy: "createdAt",
      sortOrder: "asc",
    });
  });

  it("normalizes schema input, applies defaults, and rejects invalid server input without mutation", async () => {
    const parsed = createTaskSchema(messages).parse({
      title: "  New task  ",
      description: "  Helpful context  ",
      dueDate: "",
    });
    expect(parsed).toMatchObject({
      title: "New task",
      description: "Helpful context",
      status: "todo",
      priority: "medium",
      dueDate: null,
    });

    expect(() => createTaskSchema(messages).parse({
      title: "x",
      status: "blocked",
      priority: "urgent",
      dueDate: "not-a-date",
    })).toThrow();

    const before = getTasksStore().length;
    const response = await createTaskAction({ title: "", status: "blocked" });
    expect(response.success).toBe(false);
    if (!response.success) expect(response.error.code).toBe("VALIDATION_ERROR");
    expect(getTasksStore()).toHaveLength(before);
  });

  it("queries search, filters, sorting, second pages, and out-of-range pages", async () => {
    const titleMatch = await getAllTasks({ search: "supplier", limit: 5 });
    expect(titleMatch.tasks.map((task) => task.id)).toEqual(["task-001"]);

    const descriptionMatch = await getAllTasks({ search: "localization", limit: 5 });
    expect(descriptionMatch.tasks.map((task) => task.id)).toEqual(["task-004"]);

    const activeHigh = await getAllTasks({
      status: "inProgress",
      priority: "high",
      sortBy: "dueDate",
      sortOrder: "asc",
    });
    expect(activeHigh.tasks.map((task) => task.id)).toEqual(["task-009", "task-005"]);

    const secondPage = await getAllTasks({ page: 2, limit: 5, sortBy: "createdAt", sortOrder: "asc" });
    expect(secondPage.pagination).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
    expect(secondPage.tasks.map((task) => task.id)).toEqual([
      "task-006",
      "task-007",
      "task-008",
      "task-009",
      "task-010",
    ]);

    const clampedPage = await getAllTasks({ page: 20, limit: 5 });
    expect(clampedPage.pagination).toEqual({ page: 3, limit: 5, total: 12, totalPages: 3 });
    expect(clampedPage.tasks.map((task) => task.id)).toEqual(["task-011", "task-012"]);
  });
});

describe("task services", () => {
  it("creates normalized data, keeps it in the live store, and resets deep-cloned seeds", async () => {
    const response = await createTask(validTask);
    expect(response.success).toBe(true);
    if (!response.success) return;

    expect(response.data).toMatchObject({
      title: "Finalize pilot checklist",
      description: "Review the final mock workflow notes.",
      status: "todo",
      priority: "high",
      dueDate: "2026-08-03",
    });
    expect(response.data.createdAt).toBe(response.data.updatedAt);
    expect(getTasksStore().some((task) => task.id === response.data.id)).toBe(true);

    const reset = resetTasksStore();
    expect(reset).toHaveLength(12);
    expect(reset).not.toBe(taskSeeds);
    expect(reset[0]).not.toBe(taskSeeds[0]);
  });

  it("enforces duplicate titles while allowing an edit to keep its own title", async () => {
    const duplicate = await createTask({
      title: "  REVIEW SUPPLIER ONBOARDING ",
      description: null,
    });
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) expect(duplicate.error.code).toBe("ALREADY_EXISTS");

    const ownTitle = await editTask("task-001", {
      title: " review supplier onboarding ",
      description: " Updated details. ",
      status: "inProgress",
      priority: "medium",
      dueDate: null,
    });
    expect(ownTitle.success).toBe(true);
    if (ownTitle.success) {
      expect(ownTitle.data.title).toBe("review supplier onboarding");
      expect(ownTitle.data.description).toBe("Updated details.");
      expect(ownTitle.data.status).toBe("inProgress");
      expect(ownTitle.data.updatedAt).not.toBe(ownTitle.data.createdAt);
    }

    const otherDuplicate = await editTaskAction("task-002", {
      title: "REVIEW SUPPLIER ONBOARDING",
      description: null,
      status: "todo",
      priority: "medium",
      dueDate: null,
    });
    expect(otherDuplicate.success).toBe(false);
    if (!otherDuplicate.success) expect(otherDuplicate.error.code).toBe("ALREADY_EXISTS");
  });

  it("returns NOT_FOUND consistently and mutates status/delete targets", async () => {
    for (const response of [
      await getTaskById("missing"),
      await editTask("missing", {
        title: "Missing task",
        description: null,
        status: "todo",
        priority: "low",
        dueDate: null,
      }),
      await changeTaskStatus("missing", "done"),
      await deleteTask("missing"),
    ]) {
      expect(response.success).toBe(false);
      if (!response.success) expect(response.error.code).toBe("NOT_FOUND");
    }

    const invalidStatus = await changeTaskStatusAction("task-001", "blocked");
    expect(invalidStatus.success).toBe(false);
    if (!invalidStatus.success) expect(invalidStatus.error.code).toBe("VALIDATION_ERROR");
    expect(getTasksStore()[0].status).toBe("todo");

    const changed = await changeTaskStatusAction("task-001", "done");
    expect(changed.success).toBe(true);
    if (changed.success) {
      expect(changed.data.status).toBe("done");
      expect(changed.data.updatedAt).not.toBe(changed.data.createdAt);
    }

    const deleted = await deleteTask("task-001");
    expect(deleted.success).toBe(true);
    expect(getTasksStore()).toHaveLength(11);
    const missingAfterDelete = await getTaskById("task-001");
    expect(missingAfterDelete.success).toBe(false);
  });
});
