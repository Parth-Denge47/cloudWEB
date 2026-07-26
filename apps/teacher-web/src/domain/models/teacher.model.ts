import { TeacherStatus } from "./enums";

// Teacher entity. Maps 1:1 to the future backend `Teacher` table (Prisma).
export interface Teacher {
  id: string;
  teacherId: string; // e.g. ALL2601001 — generated, see utils/id-generator.ts
  name: string;
  tuitionId: string;
  tuitionName: string;
  subject: string;
  phone: string;
  email: string;
  joiningDate: string; // ISO date string
  status: TeacherStatus;
  studentLimit: number; // admin-assigned cap
  assignedStudentCount: number; // derived, read-only in UI
}

export type TeacherInput = Omit<Teacher, "id" | "teacherId" | "assignedStudentCount" | "status"> & {
  status?: TeacherStatus;
  // Initial account password, set once at creation. Never returned by
  // getAll/getById — the backend will store only a hash (Argon2/Bcrypt).
  password?: string;
};

// Companion namespace providing serialization + value-equality helpers.
// Kept as plain functions (rather than a class) to match idiomatic TS
// while still satisfying the fromJson/toJson/copyWith/equals contract.
export const TeacherModel = {
  fromJson(json: Record<string, unknown>): Teacher {
    return {
      id: String(json.id),
      teacherId: String(json.teacherId),
      name: String(json.name),
      tuitionId: String(json.tuitionId),
      tuitionName: String(json.tuitionName),
      subject: String(json.subject),
      phone: String(json.phone),
      email: String(json.email),
      joiningDate: String(json.joiningDate),
      status: json.status as TeacherStatus,
      studentLimit: Number(json.studentLimit),
      assignedStudentCount: Number(json.assignedStudentCount),
    };
  },
  toJson(teacher: Teacher): Record<string, unknown> {
    return { ...teacher };
  },
  copyWith(teacher: Teacher, changes: Partial<Teacher>): Teacher {
    return { ...teacher, ...changes };
  },
  equals(a: Teacher, b: Teacher): boolean {
    return a.id === b.id;
  },
};
