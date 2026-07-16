"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useVehicle } from "../lib/hooks/use-vehicle";
import VehicleDetailsPresentational from "./vehicle-details-presentational";

export default function VehicleDetailsContainer({ vehicleId }: { vehicleId: string }) {
  const { vehicle, isLoading, error } = useVehicle(vehicleId);
  return <DetailsContainerWrapper data={vehicle} isLoading={isLoading} error={error} entityKey="vehicle">{(data) => <VehicleDetailsPresentational vehicle={data} />}</DetailsContainerWrapper>;
}
