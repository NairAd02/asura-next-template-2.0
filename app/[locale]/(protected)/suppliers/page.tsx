import { getTranslations } from "next-intl/server";
import SuppliersContent from "@/modules/suppliers/suppliers-content";
import { sanitizeSupplierFilters } from "@/modules/suppliers/lib/types/supplier.types";

export async function generateMetadata() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("suppliers");
  return { title: `${t("title")} | ${tApp("name")}`, description: t("description") };
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuppliersPage({ searchParams }: Props) {
  const filters = sanitizeSupplierFilters(await searchParams);
  return <SuppliersContent filters={filters} />;
}
