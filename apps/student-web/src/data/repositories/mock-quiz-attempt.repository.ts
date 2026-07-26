import { QuizAttemptRepository } from "@/domain/repositories/quiz-attempt.repository";
import { QuizAttempt, QuizAttemptModel } from "@/domain/models/quiz-attempt.model";
import { quizAttempts } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of QuizAttemptRepository, including the
// quiz-security lifecycle: once `submit` or `terminate` runs, the
// attempt's status is final and `getActiveAttempt` will no longer
// return it — matching "No resume after termination" from the spec.
export class MockQuizAttemptRepository implements QuizAttemptRepository {
  async getAllForStudent(studentId: string): Promise<QuizAttempt[]> {
    await mockDelay();
    return quizAttempts.filter((a) => a.studentId === studentId).sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
  }

  async getActiveAttempt(quizId: string, studentId: string): Promise<QuizAttempt | null> {
    await mockDelay(150);
    return quizAttempts.find((a) => a.quizId === quizId && a.studentId === studentId) ?? null;
  }

  async start(quizId: string, quizTitle: string, studentId: string, studentName: string, totalMarks: number): Promise<QuizAttempt> {
    await mockDelay();
    const existing = quizAttempts.find((a) => a.quizId === quizId && a.studentId === studentId);
    if (existing) return existing;
    const created: QuizAttempt = QuizAttemptModel.fromJson({
      id: nextId("att"),
      quizId,
      quizTitle,
      studentId,
      studentName,
      status: "in_progress",
      answers: {},
      score: null,
      totalMarks,
      startedAt: new Date().toISOString(),
      submittedAt: null,
      terminationReason: null,
    });
    quizAttempts.push(created);
    return created;
  }

  async submit(attemptId: string, answers: Record<string, number[]>, score: number): Promise<QuizAttempt> {
    await mockDelay();
    const index = quizAttempts.findIndex((a) => a.id === attemptId);
    if (index === -1) throw new Error("Attempt not found.");
    const updated = QuizAttemptModel.copyWith(quizAttempts[index], {
      status: "submitted",
      answers,
      score,
      submittedAt: new Date().toISOString(),
    });
    quizAttempts[index] = updated;
    return updated;
  }

  async terminate(attemptId: string, reason: string): Promise<QuizAttempt> {
    await mockDelay(100);
    const index = quizAttempts.findIndex((a) => a.id === attemptId);
    if (index === -1) throw new Error("Attempt not found.");
    const updated = QuizAttemptModel.copyWith(quizAttempts[index], {
      status: "terminated",
      terminationReason: reason,
    });
    quizAttempts[index] = updated;
    return updated;
  }
}

export const mockQuizAttemptRepository = new MockQuizAttemptRepository();
