import { QuizAttemptRepository, QuizAttemptFilters } from "@/domain/repositories/quiz-attempt.repository";
import { mockQuizAttemptRepository } from "@/data/repositories/mock-quiz-attempt.repository";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

export class QuizAttemptService {
  constructor(private readonly repository: QuizAttemptRepository = mockQuizAttemptRepository) {}
  getAll(filters?: QuizAttemptFilters): Promise<QuizAttempt[]> {
    return this.repository.getAll(filters);
  }
  getById(id: string): Promise<QuizAttempt | null> {
    return this.repository.getById(id);
  }
  reset(attemptId: string): Promise<void> {
    return this.repository.reset(attemptId);
  }
}

export const quizAttemptService = new QuizAttemptService();
