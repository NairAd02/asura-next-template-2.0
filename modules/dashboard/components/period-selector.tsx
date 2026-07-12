"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type PeriodPreset = "daily" | "weekly" | "monthly" | "custom";

interface PeriodSelectorProps {
  currentPreset: PeriodPreset;
  currentFrom?: string; // YYYY-MM-DD
  currentTo?: string;   // YYYY-MM-DD
}

export function PeriodSelector({
  currentPreset,
  currentFrom,
  currentTo,
}: PeriodSelectorProps) {
  const t = useTranslations("operationalDashboard.period");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    currentPreset === "custom" && currentFrom && currentTo
      ? { from: new Date(currentFrom), to: new Date(currentTo) }
      : undefined
  );

  const applyParams = useCallback(
    (preset: PeriodPreset, from?: Date, to?: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", preset);
      if (preset === "custom" && from && to) {
        params.set("from", format(from, "yyyy-MM-dd"));
        params.set("to", format(to, "yyyy-MM-dd"));
      } else {
        params.delete("from");
        params.delete("to");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const presets: PeriodPreset[] = ["daily", "weekly", "monthly"];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset buttons */}
      <div className="flex rounded-lg border bg-muted/40 p-0.5 gap-0.5">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => applyParams(p)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              currentPreset === p && currentPreset !== "custom"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(p)}
          </button>
        ))}
      </div>

      {/* Custom date range picker */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 text-xs h-8",
              currentPreset === "custom" &&
                "border-foreground/40 bg-background shadow-sm text-foreground"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
            {currentPreset === "custom" && currentFrom && currentTo ? (
              <span>
                {format(new Date(currentFrom), "MMM d")} –{" "}
                {format(new Date(currentTo), "MMM d, yyyy")}
              </span>
            ) : (
              <span>{t("custom")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
          <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                setDateRange(undefined);
                setCalendarOpen(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              size="sm"
              className="text-xs"
              disabled={!dateRange?.from || !dateRange?.to}
              onClick={() => {
                if (dateRange?.from && dateRange?.to) {
                  applyParams("custom", dateRange.from, dateRange.to);
                  setCalendarOpen(false);
                }
              }}
            >
              {t("apply")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
