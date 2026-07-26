import { DashboardRepository, StudentDashboardStats } from "@/domain/repositories/dashboard.repository";
import { students, quizzes, videoLectures, libraryFiles, announcements } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockDashboardRepository implements DashboardRepository {
  async getStats(studentId: string): Promise<StudentDashboardStats> {
    await mockDelay();
    const student = students.find((s) => s.id === studentId);
    const upcomingTestCount = quizzes.filter(
      (q) => q.tuitionId === student?.tuitionId && (q.status === "published" || q.status === "scheduled")
    ).length;

    return {
      upcomingTestCount,
      lectureCount: student ? videoLectures.filter((l) => l.tuitionId === student.tuitionId).length : 0,
      libraryFileCount: student ? libraryFiles.filter((f) => f.tuitionId === student.tuitionId).length : 0,
      announcementCount: student
        ? announcements.filter((a) => (a.tuitionId === student.tuitionId || a.isBroadcast) && a.audience !== "teachers").length
        : 0,
      progressPercent: student?.progressPercent ?? 0,
    };
  }
}

export const mockDashboardRepository = new MockDashboardRepository();
