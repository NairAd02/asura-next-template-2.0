"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Boxes, CheckCircle, XCircle, Archive } from "lucide-react";
import { useTranslations } from "next-intl";
import { ItemsStats } from "../../lib/types/item.types";

interface Props {
  stats: ItemsStats;
}

export default function ItemsStatsPresentational({ stats }: Props) {
  const t = useTranslations("itemStats");

  return (
    <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("totalItems")}
        value={stats.totalItems}
        icon={Boxes}
        iconBgColor="bg-primary"
      />
      <StatCard
        title={t("active")}
        value={stats.active}
        icon={CheckCircle}
        iconBgColor="bg-green-500"
      />
      <StatCard
        title={t("inactive")}
        value={stats.inactive}
        icon={XCircle}
        iconBgColor="bg-gray-500"
      />
      <StatCard
        title={t("archived")}
        value={stats.archived}
        icon={Archive}
        iconBgColor="bg-orange-500"
      />
    </div>
  );
}
