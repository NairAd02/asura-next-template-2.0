import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import ItemsFiltersContainer from "./filters/items-filters-container";
import ItemsListContainer from "./list/items-list-container";
import ItemsListLoadingSkeleton from "./list/items-list-loading-skeleton";
import { ItemFiltersDto } from "./lib/types/item.types";
import { Boxes } from "lucide-react";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";
import ItemsStatsContainer from "./components/items-stats/items-stats-container";

interface Props {
  filters: ItemFiltersDto;
}

export default async function ItemsContent({ filters }: Props) {
  const t = await getTranslations("items");
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t("title")}
        icon={<Boxes className="h-10 w-10" />}
        description={t("description")}
        showRefresh
      />
      <ItemsStatsContainer />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={4} />}>
          <ItemsFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense
          key={`items-list-${filtersKey}`}
          fallback={<ItemsListLoadingSkeleton />}
        >
          <ItemsListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
