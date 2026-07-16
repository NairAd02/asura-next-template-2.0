import { Suspense } from "react";
import { ListTodo } from "lucide-react";
import { getTranslations } from "next-intl/server";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import type { TaskFiltersDto } from "./lib/types/task.types";
import TasksFiltersContainer from "./filters/tasks-filters-container";
import CreateTaskTrigger from "./form/create/create-task-trigger";
import TasksListContainer from "./list/tasks-list-container";
import TasksListLoadingSkeleton from "./list/tasks-list-loading-skeleton";

export default async function TasksContent({ filters }: { filters: TaskFiltersDto }) {
  const t = await getTranslations("tasks");
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t("title")}
        description={t("description")}
        icon={<ListTodo className="h-10 w-10" />}
        actionTrigger={<CreateTaskTrigger />}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={4} />}>
          <TasksFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`tasks-list-${filtersKey}`} fallback={<TasksListLoadingSkeleton />}>
          <TasksListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
