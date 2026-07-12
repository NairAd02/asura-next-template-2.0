"use client";

import { useState } from "react";
import { useChangeItemStatus } from "../lib/hooks/use-change-item-status";
import { Item, ITEM_STATUS_VALUES, ItemStatus } from "../lib/types/item.types";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertComponent } from "@/components/ui/alert-component";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active:   "text-green-700",
  inactive: "text-gray-600",
  archived: "text-orange-700",
};

interface Props {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeItemStatusContainer({
  item,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("itemStatus");
  const tCard = useTranslations("itemCard");
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus>(item.status);

  const { changeStatus, isLoading, error, reset } = useChangeItemStatus({
    onSuccess: () => {
      toast.success(t("successToast"), { position: "top-right" });
      onOpenChange(false);
      setTimeout(() => {
        router.refresh();
      }, 300);
    },
  });

  const handleConfirm = async () => {
    if (selectedStatus === item.status) return;
    await changeStatus(item.id, selectedStatus);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setSelectedStatus(item.status);
      reset();
    }
  };

  const hasChanged = selectedStatus !== item.status;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}{" "}
            <span className="font-mono font-semibold text-foreground">
              {item.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && <AlertComponent title={error} variant="destructive" />}

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("currentStatus")}</Label>
            <div
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border",
                "bg-muted border-border",
                STATUS_STYLES[item.status],
              )}
            >
              {tCard(`statusValues.${item.status}`)}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="status-select">
              {t("newStatus")}
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as ItemStatus)}
            >
              <SelectTrigger id="status-select" className="w-full">
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {ITEM_STATUS_VALUES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className={cn("font-medium", STATUS_STYLES[s])}>
                      {tCard(`statusValues.${s}`)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasChanged || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
