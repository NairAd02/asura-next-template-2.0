"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { createSupplierSchema } from "../../lib/schemas/supplier.schemas";
import type { CreateSupplierOutput } from "../../lib/schemas/supplier.schemas";
import { useCreateSupplier } from "../../lib/hooks/use-create-supplier";
import SupplierForm from "../supplier-form";

export default function CreateSupplierFormContainer({ onClose }: { onClose?: () => void }) {
  const t = useTranslations("supplierForm");
  const tSuppliers = useTranslations("suppliers");
  const router = useRouter();
  const schema = createSupplierSchema({
    nameRequired: t("validation.nameRequired"), nameMin: t("validation.nameMin"), nameMax: t("validation.nameMax"),
    emailRequired: t("validation.emailRequired"), emailInvalid: t("validation.emailInvalid"), emailMax: t("validation.emailMax"),
    contactNameMax: t("validation.contactNameMax"), phoneMax: t("validation.phoneMax"),
  });
  const form = useForm<CreateSupplierOutput>({ resolver: zodResolver(schema), defaultValues: { name: "", contactName: "", email: "", phone: "", isActive: true } });
  const { createSupplier, isLoading, error } = useCreateSupplier({ onSuccess: () => {
    toast.success(tSuppliers("notifications.created"), { position: "top-right" });
    onClose?.();
    setTimeout(() => router.refresh(), 300);
  } });
  return <FormProvider {...form}><form onSubmit={form.handleSubmit((data) => createSupplier(data))}><SupplierForm loading={isLoading} error={error} onCancel={onClose} /></form></FormProvider>;
}
