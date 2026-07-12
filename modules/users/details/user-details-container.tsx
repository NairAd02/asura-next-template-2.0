"use client";

import { useUser } from "../lib/hooks/use-user";
import { UserDetailsPresentational } from "./user-details-presentational";
import { DetailsContainerWrapper } from "@/components/details-container-wrapper/details-container-wrapper";

export interface Props {
  userId: string;
}

export default function UserDetailsContainer({ userId }: Props) {
  const { user, isLoading, error } = useUser({ userId });

  return (
    <DetailsContainerWrapper
      data={user}
      isLoading={isLoading}
      error={error}
      entityKey="user"
      containerClassName="flex flex-col items-center justify-center gap-4 py-32 min-h-[400px]"
    >
      {(user) => <UserDetailsPresentational user={user} />}
    </DetailsContainerWrapper>
  );
}
