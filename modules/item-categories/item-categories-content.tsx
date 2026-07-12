import { Suspense } from "react";
import { getTranslations } from 'next-intl/server';
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import ItemCategoriesFiltersContainer from "./filters/item-categories-filters-container";
import ItemCategoriesListContainer from "./list/item-categories-list-container";
import ItemCategoriesListLoadingSkeleton from "./list/item-categories-list-loading-skeleton";
import { ItemCategoryFiltersDto } from "./lib/types/item-category.types";
import { Package } from "lucide-react";
import CreateItemCategoryTrigger from "./form/create/create-item-category-trigger";
import ItemCategoryExcelReportButton from "./components/item-category-excel-report-button";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";

interface Props {
  filters: ItemCategoryFiltersDto;
}

export default async function ItemCategoriesContent({ filters }: Props) {
  const t = await getTranslations('itemCategories');
  const filtersKey = JSON.stringify(filters);
  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t('title')}
        icon={<Package className="h-10 w-10" />}
        actionTrigger={<CreateItemCategoryTrigger />}
        description={t('description')}
        generatePdfButton={<ItemCategoryExcelReportButton filters={filters} />}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={2} />}>
          <ItemCategoriesFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`item-categories-list-${filtersKey}`} fallback={<ItemCategoriesListLoadingSkeleton />}>
          <ItemCategoriesListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
