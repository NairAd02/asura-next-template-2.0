"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Package, Trash2, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ItemCategory, getPricingTypeInfo, getPricingTypeLabel } from "../lib/types/item-category.types";
import AvatarContainer from "@/components/ui/avatar-container";
import { formatDateTime } from "@/lib/utils/dates";

interface Props {
  itemCategory: ItemCategory;
  onView: (itemCategoryId: string) => void;
  onEdit: (itemCategoryId: string) => void;
  onToggleActive: (itemCategoryId: string) => void;
  onDelete: (itemCategoryId: string) => void;
}

export function ItemCategoryCard({ itemCategory, onView, onEdit, onToggleActive, onDelete }: Props) {
  const t = useTranslations('itemCategoryCard');
  const tPricingType = useTranslations('itemCategories.pricingTypeValues');

  return (
    <Card className="overflow-hidden gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <AvatarContainer className="size-10" image={itemCategory.iconCode ?? undefined} fallback={<Package />} />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate sm:text-base">
              {itemCategory.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full font-medium text-[10px] capitalize sm:text-xs border-transparent",
                  getPricingTypeInfo(itemCategory.pricingType).className,
                )}
              >
                {getPricingTypeLabel(itemCategory.pricingType, tPricingType)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {itemCategory.description && (
          <div className="flex gap-1 flex-col text-xs sm:text-sm">
            <span className="text-muted-foreground">{t('description')}</span>
            <span className="font-medium line-clamp-3">{itemCategory.description}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">{t('status')}</span>
          <span className={cn(
            "font-medium",
            itemCategory.isActive ? "text-green-600" : "text-gray-400"
          )}>
            {itemCategory.isActive ? t('active') : t('inactive')}
          </span>
        </div>
        <div className="pt-2 border-t">
          <div className="text-[10px] text-muted-foreground sm:text-xs">
            {t('created')}:{" "}
            {formatDateTime(itemCategory.createdAt)}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 pt-2 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onView(itemCategory.id)}
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
                onClick={() => onEdit(itemCategory.id)}
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
                onClick={() => onToggleActive(itemCategory.id)}
              >
                <Power className={cn("h-4 w-4", itemCategory.isActive ? "text-red-600" : "text-green-600")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{itemCategory.isActive ? t('deactivate') : t('activate')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(itemCategory.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('delete')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
