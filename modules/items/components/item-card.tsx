"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Edit,
  RefreshCw,
  Tag,
  ImageIcon,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Item } from "../lib/types/item.types";
import { formatDateTime } from "@/lib/utils/dates";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  archived: "bg-orange-100 text-orange-700 border-orange-200",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  item: Item;
  onView: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onChangeStatus?: (itemId: string) => void;
  onPrint?: (itemId: string) => void;
  userRole?: "admin" | "editor" | "viewer";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ItemCard({ item, onView, onEdit, onChangeStatus, onPrint, userRole }: Props) {
  const t = useTranslations("itemCard");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = item.images.length > 0;

  const canChangeStatus = !userRole || userRole === "admin" || userRole === "editor";

  return (
    <Card className="overflow-hidden flex flex-col h-full group">

      {/* ── Image carousel / placeholder ──────────────────────────────────── */}
      <div className="relative bg-muted">
        {hasImages ? (
          <Carousel
            opts={{ align: "center", loop: item.images.length > 1 }}
            className="w-full"
            setApi={(api) => {
              api?.on("select", () => {
                setCurrentImageIndex(api.selectedScrollSnap());
              });
            }}
          >
            <CarouselContent>
              {item.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      src={img.url}
                      alt={img.note || `Image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {item.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="flex items-center justify-center w-full aspect-4/3 bg-muted/60">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <ImageIcon className="h-10 w-10" />
              <span className="text-xs">{t("noImages")}</span>
            </div>
          </div>
        )}

        {/* Dots indicator */}
        {item.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
            {item.images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  idx === currentImageIndex
                    ? "w-4 bg-white shadow"
                    : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}

        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border font-semibold text-[11px] shadow-sm backdrop-blur-sm bg-white/80",
              STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600",
            )}
          >
            {t(`statusValues.${item.status}`)}
          </Badge>
        </div>

        {/* Image count */}
        {hasImages && item.images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
            {currentImageIndex + 1} / {item.images.length}
          </div>
        )}
      </div>

      {/* ── Card content ──────────────────────────────────────────────────── */}
      <CardContent className="flex-1 pt-3 pb-2 px-4 space-y-2">
        {/* Name */}
        <div>
          <p className="font-bold text-sm text-foreground truncate">
            {item.name}
          </p>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.description}
            </p>
          )}
        </div>

        {/* Category */}
        {item.itemCategoryName && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground truncate">
              {item.itemCategoryName}
            </span>
          </div>
        )}

        {/* Created date */}
        <div className="pt-1 border-t">
          <p className="text-[10px] text-muted-foreground">
            {t("created")}: {formatDateTime(item.createdAt)}
          </p>
        </div>
      </CardContent>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <CardFooter className="px-4 py-2 border-t flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView(item.id)}
            >
              <Eye className="h-4 w-4 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("viewDetails")}</p>
          </TooltipContent>
        </Tooltip>
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(item.id)}
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("edit")}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {onChangeStatus && canChangeStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChangeStatus(item.id)}
              >
                <RefreshCw className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("changeStatus")}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {onPrint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onPrint(item.id)}
              >
                <Printer className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("printLabel")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  );
}
