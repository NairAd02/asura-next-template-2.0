import { getTranslations } from "next-intl/server";
import { DashboardContent } from "@/modules/dashboard/dashboard-content";
import type { PeriodPreset } from "@/modules/dashboard/components/period-selector";

export async function generateMetadata() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("operationalDashboard");
  return {
    title: `${t("title")} | ${tApp("name")}`,
    description: t("description"),
  };
}

const VALID_PRESETS: PeriodPreset[] = ["daily", "weekly", "monthly", "custom"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  
  const params = await searchParams;
  const rawPreset = typeof params.period === "string" ? params.period : "daily";
  const preset: PeriodPreset = VALID_PRESETS.includes(rawPreset as PeriodPreset)
    ? (rawPreset as PeriodPreset)
    : "daily";
  const fromParam = typeof params.from === "string" ? params.from : undefined;
  const toParam = typeof params.to === "string" ? params.to : undefined;

  return (
    <DashboardContent preset={preset} fromParam={fromParam} toParam={toParam} />
  );
}
