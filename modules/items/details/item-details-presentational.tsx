"use client";

import {
  CalendarDays,
  Clock,
  Tag,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ItemDetails } from "../lib/types/item.types";
import { formatDateTime } from "@/lib/utils/dates";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  archived: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
          {label}
        </p>
        <div className="text-xs text-foreground mt-0.5 sm:text-sm">{value}</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  item: ItemDetails;
}

export function ItemDetailsView({ item }: Props) {
  const t = useTranslations("itemDetails");
  const tCard = useTranslations("itemCard");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const hasImages = item.images.length > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Image Carousel ──────────────────────────────────────────────── */}
      {hasImages ? (
        <div className="relative">
          <Carousel
            opts={{ align: "center", loop: item.images.length > 1 }}
            className="w-full"
            setApi={(api) => {
              api?.on("select", () => {
                setActiveImageIndex(api.selectedScrollSnap());
              });
            }}
          >
            <CarouselContent>
              {item.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted">
                    <Image
                      src={img.url}
                      alt={img.note || `Image ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                  {img.note && (
                    <p className="text-[10px] text-center text-muted-foreground mt-2 px-2 sm:text-xs">
                      {img.note}
                    </p>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {item.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>

          {item.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {item.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    idx === activeImageIndex
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border border-dashed bg-muted/30">
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground sm:text-sm">{t("noImages")}</p>
        </div>
      )}

      {/* ── Identity section ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
            {t("name")}
          </p>
          <p className="text-base font-bold text-foreground mt-0.5 sm:text-lg">
            {item.name}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              {t("status")}
            </p>
            <Badge
              variant="outline"
              className={cn(
                "mt-1 rounded-full border-transparent font-medium text-[10px] sm:text-xs",
                STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600",
              )}
            >
              {tCard(`statusValues.${item.status}`)}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Item details ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        {item.description && (
          <div className="sm:col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              {t("description")}
            </p>
            <p className="text-xs text-foreground mt-0.5 sm:text-sm">{item.description}</p>
          </div>
        )}
        <DetailRow
          icon={<Tag className="h-4 w-4" />}
          label={t("category")}
          value={item.itemCategoryName || item.itemCategoryId || "—"}
        />
      </div>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
            {t("timeline")}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                {t("createdAt")}
              </p>
              <p className="text-[10px] text-foreground mt-0.5 sm:text-xs">
                {formatDateTime(item.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                {t("updatedAt")}
              </p>
              <p className="text-[10px] text-foreground mt-0.5 sm:text-xs">
                {formatDateTime(item.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Images metadata ───────────────────────────────────────────────── */}
      {hasImages && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
              {t("imagesMetadata")} ({item.images.length})
            </h3>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {item.images.map((img, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/40 text-[10px] sm:text-xs"
              >
                <span className="font-medium text-muted-foreground shrink-0">
                  #{idx + 1}
                </span>
                <span className="truncate flex-1 text-foreground">{img.name}</span>
                <span className="text-muted-foreground shrink-0">
                  {formatDateTime(img.captured_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
