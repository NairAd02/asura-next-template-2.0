"use client";
import { ItemCategory } from "../lib/types/item-category.types";
import { CardViewWrapper, HeaderConfig } from "@/components/ui/card-view-wrapper";
import { Package } from "lucide-react";
import { ItemCategoryCard } from "../components/item-category-card";

interface Props {
  itemCategories: ItemCategory[];
  onViewItemCategory: (itemCategoryId: string) => void;
  onEditItemCategory: (itemCategoryId: string) => void;
  onToggleActive: (itemCategoryId: string) => void;
  onDeleteItemCategory: (itemCategoryId: string) => void;
}

export default function ItemCategoriesListCardsView({
  itemCategories,
  onViewItemCategory,
  onEditItemCategory,
  onToggleActive,
  onDeleteItemCategory,
}: Props) {
  const headerConfig: HeaderConfig = {
    title: "Item Categories",
    icon: <Package className="w-6 h-6" />,
  };

  return (
    <CardViewWrapper headerConfig={headerConfig}>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
        {itemCategories.map((itemCategory) => (
          <ItemCategoryCard 
            key={itemCategory.id} 
            itemCategory={itemCategory} 
            onView={onViewItemCategory} 
            onEdit={onEditItemCategory}
            onToggleActive={onToggleActive}
            onDelete={onDeleteItemCategory}
          />
        ))}
      </div>
    </CardViewWrapper>
  );
}
