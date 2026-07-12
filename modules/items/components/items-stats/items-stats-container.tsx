import { getItemsStatsAction } from "../../lib/actions/item.actions";
import ItemsStatsPresentational from "./items-stats-presentational";

export default async function ItemsStatsContainer() {
  const stats = await getItemsStatsAction();
  return <ItemsStatsPresentational stats={stats} />;
}
