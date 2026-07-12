import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import WidgetFiltersContainer from "./filters/widget-filters-container";
import WidgetListContainer from "./list/widget-list-container";
import WidgetListLoadingSkeleton from "./list/widget-list-loading-skeleton";
import { WidgetFiltersDto } from "./lib/types/widget.types";
import { Box } from "lucide-react";
import CreateWidgetTrigger from "./form/create/create-widget-trigger";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";

interface Props {
  filters: WidgetFiltersDto;
}

export default async function WidgetContent({ filters }: Props) {
  const t = await getTranslations("widgets");
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t("title")}
        icon={<Box className="h-10 w-10" />}
        actionTrigger={<CreateWidgetTrigger />}
        description={t("description")}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={2} />}>
          <WidgetFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`widget-list-${filtersKey}`} fallback={<WidgetListLoadingSkeleton />}>
          <WidgetListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
