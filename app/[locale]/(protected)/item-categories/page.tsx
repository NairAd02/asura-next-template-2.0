import { ItemCategoryFiltersDto } from "@/modules/item-categories/lib/types/item-category.types";
import { getTranslations } from 'next-intl/server';
import ItemCategoriesContent from "@/modules/item-categories/item-categories-content";

export async function generateMetadata() {
    const tApp = await getTranslations('app');
    const t = await getTranslations('itemCategories');
    return {
        title: `${t("title")} | ${tApp("name")}`,
        description: t('description'),
    };
}

interface Props {
    searchParams: Promise<ItemCategoryFiltersDto>;
}

export default async function ItemCategoriesPage({ searchParams }: Props) {

    const filters = await searchParams;
    return <ItemCategoriesContent filters={filters} />;
}
