"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { editSupplierSchema } from "../../lib/schemas/supplier.schemas";
import type { EditSupplierOutput } from "../../lib/schemas/supplier.schemas";
import type { SupplierDetails } from "../../lib/types/supplier.types";
import { useEditSupplier } from "../../lib/hooks/use-edit-supplier";
import SupplierForm from "../supplier-form";

export default function EditSupplierFormContainer({ supplier, onClose }: { supplier: SupplierDetails; onClose?: () => void }) {
  const t = useTranslations("supplierForm");
  const tSuppliers = useTranslations("suppliers");
  const router = useRouter();
  const schema = editSupplierSchema({
    nameRequired: t("validation.nameRequired"), nameMin: t("validation.nameMin"), nameMax: t("validation.nameMax"),
    emailRequired: t("validation.emailRequired"), emailInvalid: t("validation.emailInvalid"), emailMax: t("validation.emailMax"),
    contactNameMax: t("validation.contactNameMax"), phoneMax: t("validation.phoneMax"),
  });
  const form = useForm<EditSupplierOutput>({ resolver: zodResolver(schema), defaultValues: {
    name: supplier.name, contactName: supplier.contactName ?? "", email: supplier.email, phone: supplier.phone ?? "", isActive: supplier.isActive,
  } });
  const { editSupplier, isLoading, error } = useEditSupplier({ onSuccess: () => {
    toast.success(tSuppliers("notifications.updated"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });
  return <FormProvider {...form}><form onSubmit={form.handleSubmit((data) => editSupplier(supplier.id, data))}><SupplierForm loading={isLoading} error={error} onCancel={onClose} isEditMode /></form></FormProvider>;
}
