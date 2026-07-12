import { ItemFiltersDto } from "@/modules/items/lib/types/item.types";
import { getTranslations } from "next-intl/server";
import ItemsContent from "@/modules/items/items-content";

export async function generateMetadata() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("items");
  return {
    title: `${t("title")} | ${tApp("name")}`,
    description: t("description"),
  };
}

interface Props {
  searchParams: Promise<ItemFiltersDto>;
}

export default async function ItemsPage({ searchParams }: Props) {
  

  const filters = await searchParams;
  return <ItemsContent filters={filters} />;
}
