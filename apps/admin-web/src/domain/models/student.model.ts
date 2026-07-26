import { CourseCode, StudentStatus } from "./enums";

// Student entity. Maps 1:1 to the future backend `Student` table (Prisma).
export interface Student {
  id: string;
  studentId: string; // e.g. ALL26010001 — generated, see utils/id-generator.ts, never reused
  name: string;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  email: string;
  tuitionId: string;
  tuitionName: string;
  course: CourseCode;
  assignedTeacherId: string | null;
  assignedTeacherName: string | null;
  status: StudentStatus;
  joiningDate: string; // ISO date string
  progressPercent: number; // 0-100, derived from quiz/lecture completion
}

export type StudentInput = Omit<Student, "id" | "studentId" | "status" | "progressPercent"> & {
  status?: StudentStatus;
  // Initial account password, set once at creation. Never returned by
  // getAll/getById — the backend will store only a hash (Argon2/Bcrypt).
  password?: string;
};

export const StudentModel = {
  fromJson(json: Record<string, unknown>): Student {
    return {
      id: String(json.id),
      studentId: String(json.studentId),
      name: String(json.name),
      parentName: String(json.parentName),
      parentPhone: String(json.parentPhone),
      studentPhone: String(json.studentPhone),
      email: String(json.email),
      tuitionId: String(json.tuitionId),
      tuitionName: String(json.tuitionName),
      course: json.course as CourseCode,
      assignedTeacherId: (json.assignedTeacherId as string) ?? null,
      assignedTeacherName: (json.assignedTeacherName as string) ?? null,
      status: json.status as StudentStatus,
      joiningDate: String(json.joiningDate),
      progressPercent: Number(json.progressPercent),
    };
  },
  toJson(student: Student): Record<string, unknown> {
    return { ...student };
  },
  copyWith(student: Student, changes: Partial<Student>): Student {
    return { ...student, ...changes };
  },
  equals(a: Student, b: Student): boolean {
    return a.id === b.id;
  },
};
