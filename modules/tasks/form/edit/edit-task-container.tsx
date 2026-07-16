"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useTask } from "../../lib/hooks/use-task";
import EditTaskFormContainer from "./edit-task-form-container";

export default function EditTaskContainer({ taskId, onClose }: { taskId: string; onClose?: () => void }) {
  const { task, isLoading, error } = useTask(taskId);
  return <DetailsContainerWrapper data={task} isLoading={isLoading} error={error} entityKey="item">{(data) => <EditTaskFormContainer task={data} onClose={onClose} />}</DetailsContainerWrapper>;
}
