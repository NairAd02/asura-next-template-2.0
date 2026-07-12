import { getAllItemsAction } from "../lib/actions/item.actions";
import { ItemFiltersDto } from "../lib/types/item.types";
import ModulePagination from "@/components/pagination/module-pagination";
import ItemsListPresentational from "./items-list-presentational";

interface Props {
  filters: ItemFiltersDto;
}

export default async function ItemsListContainer({ filters }: Props) {
  const itemsResponse = await getAllItemsAction(filters);

  return (
    <div>
      <ItemsListPresentational items={itemsResponse.items} />
      <ModulePagination
        pagination={itemsResponse.pagination}
        limitOptions={[10, 20, 30, 50]}
      />
    </div>
  );
}
