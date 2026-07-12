import {
  getAllUsersAction,
  getCurrentUserAction,
} from "../lib/actions/user.actions";
import { UserFiltersDto } from "../lib/types/user.types";
import UsersListPresentational from "./users-list-presentational";
import ModulePagination from "@/components/pagination/module-pagination";

interface Props {
  filters: UserFiltersDto;
}

export default async function UsersListContainer({ filters }: Props) {
  const [usersResponse, currentUserResponse] = await Promise.all([
    getAllUsersAction(filters),
    getCurrentUserAction(),
  ]);

  const currentUserId = currentUserResponse.success
    ? currentUserResponse.data?.id ?? null
    : null;

  return (
    <div>
      <UsersListPresentational
        users={usersResponse.users}
        currentUserId={currentUserId}
      />
      <ModulePagination
        pagination={usersResponse.pagination}
        limitOptions={[5, 10, 20, 30]}
      />
    </div>
  );
}
