"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/modal/modal";
import type { Task } from "../lib/types/task.types";
import DeleteTaskContainer from "../delete/delete-task-container";
import TaskDetailsContainer from "../details/task-details-container";
import EditTaskContainer from "../form/edit/edit-task-container";
import ChangeTaskStatusContainer from "../status/change-task-status-container";
import TasksListCardsView from "./tasks-list-cards-view";
import TasksListTableView from "./tasks-list-table-view";
import {
  useDeleteTaskListAction,
  useEditTaskListAction,
  useViewTaskListAction,
} from "./hooks";

export default function TasksListPresentational({ tasks }: { tasks: Task[] }) {
  const t = useTranslations("taskDetails");
  const {
    editingItemId,
    isModalOpen: isEditModalOpen,
    handleEditItem,
    handleCloseModal,
    handleModalOpenChange: handleEditModalOpenChange,
  } = useEditTaskListAction();
  const {
    viewingItemId,
    isModalOpen: isViewModalOpen,
    handleViewItem,
    handleModalOpenChange: handleViewModalOpenChange,
  } = useViewTaskListAction();
  const {
    deletingItemId,
    isDeleteDialogOpen,
    handleDeleteItem,
    handleDeleteDialogOpenChange,
  } = useDeleteTaskListAction();
  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleChangeStatus = (id: string) => {
    setChangingStatusId(id);
    setIsStatusDialogOpen(true);
  };
  const handleStatusDialogOpenChange = (open: boolean) => {
    setIsStatusDialogOpen(open);
    if (!open) setChangingStatusId(null);
  };
  const actions = { onView: handleViewItem, onEdit: handleEditItem, onStatus: handleChangeStatus, onDelete: handleDeleteItem };
  const statusTask = tasks.find((task) => task.id === changingStatusId);

  return (
    <div className="pb-4">
      <div className="hidden md:block">
        <TasksListTableView tasks={tasks} {...actions} />
      </div>
      <div className="block md:hidden">
        <TasksListCardsView tasks={tasks} {...actions} />
      </div>
      <Modal open={isEditModalOpen} onOpenChange={handleEditModalOpenChange} title={t("editTitle")} description={t("editDescription")} maxWidth="2xl" bodyClassName="px-0 py-0 pb-4">
        {editingItemId && <EditTaskContainer taskId={editingItemId} onClose={handleCloseModal} />}
      </Modal>
      <Modal open={isViewModalOpen} onOpenChange={handleViewModalOpenChange} title={t("title")} description={t("description")} maxWidth="xl" maxHeight="lg">
        {viewingItemId && <TaskDetailsContainer taskId={viewingItemId} />}
      </Modal>
      {deletingItemId && <DeleteTaskContainer taskId={deletingItemId} open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange} />}
      {statusTask && (
        <ChangeTaskStatusContainer
          taskId={statusTask.id}
          currentStatus={statusTask.status}
          open={isStatusDialogOpen}
          onOpenChange={handleStatusDialogOpenChange}
        />
      )}
    </div>
  );
}
