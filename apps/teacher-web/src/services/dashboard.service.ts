import { DashboardRepository, TeacherDashboardStats } from "@/domain/repositories/dashboard.repository";
import { mockDashboardRepository } from "@/data/repositories/mock-dashboard.repository";

export class DashboardService {
  constructor(private readonly repository: DashboardRepository = mockDashboardRepository) {}
  getStats(teacherId: string): Promise<TeacherDashboardStats> {
    return this.repository.getStats(teacherId);
  }
}

export const dashboardService = new DashboardService();
