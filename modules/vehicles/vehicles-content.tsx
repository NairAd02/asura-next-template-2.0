import { Suspense } from "react";
import { Car } from "lucide-react";
import { getTranslations } from "next-intl/server";
import FiltersSkeleton from "@/components/filters/filters-container-skeleton/filters-skeleton";
import { ModuleHeader } from "@/modules/components/module-header/module-header";
import type { VehicleFiltersDto } from "./lib/types/vehicle.types";
import VehiclesFiltersContainer from "./filters/vehicles-filters-container";
import CreateVehicleTrigger from "./form/create/create-vehicle-trigger";
import VehiclesListContainer from "./list/vehicles-list-container";
import VehiclesListLoadingSkeleton from "./list/vehicles-list-loading-skeleton";

export default async function VehiclesContent({ filters }: { filters: VehicleFiltersDto }) {
  const t = await getTranslations("vehicles");
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="flex flex-col gap-3">
      <ModuleHeader
        title={t("title")}
        description={t("description")}
        icon={<Car className="h-10 w-10" />}
        actionTrigger={<CreateVehicleTrigger />}
        showRefresh
      />
      <div className="mt-6">
        <Suspense fallback={<FiltersSkeleton inputCount={4} />}>
          <VehiclesFiltersContainer />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense key={`vehicles-list-${filtersKey}`} fallback={<VehiclesListLoadingSkeleton />}>
          <VehiclesListContainer filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
