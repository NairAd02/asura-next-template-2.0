"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useToggleSupplierActive } from "../lib/hooks/use-toggle-supplier-active";

interface Props { supplierId: string; isActive: boolean; open: boolean; onOpenChange: (open: boolean) => void; }

export default function ToggleSupplierActiveContainer({ supplierId, isActive, open, onOpenChange }: Props) {
  const t = useTranslations("suppliers.toggle");
  const router = useRouter();
  const { toggleSupplierActive, isLoading, error, reset } = useToggleSupplierActive({ onSuccess: () => {
    toast.success(t(isActive ? "deactivated" : "activated"), { position: "top-right" });
    onOpenChange(false);
    setTimeout(() => router.refresh(), 300);
  } });
  return <ConfirmationDialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) reset(); }} title={t(isActive ? "deactivateTitle" : "activateTitle")} description={t(isActive ? "deactivateDescription" : "activateDescription")} error={error} confirmLabel={t(isActive ? "deactivate" : "activate")} cancelLabel={t("cancel")} onConfirm={async () => { await toggleSupplierActive(supplierId, !isActive); }} isLoading={isLoading} />;
}
