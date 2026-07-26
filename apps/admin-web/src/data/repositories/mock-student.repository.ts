import { StudentRepository, StudentFilters } from "@/domain/repositories/student.repository";
import { Student, StudentInput, StudentModel } from "@/domain/models/student.model";
import { students, tuitions, teachers, studentIdSequenceIssued } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";
import { generateStudentId } from "@/utils/id-generator";

// Mock implementation of StudentRepository backed by the in-memory seed
// array. Replace with an HTTP implementation hitting api-routes.ts
// `students.*` once the backend is ready.
export class MockStudentRepository implements StudentRepository {
  async getAll(filters?: StudentFilters): Promise<Student[]> {
    await mockDelay();
    let result = [...students];
    if (filters?.tuitionId) result = result.filter((s) => s.tuitionId === filters.tuitionId);
    if (filters?.teacherId) result = result.filter((s) => s.assignedTeacherId === filters.teacherId);
    if (filters?.course) result = result.filter((s) => s.course === filters.course);
    if (filters?.status) result = result.filter((s) => s.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getById(id: string): Promise<Student | null> {
    await mockDelay(150);
    return students.find((s) => s.id === id) ?? null;
  }

  async create(input: StudentInput): Promise<Student> {
    await mockDelay();
    const tuition = tuitions.find((t) => t.id === input.tuitionId);
    if (!tuition) throw new Error("Selected tuition not found.");

    const seqKey = `${input.tuitionId}:${input.course}`;
    const issuedSoFar = studentIdSequenceIssued[seqKey] ?? 0;
    const joiningYear = new Date(input.joiningDate).getFullYear();
    const studentId = generateStudentId(tuition.tuitionCode, input.course, joiningYear, issuedSoFar);
    studentIdSequenceIssued[seqKey] = issuedSoFar + 1;

    const created: Student = StudentModel.fromJson({
      id: nextId("stu"),
      studentId,
      name: input.name,
      parentName: input.parentName,
      parentPhone: input.parentPhone,
      studentPhone: input.studentPhone,
      email: input.email,
      tuitionId: input.tuitionId,
      tuitionName: tuition.tuitionName,
      course: input.course,
      assignedTeacherId: input.assignedTeacherId,
      assignedTeacherName: input.assignedTeacherName,
      status: input.status ?? "active",
      joiningDate: input.joiningDate,
      progressPercent: 0,
    });
    students.push(created);
    tuition.studentCount += 1;
    return created;
  }

  async update(id: string, changes: Partial<StudentInput>): Promise<Student> {
    await mockDelay();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found.");
    const updated = StudentModel.copyWith(students[index], changes);
    students[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found.");
    const tuition = tuitions.find((t) => t.id === students[index].tuitionId);
    if (tuition) tuition.studentCount = Math.max(0, tuition.studentCount - 1);
    students.splice(index, 1);
  }

  async resetPassword(): Promise<void> {
    await mockDelay(200);
    // TODO (Backend): call POST /students/:id/reset-password.
  }

  async reassignTeacher(id: string, teacherId: string, teacherName: string): Promise<Student> {
    const teacherExists = teachers.some((t) => t.id === teacherId);
    if (!teacherExists) throw new Error("Selected teacher not found.");
    return this.update(id, { assignedTeacherId: teacherId, assignedTeacherName: teacherName });
  }

  async resetQuizAttempt(): Promise<void> {
    await mockDelay(200);
    // TODO (Backend): call POST /students/:id/quiz-attempts/:quizId/reset.
    // Must work even if the attempt was submitted or terminated, per spec.
  }

  async suspend(id: string): Promise<Student> {
    return this.update(id, { status: "suspended" } as Partial<StudentInput>);
  }

  async activate(id: string): Promise<Student> {
    return this.update(id, { status: "active" } as Partial<StudentInput>);
  }
}

export const mockStudentRepository = new MockStudentRepository();
