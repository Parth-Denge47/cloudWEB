import { TuitionStatus } from "./enums";

// Tuition entity — each tuition is an independent branch/organization
// operating under the same Admin. Suspending a tuition cascades login
// and content-access restrictions to every teacher/student under it
// (enforced server-side once the backend exists; UI only reflects it).
export interface Tuition {
  id: string;
  tuitionName: string;
  tuitionCode: string; // e.g. ALL — used as the prefix for Teacher/Student IDs
  ownerName: string;
  address: string;
  contactNumber: string;
  email: string;
  status: TuitionStatus;
  createdDate: string; // ISO date string
  teacherCount: number; // derived
  studentCount: number; // derived
  activeCourseCount: number; // derived
  totalRevenue: number; // placeholder for future billing module
}

export type TuitionInput = Omit<
  Tuition,
  "id" | "status" | "teacherCount" | "studentCount" | "activeCourseCount" | "totalRevenue" | "createdDate"
> & {
  status?: TuitionStatus;
};

export const TuitionModel = {
  fromJson(json: Record<string, unknown>): Tuition {
    return {
      id: String(json.id),
      tuitionName: String(json.tuitionName),
      tuitionCode: String(json.tuitionCode),
      ownerName: String(json.ownerName),
      address: String(json.address),
      contactNumber: String(json.contactNumber),
      email: String(json.email),
      status: json.status as TuitionStatus,
      createdDate: String(json.createdDate),
      teacherCount: Number(json.teacherCount),
      studentCount: Number(json.studentCount),
      activeCourseCount: Number(json.activeCourseCount),
      totalRevenue: Number(json.totalRevenue ?? 0),
    };
  },
  toJson(tuition: Tuition): Record<string, unknown> {
    return { ...tuition };
  },
  copyWith(tuition: Tuition, changes: Partial<Tuition>): Tuition {
    return { ...tuition, ...changes };
  },
  equals(a: Tuition, b: Tuition): boolean {
    return a.id === b.id;
  },
};
