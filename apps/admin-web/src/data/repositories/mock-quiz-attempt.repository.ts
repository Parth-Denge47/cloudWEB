import { QuizAttemptRepository, QuizAttemptFilters } from "@/domain/repositories/quiz-attempt.repository";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { quizAttempts, quizzes } from "@/data/mock/seed-data";
import { mockDelay } from "@/data/mock/delay";

export class MockQuizAttemptRepository implements QuizAttemptRepository {
  async getAll(filters?: QuizAttemptFilters): Promise<QuizAttempt[]> {
    await mockDelay();
    let result = [...quizAttempts];
    if (filters?.quizId) result = result.filter((a) => a.quizId === filters.quizId);
    if (filters?.studentId) result = result.filter((a) => a.studentId === filters.studentId);
    if (filters?.tuitionId) {
      const tuitionQuizIds = new Set(quizzes.filter((q) => q.tuitionId === filters.tuitionId).map((q) => q.id));
      result = result.filter((a) => tuitionQuizIds.has(a.quizId));
    }
    return result.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
  }

  async reset(attemptId: string): Promise<void> {
    await mockDelay();
    const index = quizAttempts.findIndex((a) => a.id === attemptId);
    if (index === -1) throw new Error("Attempt not found.");
    quizAttempts.splice(index, 1);
  }
}

export const mockQuizAttemptRepository = new MockQuizAttemptRepository();
