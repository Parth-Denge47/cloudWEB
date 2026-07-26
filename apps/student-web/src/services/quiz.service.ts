import { QuizRepository, QuizFilters } from "@/domain/repositories/quiz.repository";
import { mockQuizRepository } from "@/data/repositories/mock-quiz.repository";
import { Quiz } from "@/domain/models/quiz.model";

export class QuizService {
  constructor(private readonly repository: QuizRepository = mockQuizRepository) {}
  getAll(filters?: QuizFilters): Promise<Quiz[]> {
    return this.repository.getAll(filters);
  }
  getById(id: string): Promise<Quiz | null> {
    return this.repository.getById(id);
  }
}

export const quizService = new QuizService();
