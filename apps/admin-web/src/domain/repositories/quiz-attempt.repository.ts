import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

export interface QuizAttemptFilters {
  quizId?: string;
  studentId?: string;
  tuitionId?: string;
}

// Repository abstraction for quiz attempts/results, visible platform-wide
// to Admin. `reset` works even if the attempt was submitted or
// terminated — same rule as the Teacher panel.
export interface QuizAttemptRepository {
  getAll(filters?: QuizAttemptFilters): Promise<QuizAttempt[]>;
  reset(attemptId: string): Promise<void>;
}
