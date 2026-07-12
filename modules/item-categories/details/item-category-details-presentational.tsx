"use client"

import {
    Package,
    CalendarDays,
    Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ItemCategoryDetails, getPricingTypeInfo, getPricingTypeLabel } from "../lib/types/item-category.types"
import { useTranslations } from "next-intl"
import AvatarContainer from "@/components/ui/avatar-container"
import { formatDateTime } from "@/lib/utils/dates"

// ─── Types ────────────────────────────────────────────────────────────────────


interface Props {
    itemCategory: ItemCategoryDetails
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ItemCategoryDetailsView({ itemCategory }: Props) {
    const t = useTranslations('itemCategoryDetails')
    const tPricingType = useTranslations('itemCategories.pricingTypeValues')

    return (
        <div className="flex flex-col gap-6">
            
            {/* ── Header with icon and basic info ─────────────────────────────── */}
            <div className="flex gap-6">
                {/* Icon section */}
                <div className="shrink-0">
                    <AvatarContainer 
                        className="size-20 rounded-full" 
                        image={itemCategory.iconCode || undefined} 
                        fallback={<Package className="h-8 w-8" />}
                    />
                </div>

                {/* Info section */}
                <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="col-span-2">
                        <h2 className="text-lg font-semibold text-foreground sm:text-xl">{itemCategory.name}</h2>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                            {t('status')}
                        </span>
                        <Badge
                            variant="outline"
                            className={cn(
                                "w-fit rounded-full border-transparent font-medium text-[10px] mt-1 sm:text-xs",
                                itemCategory.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600",
                            )}
                        >
                            {itemCategory.isActive ? t('active') : t('inactive')}
                        </Badge>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                            {t('pricingType')}
                        </span>
                        <div className="mt-1">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-full font-medium text-xs capitalize border-transparent",
                                    getPricingTypeInfo(itemCategory.pricingType).className,
                                )}
                            >
                                {getPricingTypeLabel(itemCategory.pricingType, tPricingType)}
                            </Badge>
                        </div>
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                            {t('categoryDescription')}
                        </span>
                        <span className="text-xs sm:text-sm text-foreground mt-1 break-words">
                            {itemCategory.description || t('noValue')}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── System info (compact) ─────────────────────────────────────────── */}
            <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-ost-semibold text-sm sm:text-base uppercase tracking-widest text-muted-foreground">
                        {t('system')}
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                                {t('createdAt')}
                            </span>
                            <span className="text-[10px] text-foreground sm:text-xs">
                                {formatDateTime(itemCategory.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                                {t('updatedAt')}
                            </span>
                            <span className="text-[10px] text-foreground sm:text-xs">
                                {formatDateTime(itemCategory.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
