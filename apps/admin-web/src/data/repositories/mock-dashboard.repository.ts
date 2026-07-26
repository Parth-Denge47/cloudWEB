import { DashboardRepository } from "@/domain/repositories/dashboard.repository";
import { ActivityLog, DashboardStats } from "@/domain/models/dashboard-stats.model";
import { teachers, students, tuitions, courses, libraryFiles, videoLectures, announcements, activityLogs, quizzes } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

// Mock implementation of DashboardRepository. Computes aggregate counts
// on the fly from the shared seed arrays so figures stay consistent with
// whatever the other mock repositories have mutated during the session.
export class MockDashboardRepository implements DashboardRepository {
  async getStats(tuitionId?: string): Promise<DashboardStats> {
    await mockDelay();
    const scopedTeachers = tuitionId ? teachers.filter((t) => t.tuitionId === tuitionId) : teachers;
    const scopedStudents = tuitionId ? students.filter((s) => s.tuitionId === tuitionId) : students;
    const scopedCourses = tuitionId ? courses.filter((c) => c.tuitionId === tuitionId) : courses;
    const scopedLibrary = tuitionId ? libraryFiles.filter((f) => f.tuitionId === tuitionId) : libraryFiles;
    const scopedLectures = tuitionId ? videoLectures.filter((l) => l.tuitionId === tuitionId) : videoLectures;
    const scopedAnnouncements = tuitionId
      ? announcements.filter((a) => a.tuitionId === tuitionId || a.isBroadcast)
      : announcements;
    const scopedQuizzes = tuitionId ? quizzes.filter((q) => q.tuitionId === tuitionId) : quizzes;

    return {
      totalTuitions: tuitions.length,
      activeTuitions: tuitions.filter((t) => t.status === "active").length,
      suspendedTuitions: tuitions.filter((t) => t.status === "suspended").length,
      totalTeachers: scopedTeachers.length,
      totalStudents: scopedStudents.length,
      totalCourses: scopedCourses.length,
      totalQuizzes: scopedQuizzes.length,
      totalAnnouncements: scopedAnnouncements.length,
      libraryFileCount: scopedLibrary.length,
      videoLectureCount: scopedLectures.length,
      totalRevenue: 0,
    };
  }

  async getRecentActivity(tuitionId?: string, limit = 8): Promise<ActivityLog[]> {
    await mockDelay(200);
    const scoped = tuitionId ? activityLogs.filter((a) => a.tuitionId === tuitionId) : activityLogs;
    return [...scoped].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, limit);
  }
}

export const mockDashboardRepository = new MockDashboardRepository();
