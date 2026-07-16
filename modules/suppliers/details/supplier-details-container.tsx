"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useSupplier } from "../lib/hooks/use-supplier";
import SupplierDetailsPresentational from "./supplier-details-presentational";

export default function SupplierDetailsContainer({ supplierId }: { supplierId: string }) {
  const { supplier, isLoading, error } = useSupplier(supplierId);
  return <DetailsContainerWrapper data={supplier} isLoading={isLoading} error={error} entityKey="supplier">{(data) => <SupplierDetailsPresentational supplier={data} />}</DetailsContainerWrapper>;
}
