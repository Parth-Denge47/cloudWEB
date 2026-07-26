import { COURSE_CODES, CourseCode, SUBJECT_CODES } from "@/domain/models/enums";

// Generates Teacher IDs in the format [TuitionCode][YY][SubjectCode][TeacherNo]
// e.g. ALL2601001, PHY2603001. `existingCount` is the number of teachers
// already registered for this tuition+subject+year combination, used to
// derive the next sequence number.
export function generateTeacherId(
  tuitionCode: string,
  subject: string,
  joiningYear: number,
  existingCount: number
): string {
  const yy = String(joiningYear).slice(-2);
  const subjectCode = SUBJECT_CODES[subject] ?? "00";
  const teacherNo = String(existingCount + 1).padStart(3, "0");
  return `${tuitionCode.toUpperCase()}${yy}${subjectCode}${teacherNo}`;
}

// Generates Student IDs in the format [TuitionCode][YY][CourseCode][StudentNo]
// e.g. ALL26010001, ALL26020001. IDs are auto-generated, unique, and
// never reused — callers must pass the running total ever issued for
// this tuition+course+year, not just the currently active count, so a
// deleted student's ID is never handed out again.
export function generateStudentId(
  tuitionCode: string,
  course: CourseCode,
  joiningYear: number,
  totalEverIssued: number
): string {
  const yy = String(joiningYear).slice(-2);
  const courseCode = COURSE_CODES[course] ?? "00";
  const studentNo = String(totalEverIssued + 1).padStart(4, "0");
  return `${tuitionCode.toUpperCase()}${yy}${courseCode}${studentNo}`;
}
