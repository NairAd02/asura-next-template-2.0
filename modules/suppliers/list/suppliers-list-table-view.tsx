"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Power, Trash2, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/utils/dates";
import type { Supplier } from "../lib/types/supplier.types";

interface Props { suppliers: Supplier[]; onView: (id: string) => void; onEdit: (id: string) => void; onToggle: (id: string) => void; onDelete: (id: string) => void; }

export default function SuppliersListTableView({ suppliers, onView, onEdit, onToggle, onDelete }: Props) {
  const t = useTranslations("suppliers");
  const columns: ColumnDef<Supplier>[] = [
    { accessorKey: "name", header: t("columns.name"), cell: ({ row }) => <div><div className="font-medium">{row.original.name}</div><div className="text-xs text-muted-foreground">{row.original.email}</div></div> },
    { accessorKey: "contactName", header: t("columns.contact"), cell: ({ row }) => row.original.contactName ?? t("notProvided") },
    { accessorKey: "phone", header: t("columns.phone"), cell: ({ row }) => row.original.phone ?? t("notProvided") },
    { accessorKey: "isActive", header: t("columns.status"), cell: ({ row }) => <Badge className={row.original.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>{t(row.original.isActive ? "active" : "inactive")}</Badge> },
    { accessorKey: "createdAt", header: t("columns.created"), cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span> },
    { id: "actions", header: t("columns.actions"), cell: ({ row }) => <div className="flex items-center gap-1">
      {[
        { label: t("actions.view"), icon: Eye, action: onView, className: "text-primary" },
        { label: t("actions.edit"), icon: Edit, action: onEdit, className: "text-primary" },
        { label: t(row.original.isActive ? "actions.deactivate" : "actions.activate"), icon: Power, action: onToggle, className: row.original.isActive ? "text-amber-600" : "text-green-600" },
        { label: t("actions.delete"), icon: Trash2, action: onDelete, className: "text-destructive" },
      ].map(({ label, icon: Icon, action, className }) => <Tooltip key={label}><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={label} onClick={() => action(row.original.id)}><Icon className={`size-4 ${className}`} /></Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>)}
    </div> },
  ];
  return <DataTable tableId="suppliers-list" columns={columns} data={suppliers} headerConfig={{ title: t("title"), icon: <Truck className="size-6" /> }} dataEmptyText={t("empty")} showPagination={false} maxHeight="calc(100vh - 280px)" />;
}
