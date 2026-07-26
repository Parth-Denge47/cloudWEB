import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

export interface QuizAttemptFilters {
  quizId?: string;
  studentId?: string;
  teacherId?: string; // scopes to attempts on quizzes authored by this teacher
}

// Repository abstraction for quiz attempts/results.
// `reset` must work even if the attempt was submitted or terminated —
// it clears the existing attempt so the student can retake the quiz.
export interface QuizAttemptRepository {
  getAll(filters?: QuizAttemptFilters): Promise<QuizAttempt[]>;
  getById(id: string): Promise<QuizAttempt | null>;
  reset(attemptId: string): Promise<void>;
}
