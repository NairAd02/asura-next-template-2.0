"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DayVolume } from "../lib/types/dashboard.types";

interface VolumeTrendChartProps {
  data: DayVolume[];
}

export function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  const t = useTranslations("operationalDashboard");

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={formatted}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        barSize={10}
        barCategoryGap="35%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="oklch(0.922 0 0)"
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: "0.625rem",
            border: "1px solid oklch(0.922 0 0)",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
          cursor={{ fill: "oklch(0.97 0 0)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) =>
            value === "intake" ? t("chart.intake") : t("chart.release")
          }
        />
        <Bar
          dataKey="intake"
          fill="#494949"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="release"
          fill="oklch(0.72 0.135 65)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
