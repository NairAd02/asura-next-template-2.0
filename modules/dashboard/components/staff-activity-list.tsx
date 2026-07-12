"use client";

import { useTranslations } from "next-intl";
import type { StaffActivity } from "../lib/types/dashboard.types";
import { cn } from "@/lib/utils";

interface StaffActivityListProps {
  data: StaffActivity[];
}

export function StaffActivityList({ data }: StaffActivityListProps) {
  const t = useTranslations("operationalDashboard");

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        {t("noStaffActivity")}
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => b.eventCount - a.eventCount);
  const maxCount = sorted[0]?.eventCount ?? 1;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((staff, index) => {
        const pct = Math.round((staff.eventCount / maxCount) * 100);
        return (
          <div
            key={staff.staffId}
            className="space-y-1.5 rounded-lg border bg-card p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-xs font-medium text-foreground truncate"
                title={staff.staffId}
              >
                {staff.displayName ?? (
                  <span className="font-mono text-muted-foreground">
                    {staff.staffId.length > 16
                      ? `${staff.staffId.slice(0, 12)}…`
                      : staff.staffId}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                {staff.eventCount}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  index === 0 ? "bg-foreground" : "bg-muted-foreground/50"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
