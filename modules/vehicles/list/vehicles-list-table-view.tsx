"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Car, Edit, Eye, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/utils/dates";
import { getVehicleStatusInfo } from "../lib/types/vehicle.types";
import type { Vehicle } from "../lib/types/vehicle.types";

interface Props {
  vehicles: Vehicle[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VehiclesListTableView({ vehicles, onView, onEdit, onStatus, onDelete }: Props) {
  const t = useTranslations("vehicles");
  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "plate",
      header: t("columns.vehicle"),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.plate}</div>
          <div className="text-xs text-muted-foreground">{row.original.make} {row.original.model}</div>
        </div>
      ),
    },
    { accessorKey: "vin", header: t("columns.vin"), cell: ({ row }) => <span className="font-mono text-xs">{row.original.vin}</span> },
    { accessorKey: "type", header: t("columns.type"), cell: ({ row }) => t(`type.${row.original.type}`) },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const info = getVehicleStatusInfo(row.original.status);
        return <Badge className={info.className}>{t(`status.${row.original.status}`)}</Badge>;
      },
    },
    { accessorKey: "branch", header: t("columns.branch") },
    { accessorKey: "odometer", header: t("columns.odometer"), cell: ({ row }) => t("odometerValue", { value: row.original.odometer }) },
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
      tableId="vehicles-list"
      columns={columns}
      data={vehicles}
      headerConfig={{ title: t("title"), icon: <Car className="size-6" /> }}
      dataEmptyText={t("empty")}
      showPagination={false}
      maxHeight="calc(100vh - 280px)"
    />
  );
}
