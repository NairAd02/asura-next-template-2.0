"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, ListTodo, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateOnly, formatDateTime } from "@/lib/utils/dates";
import { getTaskPriorityInfo, getTaskStatusInfo } from "../lib/types/task.types";
import type { Task } from "../lib/types/task.types";

interface Props {
  tasks: Task[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TasksListTableView({ tasks, onView, onEdit, onStatus, onDelete }: Props) {
  const t = useTranslations("tasks");
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: t("columns.task"),
      cell: ({ row }) => (
        <div className="max-w-[320px]">
          <div className="truncate font-medium">{row.original.title}</div>
          <div className="truncate text-xs text-muted-foreground">{row.original.description ?? t("notProvided")}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const info = getTaskStatusInfo(row.original.status);
        return <Badge className={info.className}>{t(`status.${row.original.status}`)}</Badge>;
      },
    },
    {
      accessorKey: "priority",
      header: t("columns.priority"),
      cell: ({ row }) => {
        const info = getTaskPriorityInfo(row.original.priority);
        return <Badge className={info.className}>{t(`priority.${row.original.priority}`)}</Badge>;
      },
    },
    { accessorKey: "dueDate", header: t("columns.dueDate"), cell: ({ row }) => <span>{formatDateOnly(row.original.dueDate)}</span> },
    { accessorKey: "createdAt", header: t("columns.created"), cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span> },
    {
      id: "actions",
      header: t("columns.actions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {[
            { label: t("actions.view"), icon: Eye, action: onView, className: "text-primary" },
            { label: t("actions.edit"), icon: Edit, action: onEdit, className: "text-primary" },
            { label: t("actions.status"), icon: RefreshCw, action: onStatus, className: "text-amber-600" },
            { label: t("actions.delete"), icon: Trash2, action: onDelete, className: "text-destructive" },
          ].map(({ label, icon: Icon, action, className }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={label} onClick={() => action(row.original.id)}>
                  <Icon className={`size-4 ${className}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      tableId="tasks-list"
      columns={columns}
      data={tasks}
      headerConfig={{ title: t("title"), icon: <ListTodo className="size-6" /> }}
      dataEmptyText={t("empty")}
      showPagination={false}
      maxHeight="calc(100vh - 280px)"
    />
  );
}
