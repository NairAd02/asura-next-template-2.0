"use client";

import { Car, Edit, Eye, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardViewWrapper } from "@/components/ui/card-view-wrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getVehicleStatusInfo } from "../lib/types/vehicle.types";
import type { Vehicle } from "../lib/types/vehicle.types";

interface Props {
  vehicles: Vehicle[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VehiclesListCardsView({ vehicles, onView, onEdit, onStatus, onDelete }: Props) {
  const t = useTranslations("vehicles");

  return (
    <CardViewWrapper headerConfig={{ title: t("title"), icon: <Car className="size-6" /> }}>
      {vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {vehicles.map((vehicle) => {
            const info = getVehicleStatusInfo(vehicle.status);
            return (
              <article key={vehicle.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{vehicle.plate}</h3>
                    <p className="truncate text-sm text-muted-foreground">{vehicle.make} {vehicle.model} · {vehicle.year}</p>
                    <p className="truncate text-xs text-muted-foreground">{vehicle.branch}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={t("columns.actions")}><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(vehicle.id)}><Eye />{t("actions.view")}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEdit(vehicle.id)}><Edit />{t("actions.edit")}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onStatus(vehicle.id)}><RefreshCw />{t("actions.status")}</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(vehicle.id)}><Trash2 />{t("actions.delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className={info.className}>{t(`status.${vehicle.status}`)}</Badge>
                  <Badge variant="outline">{t(`type.${vehicle.type}`)}</Badge>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </CardViewWrapper>
  );
}
