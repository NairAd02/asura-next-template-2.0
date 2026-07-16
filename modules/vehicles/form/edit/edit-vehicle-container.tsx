"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useVehicle } from "../../lib/hooks/use-vehicle";
import EditVehicleFormContainer from "./edit-vehicle-form-container";

export default function EditVehicleContainer({ vehicleId, onClose }: { vehicleId: string; onClose?: () => void }) {
  const { vehicle, isLoading, error } = useVehicle(vehicleId);
  return <DetailsContainerWrapper data={vehicle} isLoading={isLoading} error={error} entityKey="vehicle">{(data) => <EditVehicleFormContainer vehicle={data} onClose={onClose} />}</DetailsContainerWrapper>;
}
