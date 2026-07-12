import UsersContent from "@/modules/users/users-content";
import { UserFiltersDto } from "@/modules/users/lib/types/user.types";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const tApp = await getTranslations('app');
  const t = await getTranslations('users');
  return {
    title: `${t("title")} | ${tApp("name")}`,
    description: t('description'),
  };
}

interface Props {
  searchParams: Promise<UserFiltersDto>;
}

export default async function UsersPage({ searchParams }: Props) {
  

  const filters = await searchParams;
  return <UsersContent filters={filters} />;
}
