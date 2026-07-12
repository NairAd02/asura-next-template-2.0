"use client";

import { Item } from "../lib/types/item.types";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, RefreshCw, ImageIcon, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils/dates";
const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  archived: "bg-orange-100 text-orange-700 border-orange-200",
};

interface Props {
  items: Item[];
  onViewItem: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
  onChangeStatus?: (itemId: string) => void;
  onPrintLabel?: (itemId: string) => void;
  userRole?: "admin" | "editor" | "viewer";
}

export default function ItemsListTableView({
  items,
  onViewItem,
  onEditItem,
  onChangeStatus,
  onPrintLabel,
  userRole,
}: Props) {
  const t = useTranslations("table");
  const tCard = useTranslations("itemCard");

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "id",
      enableHiding: false,
    },
    {
      id: "image",
      header: "",
      cell: ({ row }) => {
        const images = row.original.images;
        const firstImage = images?.[0];
        return firstImage ? (
          <div className="relative h-10 w-10 rounded-md overflow-hidden border bg-muted shrink-0">
            <Image
              src={firstImage.url}
              alt={firstImage.note || row.original.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 rounded-md border bg-muted text-muted-foreground/40 shrink-0">
            <ImageIcon className="h-4 w-4" />
          </div>
        );
      },
      size: 56,
    },
    {
      accessorKey: "name",
      header: tCard("name"),
      cell: ({ row }) => (
        <span className="font-medium text-sm text-foreground">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: tCard("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border font-medium text-xs",
              STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600",
            )}
          >
            {tCard(`statusValues.${status}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "itemCategoryName",
      header: tCard("category"),
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("itemCategoryName") || "—"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: tCard("created"),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDateTime(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      enableHiding: false,
      cell: ({ row }) => {
        const itemId = row.original.id;
        const canChangeStatus = !userRole || userRole === "admin" || userRole === "editor";
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewItem(itemId)}
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCard("viewDetails")}</p>
              </TooltipContent>
            </Tooltip>
            {onEditItem && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEditItem(itemId)}
                  >
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCard("edit")}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {onChangeStatus && canChangeStatus && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onChangeStatus(itemId)}
                  >
                    <RefreshCw className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCard("changeStatus")}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {onPrintLabel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPrintLabel(itemId)}
                  >
                    <Printer className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCard("printLabel")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      initialVisibilityState={{ id: false }}
      showPagination={false}
      tableId="items-list"
    />
  );
}
