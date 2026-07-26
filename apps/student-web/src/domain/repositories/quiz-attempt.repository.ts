import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

// Repository abstraction for a student's own quiz attempts, including
// the quiz-security lifecycle (start -> in_progress -> submit/terminate).
// `terminate` and `submit` both work exactly once — a terminated or
// submitted attempt cannot be resumed, per spec; only a teacher/admin
// "Reset Attempt" clears it for a retake.
export interface QuizAttemptRepository {
  getAllForStudent(studentId: string): Promise<QuizAttempt[]>;
  getActiveAttempt(quizId: string, studentId: string): Promise<QuizAttempt | null>;
  start(quizId: string, quizTitle: string, studentId: string, studentName: string, totalMarks: number): Promise<QuizAttempt>;
  submit(attemptId: string, answers: Record<string, number[]>, score: number): Promise<QuizAttempt>;
  terminate(attemptId: string, reason: string): Promise<QuizAttempt>;
}
