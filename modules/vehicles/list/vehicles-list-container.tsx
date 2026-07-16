import ModulePagination from "@/components/pagination/module-pagination";
import { getAllVehiclesAction } from "../lib/actions/vehicle.actions";
import type { VehicleFiltersDto } from "../lib/types/vehicle.types";
import VehiclesListPresentational from "./vehicles-list-presentational";

export default async function VehiclesListContainer({ filters }: { filters: VehicleFiltersDto }) {
  const response = await getAllVehiclesAction(filters);
  return (
    <div>
      <VehiclesListPresentational vehicles={response.vehicles} />
      <ModulePagination pagination={response.pagination} limitOptions={[5, 10, 20, 30]} />
    </div>
  );
}
