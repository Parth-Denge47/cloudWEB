import { QuizAttemptRepository } from "@/domain/repositories/quiz-attempt.repository";
import { mockQuizAttemptRepository } from "@/data/repositories/mock-quiz-attempt.repository";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

export class QuizAttemptService {
  constructor(private readonly repository: QuizAttemptRepository = mockQuizAttemptRepository) {}
  getAllForStudent(studentId: string): Promise<QuizAttempt[]> {
    return this.repository.getAllForStudent(studentId);
  }
  getActiveAttempt(quizId: string, studentId: string): Promise<QuizAttempt | null> {
    return this.repository.getActiveAttempt(quizId, studentId);
  }
  start(quizId: string, quizTitle: string, studentId: string, studentName: string, totalMarks: number): Promise<QuizAttempt> {
    return this.repository.start(quizId, quizTitle, studentId, studentName, totalMarks);
  }
  submit(attemptId: string, answers: Record<string, number[]>, score: number): Promise<QuizAttempt> {
    return this.repository.submit(attemptId, answers, score);
  }
  terminate(attemptId: string, reason: string): Promise<QuizAttempt> {
    return this.repository.terminate(attemptId, reason);
  }
}

export const quizAttemptService = new QuizAttemptService();
