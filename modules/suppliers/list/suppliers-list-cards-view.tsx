"use client";

import { Edit, Eye, MoreHorizontal, Power, Trash2, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardViewWrapper } from "@/components/ui/card-view-wrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Supplier } from "../lib/types/supplier.types";

interface Props { suppliers: Supplier[]; onView: (id: string) => void; onEdit: (id: string) => void; onToggle: (id: string) => void; onDelete: (id: string) => void; }

export default function SuppliersListCardsView({ suppliers, onView, onEdit, onToggle, onDelete }: Props) {
  const t = useTranslations("suppliers");
  return <CardViewWrapper headerConfig={{ title: t("title"), icon: <Truck className="size-6" /> }}>
    {suppliers.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{t("empty")}</div> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{suppliers.map((supplier) => <article key={supplier.id} className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-medium">{supplier.name}</h3><p className="truncate text-sm text-muted-foreground">{supplier.email}</p><p className="truncate text-xs text-muted-foreground">{supplier.contactName ?? t("notProvided")}</p></div>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={t("columns.actions")}><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onView(supplier.id)}><Eye />{t("actions.view")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onEdit(supplier.id)}><Edit />{t("actions.edit")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onToggle(supplier.id)}><Power />{t(supplier.isActive ? "actions.deactivate" : "actions.activate")}</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(supplier.id)}><Trash2 />{t("actions.delete")}</DropdownMenuItem>
        </DropdownMenuContent></DropdownMenu>
      </div>
      <div className="mt-3"><Badge className={supplier.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>{t(supplier.isActive ? "active" : "inactive")}</Badge></div>
    </article>)}</div>}
  </CardViewWrapper>;
}
