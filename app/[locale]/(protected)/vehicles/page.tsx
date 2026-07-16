import { getTranslations } from "next-intl/server";
import VehiclesContent from "@/modules/vehicles/vehicles-content";
import { sanitizeVehicleFilters } from "@/modules/vehicles/lib/types/vehicle.types";

export async function generateMetadata() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("vehicles");
  return { title: `${t("title")} | ${tApp("name")}`, description: t("description") };
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VehiclesPage({ searchParams }: Props) {
  const filters = sanitizeVehicleFilters(await searchParams);
  return <VehiclesContent filters={filters} />;
}
