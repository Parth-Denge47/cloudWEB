import { DashboardRepository } from "@/domain/repositories/dashboard.repository";
import { mockDashboardRepository } from "@/data/repositories/mock-dashboard.repository";
import { ActivityLog, DashboardStats } from "@/domain/models/dashboard-stats.model";

// Service layer for the global Admin dashboard and per-tuition stats.
export class DashboardService {
  constructor(private readonly repository: DashboardRepository = mockDashboardRepository) {}

  getStats(tuitionId?: string): Promise<DashboardStats> {
    return this.repository.getStats(tuitionId);
  }

  getRecentActivity(tuitionId?: string, limit?: number): Promise<ActivityLog[]> {
    return this.repository.getRecentActivity(tuitionId, limit);
  }
}

export const dashboardService = new DashboardService();
