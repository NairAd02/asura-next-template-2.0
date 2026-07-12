"use client";

import { useTranslations } from "next-intl";
import { LoadingDataSkeleton } from "@/components/ui/loading-data-skeleton";

export default function ItemCategoriesListLoadingSkeleton() {
  const t = useTranslations('itemCategories');
  return (
    <LoadingDataSkeleton
      loadingText={t('loadingCategories')}
      loadingSubtitle={t('fetchingCategoriesData')}
    />
  );
}
