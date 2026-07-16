import ModulePagination from "@/components/pagination/module-pagination";
import { getAllTasksAction } from "../lib/actions/task.actions";
import type { TaskFiltersDto } from "../lib/types/task.types";
import TasksListPresentational from "./tasks-list-presentational";

export default async function TasksListContainer({ filters }: { filters: TaskFiltersDto }) {
  const response = await getAllTasksAction(filters);
  return (
    <div>
      <TasksListPresentational tasks={response.tasks} />
      <ModulePagination pagination={response.pagination} limitOptions={[5, 10, 20, 30]} />
    </div>
  );
}
