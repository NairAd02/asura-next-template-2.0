"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/dates";
import type { SupplierDetails } from "../lib/types/supplier.types";

export default function SupplierDetailsPresentational({ supplier }: { supplier: SupplierDetails }) {
  const t = useTranslations("supplierDetails");
  const fields = [
    [t("contactName"), supplier.contactName ?? t("notProvided")],
    [t("email"), supplier.email],
    [t("phone"), supplier.phone ?? t("notProvided")],
    [t("createdAt"), formatDateTime(supplier.createdAt)],
    [t("updatedAt"), formatDateTime(supplier.updatedAt)],
  ];
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{supplier.name}</h3>
        <Badge className={supplier.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>{t(supplier.isActive ? "active" : "inactive")}</Badge>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label} className="rounded-md border p-3"><dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm">{value}</dd></div>)}</dl>
    </div>
  );
}
