// Central registry of backend REST endpoints.
// TODO (Backend): none of these are called yet — mock repositories serve
// data locally. Once the NestJS backend is live, HTTP repository
// implementations will point at these routes instead of the UI changing.
export const API_ROUTES = {
  auth: {
    login: "/auth/admin/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  teachers: {
    list: "/teachers",
    detail: (id: string) => `/teachers/${id}`,
    resetPassword: (id: string) => `/teachers/${id}/reset-password`,
    suspend: (id: string) => `/teachers/${id}/suspend`,
    activate: (id: string) => `/teachers/${id}/activate`,
  },
  students: {
    list: "/students",
    detail: (id: string) => `/students/${id}`,
    resetPassword: (id: string) => `/students/${id}/reset-password`,
    resetQuizAttempt: (id: string, quizId: string) => `/students/${id}/quiz-attempts/${quizId}/reset`,
    reassignTeacher: (id: string) => `/students/${id}/reassign-teacher`,
  },
  tuitions: {
    list: "/tuitions",
    detail: (id: string) => `/tuitions/${id}`,
    suspend: (id: string) => `/tuitions/${id}/suspend`,
    activate: (id: string) => `/tuitions/${id}/activate`,
  },
  library: {
    list: "/library",
    detail: (id: string) => `/library/${id}`,
    upload: "/library/upload",
  },
  lectures: {
    list: "/lectures",
    detail: (id: string) => `/lectures/${id}`,
  },
  announcements: {
    list: "/announcements",
    detail: (id: string) => `/announcements/${id}`,
    broadcast: "/announcements/broadcast",
  },
  dashboard: {
    stats: "/dashboard/stats",
    activity: "/dashboard/activity",
  },
};
