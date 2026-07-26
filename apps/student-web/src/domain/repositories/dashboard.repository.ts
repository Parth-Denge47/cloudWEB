export interface StudentDashboardStats {
  upcomingTestCount: number;
  lectureCount: number;
  libraryFileCount: number;
  announcementCount: number;
  progressPercent: number;
}

export interface DashboardRepository {
  getStats(studentId: string): Promise<StudentDashboardStats>;
}
