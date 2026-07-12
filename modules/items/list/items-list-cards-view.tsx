"use client";

import { Item } from "../lib/types/item.types";
import { ItemCard } from "../components/item-card";
import { CardViewWrapper, HeaderConfig } from "@/components/ui/card-view-wrapper";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  items: Item[];
  onViewItem: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
  onChangeStatus?: (itemId: string) => void;
  onPrintLabel?: (itemId: string) => void;
  userRole?: "admin" | "editor" | "viewer";
}

export default function ItemsListCardsView({
  items,
  onViewItem,
  onEditItem,
  onChangeStatus,
  onPrintLabel,
  userRole,
}: Props) {
  const t = useTranslations("items");

  const headerConfig: HeaderConfig = {
    title: t("title"),
    icon: <Package className="w-6 h-6" />,
  };

  return (
    <CardViewWrapper headerConfig={headerConfig}>
      <div className="grid grid-cols-1 ultra-xs:grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onView={onViewItem}
            onEdit={onEditItem}
            onChangeStatus={onChangeStatus}
            onPrint={onPrintLabel}
            userRole={userRole}
          />
        ))}
      </div>
    </CardViewWrapper>
  );
}
