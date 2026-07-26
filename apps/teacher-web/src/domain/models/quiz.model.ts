import { CourseCode, QuestionType, QuizStatus } from "./enums";

// A single quiz question. `correctOptionIndexes` holds one index for
// mcq/true_false, multiple for multiple_correct.
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
}

// Quiz entity, authored by a teacher and scoped to a tuition + course.
export interface Quiz {
  id: string;
  title: string;
  tuitionId: string;
  course: CourseCode;
  subject: string;
  teacherId: string;
  teacherName: string;
  questions: Question[];
  durationMinutes: number;
  status: QuizStatus; // draft | scheduled | published | closed
  scheduledAt: string | null; // ISO date string
  createdAt: string;
}

export type QuizInput = Omit<Quiz, "id" | "createdAt" | "status"> & { status?: QuizStatus };

export const QuizModel = {
  fromJson(json: Record<string, unknown>): Quiz {
    return {
      id: String(json.id),
      title: String(json.title),
      tuitionId: String(json.tuitionId),
      course: json.course as CourseCode,
      subject: String(json.subject),
      teacherId: String(json.teacherId),
      teacherName: String(json.teacherName),
      questions: Array.isArray(json.questions) ? (json.questions as Question[]) : [],
      durationMinutes: Number(json.durationMinutes),
      status: json.status as QuizStatus,
      scheduledAt: (json.scheduledAt as string) ?? null,
      createdAt: String(json.createdAt),
    };
  },
  toJson(quiz: Quiz): Record<string, unknown> {
    return { ...quiz };
  },
  copyWith(quiz: Quiz, changes: Partial<Quiz>): Quiz {
    return { ...quiz, ...changes };
  },
  equals(a: Quiz, b: Quiz): boolean {
    return a.id === b.id;
  },
  totalMarks(quiz: Quiz): number {
    return quiz.questions.reduce((sum, q) => sum + q.marks, 0);
  },
};
