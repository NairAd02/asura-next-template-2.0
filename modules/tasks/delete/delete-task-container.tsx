"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useDeleteTask } from "../lib/hooks/use-delete-task";

interface Props {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteTaskContainer({ taskId, open, onOpenChange }: Props) {
  const t = useTranslations("tasks.delete");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { deleteTask, isLoading, error, reset } = useDeleteTask({ onSuccess: () => {
    toast.success(t("success"), { position: "top-right" });
    onOpenChange(false);
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`);
    setTimeout(() => router.refresh(), 300);
  } });

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={(value) => { onOpenChange(value); if (!value) reset(); }}
      title={t("title")}
      description={t("description")}
      error={error}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={async () => { await deleteTask(taskId); }}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
