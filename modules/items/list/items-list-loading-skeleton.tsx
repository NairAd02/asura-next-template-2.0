"use client";

import { useTranslations } from "next-intl";
import { LoadingDataSkeleton } from "@/components/ui/loading-data-skeleton";

export default function ItemsListLoadingSkeleton() {
  const t = useTranslations('items');
  return (
    <LoadingDataSkeleton
      loadingText={t('loadingItems')}
      loadingSubtitle={t('fetchingItemsData')}
    />
  );
}
