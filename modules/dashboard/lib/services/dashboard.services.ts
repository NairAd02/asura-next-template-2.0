import "server-only";

import type { ServiceResponse } from "@/lib/api-responses";
import type {
  CategoryBreakdown,
  DashboardMetrics,
  DayVolume,
  StaffActivity,
} from "../types/dashboard.types";
import { itemsStore } from "@/modules/items/lib/mock/items.data";
import { itemCategoriesStore } from "@/modules/item-categories/lib/mock/item-categories.data";
import { usersStore } from "@/modules/users/lib/mock/users.data";

export interface DateRangeParams {
  from: Date;
  to: Date;
}

export async function getDashboardMetrics(
  _range?: DateRangeParams,
): Promise<ServiceResponse<DashboardMetrics>> {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    const totalItems    = itemsStore.length;
    const activeItems   = itemsStore.filter((i) => i.status === "active").length;
    const inactiveItems = itemsStore.filter((i) => i.status === "inactive").length;
    const archivedItems = itemsStore.filter((i) => i.status === "archived").length;

    const newItemsToday      = itemsStore.filter((i) => i.createdAt.slice(0, 10) === todayStr).length;
    const archivedItemsToday = itemsStore.filter(
      (i) => i.status === "archived" && i.updatedAt.slice(0, 10) === todayStr,
    ).length;

    const totalCategories = itemCategoriesStore.length;
    const totalUsers      = usersStore.length;

    // Category breakdown: items per active category
    const categoryBreakdown: CategoryBreakdown[] = itemCategoriesStore
      .filter((c) => c.isActive)
      .map((c) => ({
        categoryId:   c.id,
        categoryName: c.name,
        count:        itemsStore.filter((i) => i.itemCategoryId === c.id).length,
      }))
      .sort((a, b) => b.count - a.count);

    const staffActivityToday: StaffActivity[] = usersStore.slice(0, 5).map((u) => ({
      staffId:     u.id,
      displayName: u.fullName ?? u.email,
      eventCount:  Math.floor(Math.random() * 12) + 1,
    }));

    const volumeTrend: DayVolume[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date:    d.toISOString().slice(0, 10),
        intake:  Math.floor(Math.random() * 5) + 1,
        release: Math.floor(Math.random() * 3),
      };
    });

    const totalEventsToday = staffActivityToday.reduce((s, a) => s + a.eventCount, 0);

    return {
      success: true,
      data: {
        totalItems,
        activeItems,
        inactiveItems,
        archivedItems,
        totalCategories,
        totalUsers,
        newItemsToday,
        archivedItemsToday,
        totalEventsToday,
        staffActivityToday,
        categoryBreakdown,
        volumeTrend,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "DASHBOARD_METRICS_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard metrics",
      },
    };
  }
}
