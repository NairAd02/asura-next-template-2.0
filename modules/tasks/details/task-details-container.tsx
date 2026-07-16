"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useTask } from "../lib/hooks/use-task";
import TaskDetailsPresentational from "./task-details-presentational";

export default function TaskDetailsContainer({ taskId }: { taskId: string }) {
  const { task, isLoading, error } = useTask(taskId);
  return <DetailsContainerWrapper data={task} isLoading={isLoading} error={error} entityKey="item">{(data) => <TaskDetailsPresentational task={data} />}</DetailsContainerWrapper>;
}
