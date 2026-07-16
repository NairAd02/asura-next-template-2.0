import ModulePagination from "@/components/pagination/module-pagination";
import { getAllSuppliersAction } from "../lib/actions/supplier.actions";
import type { SupplierFiltersDto } from "../lib/types/supplier.types";
import SuppliersListPresentational from "./suppliers-list-presentational";

export default async function SuppliersListContainer({ filters }: { filters: SupplierFiltersDto }) {
  const response = await getAllSuppliersAction(filters);
  return (
    <div>
      <SuppliersListPresentational suppliers={response.suppliers} />
      <ModulePagination pagination={response.pagination} limitOptions={[5, 10, 20, 30]} />
    </div>
  );
}
