import {
  getAllItemCategoriesAction,
} from "../lib/actions/item-category.actions";
import { ItemCategoryFiltersDto } from "../lib/types/item-category.types";
import ModulePagination from "@/components/pagination/module-pagination";
import ItemCategoriesListPresentational from "./item-categories-list-presentational";

interface Props {
  filters: ItemCategoryFiltersDto;
}

export default async function ItemCategoriesListContainer({ filters }: Props) {
  const itemCategoriesResponse = await getAllItemCategoriesAction(filters);
  return (
    <div>
      <ItemCategoriesListPresentational
        itemCategories={itemCategoriesResponse.itemCategories}
      />
      <ModulePagination
        pagination={itemCategoriesResponse.pagination}
        limitOptions={[5, 10, 20, 30]}
      />
    </div>
  );
}
