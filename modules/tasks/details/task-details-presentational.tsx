"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly, formatDateTime } from "@/lib/utils/dates";
import { getTaskPriorityInfo, getTaskStatusInfo } from "../lib/types/task.types";
import type { TaskDetails } from "../lib/types/task.types";

export default function TaskDetailsPresentational({ task }: { task: TaskDetails }) {
  const t = useTranslations("taskDetails");
  const statusInfo = getTaskStatusInfo(task.status);
  const priorityInfo = getTaskPriorityInfo(task.priority);
  const fields = [
    [t("descriptionLabel"), task.description ?? t("notProvided")],
    [t("dueDate"), formatDateOnly(task.dueDate)],
    [t("createdAt"), formatDateTime(task.createdAt)],
    [t("updatedAt"), formatDateTime(task.updatedAt)],
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{task.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge className={statusInfo.className}>{t(`status.${task.status}`)}</Badge>
          <Badge className={priorityInfo.className}>{t(`priority.${task.priority}`)}</Badge>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-md border p-3">
            <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
