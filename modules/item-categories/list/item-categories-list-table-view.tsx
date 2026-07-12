"use client";
import { ItemCategory, getPricingTypeInfo, getPricingTypeLabel } from "../lib/types/item-category.types";
import { DataTable, BulkActionsConfig } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package, Eye, Edit, Trash2, Trash, Power } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import AvatarContainer from "@/components/ui/avatar-container";
import { formatDateTime } from "@/lib/utils/dates";
import { BulkAction } from "@/components/bulk-actions-bar/bulk-actions-bar";

interface Props {
  itemCategories: ItemCategory[];
  onViewItemCategory: (itemCategoryId: string) => void;
  onEditItemCategory: (itemCategoryId: string) => void;
  onDeleteItemCategory: (itemCategoryId: string) => void;
  onToggleActive: (itemCategoryId: string) => void;
  onBulkDelete: (itemCategoryIds: string[]) => Promise<void>;
  isDeletingItemCategories: boolean;
  onBulkToggleActive: (itemCategoryIds: string[], isActive: boolean) => Promise<void>;
  isTogglingItemCategories: boolean;
}

export default function ItemCategoriesListTableView({
  itemCategories,
  onViewItemCategory,
  onEditItemCategory,
  onDeleteItemCategory,
  onToggleActive,
  onBulkDelete,
  isDeletingItemCategories,
  onBulkToggleActive,
  isTogglingItemCategories,
}: Props) {
  const t = useTranslations('table');
  const tCard = useTranslations('itemCategoryCard');
  const tPricingType = useTranslations('itemCategories.pricingTypeValues');
  const columns: ColumnDef<ItemCategory>[] = [
    {
      accessorKey: "id",
      enableHiding: false,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    {
      accessorKey: "iconCode",
      header: "",
      cell: ({ row }) => {
        const icon = row.getValue("iconCode") as string
        return (
          <AvatarContainer className="size-10" image={icon} fallback={<Package />} />
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 68,
    },
    {
      accessorKey: "name",
      header: t('name'),
      cell: ({ row }) => {
        const name = row.original.name;
        const description = row.original.description;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground leading-tight">
              {name}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground leading-tight line-clamp-3">
                {description}
              </span>
            )}
          </div>
        );
      },
      size: 220,
    },

    {
      accessorKey: "pricingType",
      header: () => <div className="text-center">{tCard('pricingType')}</div>,
      cell: ({ row }) => {
        const pricingType = row.original.pricingType;
        const config = getPricingTypeInfo(pricingType);
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full font-medium text-xs capitalize border-transparent",
                config.className,
              )}
            >
              {getPricingTypeLabel(pricingType, tPricingType)}
            </Badge>
          </div>
        );
      },
      size: 180,
    },
    {
      accessorKey: "isActive",
      header: tCard('status'),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent font-medium",
              isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600",
            )}
          >
            {isActive ? tCard('active') : tCard('inactive')}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t('created'),
      cell: ({ row }) => {
        const value = row.getValue("createdAt") as string;
        return (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(value)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: t('actions'),
      cell: ({ row }) => {
        const itemCategoryId = row.getValue("id") as string;
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewItemCategory(itemCategoryId)}
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('viewDetails')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEditItemCategory(itemCategoryId)}
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('edit')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onToggleActive(itemCategoryId)}
                >
                  <Power className={cn("h-4 w-4", isActive ? "text-red-600" : "text-green-600")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? t('deactivate') : t('activate')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDeleteItemCategory(itemCategoryId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('delete')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      size: 180,
    },
  ];

  const bulkActionsConfig: BulkActionsConfig<string, ItemCategory> = {
    actions: (selectedIds: string[]) => {
      // Count how many selected items are inactive (need activation) and active (need deactivation)
      const inactiveCount = itemCategories.filter(
        (cat) => selectedIds.includes(cat.id) && !cat.isActive
      ).length;
      const activeCount = itemCategories.filter(
        (cat) => selectedIds.includes(cat.id) && cat.isActive
      ).length;

      const actions: BulkAction<string>[] = [];

      // Only show activate action if there are inactive items
      if (inactiveCount > 0) {
        actions.push({
          key: "activate",
          label: `${t('activate')} (${inactiveCount})`,
          icon: Power,
          variant: "default",
          onAction: (ids: string[]) => {
            const inactiveIds = itemCategories
              .filter((cat) => ids.includes(cat.id) && !cat.isActive)
              .map((cat) => cat.id);
            onBulkToggleActive(inactiveIds, true);
          },
          isLoading: isTogglingItemCategories,
          confirmation: {
            title: t('activateItemCategories'),
            description: t('activateItemCategoriesDescription'),
            confirmLabel: t('activate'),
          },
        });
      }

      // Only show deactivate action if there are active items
      if (activeCount > 0) {
        actions.push({
          key: "deactivate",
          label: `${t('deactivate')} (${activeCount})`,
          icon: Power,
          variant: "destructive",
          onAction: (ids: string[]) => {
            const activeIds = itemCategories
              .filter((cat) => ids.includes(cat.id) && cat.isActive)
              .map((cat) => cat.id);
            onBulkToggleActive(activeIds, false);
          },
          isLoading: isTogglingItemCategories,
          confirmation: {
            title: t('deactivateItemCategories'),
            description: t('deactivateItemCategoriesDescription'),
            confirmLabel: t('deactivate'),
          },
        });
      }

      // Always show delete action
      actions.push({
        key: "delete",
        label: t('delete'),
        icon: Trash,
        variant: "destructive",
        onAction: onBulkDelete,
        isLoading: isDeletingItemCategories,
        confirmation: {
          title: t('deleteItemCategories'),
          description: t('deleteItemCategoriesDescription'),
          confirmLabel: t('confirmDelete'),
        },
      });

      return actions;
    },
    entityName: {
      singular: t('itemCategory'),
      plural: t('itemCategories'),
    },
    getRowId: (row: ItemCategory) => row.id,
  };


  return (
    <DataTable
      tableId="item-categories-list"
      columns={columns}
      initialVisibilityState={{ id: false, iconCode: true }}
      headerConfig={{
        title: t('itemCategories'),
        icon: <Package className="w-6 h-6" />
      }}
      data={itemCategories}
      dataEmptyText={t('noItemCategoriesFound')}
      maxHeight="calc(100vh - 280px)"
      showPagination={false}
      bulkActionsConfig={bulkActionsConfig}
      stickyColumns={[
        {
          columnId: "select",
          position: "left",
          offset: "0px",
          width: "48px",
        },
        {
          columnId: "iconCode",
          position: "left",
          offset: "48px",
          width: "68px",
        },
        {
          columnId: "name",
          position: "left",
          offset: "116px",
          width: "220px",
          shadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
        },
        {
          columnId: "actions",
          position: "right",
          offset: "0px",
          width: "180px",
          shadow: "-2px 0 5px -2px rgba(0,0,0,0.1)",
        },
      ]}
    />
  );
}
