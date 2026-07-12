"use client";

import { useTranslations } from "next-intl";
import type { CategoryBreakdown } from "../lib/types/dashboard.types";

interface IncidentsSummaryProps {
  data: CategoryBreakdown[];
}

export function IncidentsSummary({ data }: IncidentsSummaryProps) {
  const t = useTranslations("operationalDashboard");
  const visible = data.filter((c) => c.count > 0);

  if (visible.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">{t("noIncidents")}</p>
    );
  }

  const max = Math.max(...visible.map((c) => c.count));

  return (
    <div className="space-y-4">
      {visible.map((cat) => (
        <div key={cat.categoryId} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-foreground/60" />
              <span className="text-xs text-muted-foreground">{cat.categoryName}</span>
            </div>
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {cat.count}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground/70 transition-all"
              style={{ width: `${(cat.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
