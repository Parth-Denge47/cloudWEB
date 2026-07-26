import { DashboardRepository, StudentDashboardStats } from "@/domain/repositories/dashboard.repository";
import { mockDashboardRepository } from "@/data/repositories/mock-dashboard.repository";

export class DashboardService {
  constructor(private readonly repository: DashboardRepository = mockDashboardRepository) {}
  getStats(studentId: string): Promise<StudentDashboardStats> {
    return this.repository.getStats(studentId);
  }
}

export const dashboardService = new DashboardService();
