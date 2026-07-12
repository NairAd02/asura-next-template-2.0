import { getTranslations } from "next-intl/server";
import {
  Archive,
  CircleCheck,
  CircleMinus,
  FolderOpen,
  Package,
  PackageMinus,
  PackagePlus,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import { getDashboardMetrics } from "./lib/services/dashboard.services";
import { VolumeTrendChart } from "./components/volume-trend-chart";
import { IncidentsSummary } from "./components/incidents-summary";
import { StaffActivityList } from "./components/staff-activity-list";
import { PeriodSelector } from "./components/period-selector";
import type { PeriodPreset } from "./components/period-selector";

/** Build Date objects from search params; defaults to today. */
function resolveDateRange(
  preset: PeriodPreset,
  fromParam?: string,
  toParam?: string
): { from: Date; to: Date } {
  const now = new Date();
  if (preset === "custom" && fromParam && toParam) {
    const from = new Date(fromParam + "T00:00:00");
    const to = new Date(toParam + "T23:59:59");
    if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
      return { from, to };
    }
  }
  if (preset === "weekly") {
    const dow = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((dow + 6) % 7));
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    return { from: mon, to: sun };
  }
  if (preset === "monthly") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { from, to };
  }
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { from, to };
}

const EMPTY_METRICS = {
  totalItems: 0,
  activeItems: 0,
  inactiveItems: 0,
  archivedItems: 0,
  totalCategories: 0,
  totalUsers: 0,
  newItemsToday: 0,
  archivedItemsToday: 0,
  totalEventsToday: 0,
  staffActivityToday: [],
  categoryBreakdown: [],
  volumeTrend: [],
};

interface DashboardContentProps {
  preset: PeriodPreset;
  fromParam?: string;
  toParam?: string;
}

export async function DashboardContent({
  preset,
  fromParam,
  toParam,
}: DashboardContentProps) {
  const t = await getTranslations("operationalDashboard");
  const range = resolveDateRange(preset, fromParam, toParam);
  const result = await getDashboardMetrics(range);
  const metrics = result.success ? result.data : EMPTY_METRICS;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <ModuleHeader
          title={t("title")}
          description={t("description")}
          showRefresh
        />
        <div className="shrink-0 sm:pt-1">
          <PeriodSelector
            currentPreset={preset}
            currentFrom={fromParam}
            currentTo={toParam}
          />
        </div>
      </div>

      {!result.success && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {t("loadError")}
        </div>
      )}

      {/* Item status KPIs */}
      <div className="grid xs:grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("metrics.totalItems")}
          value={metrics.totalItems}
          icon={Package}
        />
        <StatCard
          title={t("metrics.activeItems")}
          value={metrics.activeItems}
          icon={CircleCheck}
        />
        <StatCard
          title={t("metrics.inactiveItems")}
          value={metrics.inactiveItems}
          icon={CircleMinus}
        />
        <StatCard
          title={t("metrics.archivedItems")}
          value={metrics.archivedItems}
          icon={Archive}
        />
      </div>

      {/* Catalog & user KPIs */}
      <div className="grid xs:grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("metrics.totalCategories")}
          value={metrics.totalCategories}
          icon={FolderOpen}
        />
        <StatCard
          title={t("metrics.totalUsers")}
          value={metrics.totalUsers}
          icon={Users}
        />
        <StatCard
          title={t("chart.intake")}
          value={metrics.newItemsToday}
          icon={PackagePlus}
          iconBgColor="bg-primary"
          iconColor="text-primary-foreground"
        />
        <StatCard
          title={t("chart.release")}
          value={metrics.archivedItemsToday}
          icon={PackageMinus}
        />
      </div>

      {/* Volume trend + Category breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("sections.volumeTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeTrendChart data={metrics.volumeTrend} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("sections.categoryBreakdown")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentsSummary data={metrics.categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* User activity */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {t("sections.staffActivity")}
            </CardTitle>
            {metrics.totalEventsToday > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {t("metrics.totalEventsToday", { count: metrics.totalEventsToday })}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <StaffActivityList data={metrics.staffActivityToday} />
        </CardContent>
      </Card>
    </div>
  );
}
