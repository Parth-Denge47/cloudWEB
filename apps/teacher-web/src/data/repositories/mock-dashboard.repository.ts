import { DashboardRepository, TeacherDashboardStats } from "@/domain/repositories/dashboard.repository";
import { teachers, students, quizzes, videoLectures, libraryFiles, announcements } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockDashboardRepository implements DashboardRepository {
  async getStats(teacherId: string): Promise<TeacherDashboardStats> {
    await mockDelay();
    const teacher = teachers.find((t) => t.id === teacherId);
    const ownStudents = students.filter((s) => s.assignedTeacherId === teacherId);
    const ownQuizzes = quizzes.filter((q) => q.teacherId === teacherId);
    const today = new Date().toDateString();
    const todaysQuizCount = ownQuizzes.filter(
      (q) => q.status === "scheduled" && q.scheduledAt && new Date(q.scheduledAt).toDateString() === today
    ).length;

    return {
      totalStudents: ownStudents.length,
      studentLimit: teacher?.studentLimit ?? 0,
      remainingCapacity: Math.max(0, (teacher?.studentLimit ?? 0) - ownStudents.length),
      todaysQuizCount,
      lectureCount: teacher ? videoLectures.filter((l) => l.tuitionId === teacher.tuitionId).length : 0,
      libraryFileCount: teacher ? libraryFiles.filter((f) => f.tuitionId === teacher.tuitionId).length : 0,
      announcementCount: teacher
        ? announcements.filter((a) => a.tuitionId === teacher.tuitionId || a.isBroadcast).length
        : 0,
    };
  }
}

export const mockDashboardRepository = new MockDashboardRepository();
