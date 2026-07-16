"use client";

import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";
import { useSupplier } from "../../lib/hooks/use-supplier";
import EditSupplierFormContainer from "./edit-supplier-form-container";

export default function EditSupplierContainer({ supplierId, onClose }: { supplierId: string; onClose?: () => void }) {
  const { supplier, isLoading, error } = useSupplier(supplierId);
  return <DetailsContainerWrapper data={supplier} isLoading={isLoading} error={error} entityKey="supplier">{(data) => <EditSupplierFormContainer supplier={data} onClose={onClose} />}</DetailsContainerWrapper>;
}
