import { getUsersStatsAction } from "../../lib/actions/user.actions";
import UsersStatsPresentational from "./users-stats-presentational";

export default async function UsersStatsContainer() {
  const stats = await getUsersStatsAction();
  return <UsersStatsPresentational stats={stats} />;
}
