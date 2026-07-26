// Aggregate counters shown on the global Admin dashboard and the
// per-tuition Tuition Management dashboard.
export interface DashboardStats {
  totalTuitions: number;
  activeTuitions: number;
  suspendedTuitions: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  totalQuizzes: number;
  totalAnnouncements: number;
  libraryFileCount: number;
  videoLectureCount: number;
  totalRevenue: number; // future
}

export const DashboardStatsModel = {
  fromJson(json: Record<string, unknown>): DashboardStats {
    return {
      totalTuitions: Number(json.totalTuitions),
      activeTuitions: Number(json.activeTuitions),
      suspendedTuitions: Number(json.suspendedTuitions),
      totalTeachers: Number(json.totalTeachers),
      totalStudents: Number(json.totalStudents),
      totalCourses: Number(json.totalCourses),
      totalQuizzes: Number(json.totalQuizzes),
      totalAnnouncements: Number(json.totalAnnouncements),
      libraryFileCount: Number(json.libraryFileCount),
      videoLectureCount: Number(json.videoLectureCount),
      totalRevenue: Number(json.totalRevenue ?? 0),
    };
  },
  toJson(stats: DashboardStats): Record<string, unknown> {
    return { ...stats };
  },
};

// A single row in the "Recent Activity" feed.
export interface ActivityLog {
  id: string;
  message: string;
  actorName: string;
  actorRole: "admin" | "teacher" | "student";
  tuitionId: string | null;
  timestamp: string; // ISO date string
}

export const ActivityLogModel = {
  fromJson(json: Record<string, unknown>): ActivityLog {
    return {
      id: String(json.id),
      message: String(json.message),
      actorName: String(json.actorName),
      actorRole: json.actorRole as ActivityLog["actorRole"],
      tuitionId: (json.tuitionId as string) ?? null,
      timestamp: String(json.timestamp),
    };
  },
  toJson(log: ActivityLog): Record<string, unknown> {
    return { ...log };
  },
};
