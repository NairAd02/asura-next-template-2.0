import { Suspense } from "react";
import { Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";
import type { SupplierFiltersDto } from "./lib/types/supplier.types";
import SuppliersFiltersContainer from "./filters/suppliers-filters-container";
import SuppliersListContainer from "./list/suppliers-list-container";
import SuppliersListLoadingSkeleton from "./list/suppliers-list-loading-skeleton";
import CreateSupplierTrigger from "./form/create/create-supplier-trigger";

export default async function SuppliersContent({ filters }: { filters: SupplierFiltersDto }) {
  const t = await getTranslations("suppliers");
  const filtersKey = JSON.stringify(filters);
  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t("title")}
        description={t("description")}
        icon={<Truck className="h-10 w-10" />}
        actionTrigger={<CreateSupplierTrigger />}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={2} />}>
          <SuppliersFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`suppliers-list-${filtersKey}`} fallback={<SuppliersListLoadingSkeleton />}>
          <SuppliersListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
