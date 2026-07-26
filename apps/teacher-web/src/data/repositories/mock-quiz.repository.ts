import { QuizRepository, QuizFilters } from "@/domain/repositories/quiz.repository";
import { Quiz, QuizInput, QuizModel } from "@/domain/models/quiz.model";
import { quizzes } from "@/data/mock/seed-data";
import { mockDelay, nextId } from "@/data/mock/delay";

// Mock implementation of QuizRepository (Teacher quiz authoring).
export class MockQuizRepository implements QuizRepository {
  async getAll(filters?: QuizFilters): Promise<Quiz[]> {
    await mockDelay();
    let result = [...quizzes];
    if (filters?.teacherId) result = result.filter((q) => q.teacherId === filters.teacherId);
    if (filters?.status) result = result.filter((q) => q.status === filters.status);
    return result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async getById(id: string): Promise<Quiz | null> {
    await mockDelay(150);
    return quizzes.find((q) => q.id === id) ?? null;
  }

  async create(input: QuizInput): Promise<Quiz> {
    await mockDelay();
    const created: Quiz = QuizModel.fromJson({
      ...input,
      id: nextId("qz"),
      status: input.status ?? "draft",
      createdAt: new Date().toISOString(),
    });
    quizzes.unshift(created);
    return created;
  }

  async update(id: string, changes: Partial<QuizInput>): Promise<Quiz> {
    await mockDelay();
    const index = quizzes.findIndex((q) => q.id === id);
    if (index === -1) throw new Error("Quiz not found.");
    const updated = QuizModel.copyWith(quizzes[index], changes);
    quizzes[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const index = quizzes.findIndex((q) => q.id === id);
    if (index === -1) throw new Error("Quiz not found.");
    quizzes.splice(index, 1);
  }

  async publish(id: string): Promise<Quiz> {
    return this.update(id, { status: "published", scheduledAt: null });
  }

  async schedule(id: string, scheduledAt: string): Promise<Quiz> {
    return this.update(id, { status: "scheduled", scheduledAt });
  }
}

export const mockQuizRepository = new MockQuizRepository();
