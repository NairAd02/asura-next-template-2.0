"use client";

import { Edit, Eye, ListTodo, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardViewWrapper } from "@/components/ui/card-view-wrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDateOnly } from "@/lib/utils/dates";
import { getTaskPriorityInfo, getTaskStatusInfo } from "../lib/types/task.types";
import type { Task } from "../lib/types/task.types";

interface Props {
  tasks: Task[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TasksListCardsView({ tasks, onView, onEdit, onStatus, onDelete }: Props) {
  const t = useTranslations("tasks");

  return (
    <CardViewWrapper headerConfig={{ title: t("title"), icon: <ListTodo className="size-6" /> }}>
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tasks.map((task) => {
            const statusInfo = getTaskStatusInfo(task.status);
            const priorityInfo = getTaskPriorityInfo(task.priority);
            return (
              <article key={task.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{task.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{task.description ?? t("notProvided")}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{t("dueDateValue", { value: formatDateOnly(task.dueDate) })}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={t("columns.actions")}><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(task.id)}><Eye />{t("actions.view")}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEdit(task.id)}><Edit />{t("actions.edit")}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onStatus(task.id)}><RefreshCw />{t("actions.status")}</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(task.id)}><Trash2 />{t("actions.delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className={statusInfo.className}>{t(`status.${task.status}`)}</Badge>
                  <Badge className={priorityInfo.className}>{t(`priority.${task.priority}`)}</Badge>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </CardViewWrapper>
  );
}
