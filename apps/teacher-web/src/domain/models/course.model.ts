import { CourseCode } from "./enums";

// Course entity, scoped to a tuition (e.g. "JEE" batch at ALL branch).
export interface Course {
  id: string;
  tuitionId: string;
  name: string;
  code: CourseCode;
  teachersAssignedCount: number;
  studentCount: number;
  activeQuizCount: number;
  lectureCount: number;
}

export const CourseModel = {
  fromJson(json: Record<string, unknown>): Course {
    return {
      id: String(json.id),
      tuitionId: String(json.tuitionId),
      name: String(json.name),
      code: json.code as CourseCode,
      teachersAssignedCount: Number(json.teachersAssignedCount),
      studentCount: Number(json.studentCount),
      activeQuizCount: Number(json.activeQuizCount),
      lectureCount: Number(json.lectureCount),
    };
  },
  toJson(course: Course): Record<string, unknown> {
    return { ...course };
  },
  copyWith(course: Course, changes: Partial<Course>): Course {
    return { ...course, ...changes };
  },
  equals(a: Course, b: Course): boolean {
    return a.id === b.id;
  },
};
