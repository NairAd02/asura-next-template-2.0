"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useDeleteSupplier } from "../lib/hooks/use-delete-supplier";

interface Props { supplierId: string; open: boolean; onOpenChange: (open: boolean) => void; }

export default function DeleteSupplierContainer({ supplierId, open, onOpenChange }: Props) {
  const t = useTranslations("suppliers.delete");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { deleteSupplier, isLoading, error, reset } = useDeleteSupplier({ onSuccess: () => {
    toast.success(t("success"), { position: "top-right" });
    onOpenChange(false);
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`);
    setTimeout(() => router.refresh(), 300);
  } });
  return <ConfirmationDialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) reset(); }} title={t("title")} description={t("description")} error={error} confirmLabel={t("confirm")} cancelLabel={t("cancel")} onConfirm={async () => { await deleteSupplier(supplierId); }} isLoading={isLoading} variant="destructive" />;
}
