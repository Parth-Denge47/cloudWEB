import { ActivityLog, DashboardStats } from "@/domain/models/dashboard-stats.model";

// Repository abstraction for aggregate dashboard data. `tuitionId`
// narrows stats/activity to a single tuition for the Tuition Detail page;
// omitting it returns platform-wide totals for the global Admin dashboard.
export interface DashboardRepository {
  getStats(tuitionId?: string): Promise<DashboardStats>;
  getRecentActivity(tuitionId?: string, limit?: number): Promise<ActivityLog[]>;
}
