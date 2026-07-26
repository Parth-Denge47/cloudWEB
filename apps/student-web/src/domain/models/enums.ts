// Shared enums and lookup tables used across domain models.
// Centralised here so ID-generation, forms, and filters stay in sync.

export type TeacherStatus = "active" | "suspended";
export type StudentStatus = "active" | "suspended";
export type TuitionStatus = "active" | "suspended" | "archived";
export type QuizStatus = "draft" | "scheduled" | "published" | "closed";
export type QuestionType = "mcq" | "multiple_correct" | "true_false";
export type LibraryFileType = "pdf" | "notes" | "book" | "assignment" | "practice_sheet" | "previous_year_paper" | "formula_sheet" | "reference_material";
export type UploaderRole = "admin" | "teacher";
export type AnnouncementAudience = "all" | "teachers" | "students";
export type CourseCode = "JEE" | "NEET";

// Subject code lookup used by the Teacher ID generator.
// [TuitionCode][YY][SubjectCode][TeacherNo] e.g. ALL2601001
export const SUBJECT_CODES: Record<string, string> = {
  Maths: "01",
  Chemistry: "02",
  Physics: "03",
  Biology: "04",
};

// Course code lookup used by the Student ID generator.
// [TuitionCode][YY][CourseCode][StudentNo] e.g. ALL26010001
export const COURSE_CODES: Record<CourseCode, string> = {
  JEE: "01",
  NEET: "02",
};

export const LIBRARY_FILE_TYPE_LABELS: Record<LibraryFileType, string> = {
  pdf: "PDF",
  notes: "Notes",
  book: "Book",
  assignment: "Assignment",
  practice_sheet: "Practice Sheet",
  previous_year_paper: "Previous Year Paper",
  formula_sheet: "Formula Sheet",
  reference_material: "Reference Material",
};
