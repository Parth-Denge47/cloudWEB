export interface TeacherDashboardStats {
  totalStudents: number;
  studentLimit: number;
  remainingCapacity: number;
  todaysQuizCount: number;
  lectureCount: number;
  libraryFileCount: number;
  announcementCount: number;
}

// Repository abstraction for the Teacher dashboard's aggregate counters.
export interface DashboardRepository {
  getStats(teacherId: string): Promise<TeacherDashboardStats>;
}
