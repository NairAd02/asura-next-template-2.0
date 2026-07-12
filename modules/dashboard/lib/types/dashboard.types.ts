export interface DashboardMetrics {
  // Item counts
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  archivedItems: number;
  // Category and user counts
  totalCategories: number;
  totalUsers: number;
  // Daily activity (today)
  newItemsToday: number;
  archivedItemsToday: number;
  // Total events logged today across all users
  totalEventsToday: number;
  // User activity: events logged today per user
  staffActivityToday: StaffActivity[];
  // Items breakdown by category
  categoryBreakdown: CategoryBreakdown[];
  // Volume trend: last 7 days
  volumeTrend: DayVolume[];
}

export interface StaffActivity {
  staffId: string;
  displayName: string | null;
  eventCount: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface DayVolume {
  date: string; // YYYY-MM-DD
  intake: number;
  release: number;
}

