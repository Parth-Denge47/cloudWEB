import { AuthRepository } from "@/domain/repositories/auth.repository";
import { Student } from "@/domain/models/student.model";
import { students, tuitions } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

const SESSION_KEY = "lms_student_session";

// Mock implementation of AuthRepository. Any non-empty password is
// accepted for a valid, active Student ID — but login correctly blocks a
// student whose account OR whose tuition has been suspended, matching
// the cascading-suspend rule from the Tuition Management spec.
// TODO (Backend): replace with POST /auth/student/login + JWT storage.
export class MockAuthRepository implements AuthRepository {
  async login(studentId: string, password: string): Promise<Student> {
    await mockDelay();
    if (!studentId.trim() || !password.trim()) {
      throw new Error("Student ID and password are required.");
    }
    const student = students.find((s) => s.studentId.toLowerCase() === studentId.trim().toLowerCase());
    if (!student) throw new Error("Invalid Student ID or password.");
    if (student.status === "suspended") {
      throw new Error("Your account has been suspended. Contact your tuition for details.");
    }
    const tuition = tuitions.find((t) => t.id === student.tuitionId);
    if (tuition?.status === "suspended") {
      throw new Error(`${tuition.tuitionName} has been suspended by the Admin. Login is temporarily unavailable.`);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(student));
    }
    return student;
  }

  async logout(): Promise<void> {
    await mockDelay(100);
    if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
  }

  async getCurrentStudent(): Promise<Student | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Student) : null;
  }
}

export const mockAuthRepository = new MockAuthRepository();
