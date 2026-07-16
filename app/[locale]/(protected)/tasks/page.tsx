import { getTranslations } from "next-intl/server";
import TasksContent from "@/modules/tasks/tasks-content";
import { sanitizeTaskFilters } from "@/modules/tasks/lib/types/task.types";

export async function generateMetadata() {
  const tApp = await getTranslations("app");
  const t = await getTranslations("tasks");
  return { title: `${t("title")} | ${tApp("name")}`, description: t("description") };
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TasksPage({ searchParams }: Props) {
  const filters = sanitizeTaskFilters(await searchParams);
  return <TasksContent filters={filters} />;
}
