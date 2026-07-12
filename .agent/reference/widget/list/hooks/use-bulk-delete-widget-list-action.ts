"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteWidgetsBulkAction } from "../../lib/actions/widget.actions";

export function useBulkDeleteWidgetListAction() {
  const [isDeletingWidgets, setIsDeletingWidgets] = useState(false);
  const router = useRouter();

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    setIsDeletingWidgets(true);
    try {
      const response = await deleteWidgetsBulkAction(ids);
      if (response.success) {
        toast.success(`${response.data.deleted} widget(s) deleted`, { position: "top-right" });
        setTimeout(() => { router.refresh(); }, 300);
      } else {
        toast.error("Failed to delete some widgets", { position: "top-right" });
      }
    } finally {
      setIsDeletingWidgets(false);
    }
  }, [router]);

  return { isDeletingWidgets, handleBulkDelete };
}
