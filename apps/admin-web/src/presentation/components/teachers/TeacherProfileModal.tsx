"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, CalendarDays, Users, FileQuestion, Video, Library as LibraryIcon } from "lucide-react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { Teacher } from "@/domain/models/teacher.model";
import { Student } from "@/domain/models/student.model";
import { Quiz } from "@/domain/models/quiz.model";
import { VideoLecture } from "@/domain/models/video-lecture.model";
import { LibraryFile } from "@/domain/models/library-file.model";
import { studentService } from "@/services/student.service";
import { quizService } from "@/services/quiz.service";
import { lectureService } from "@/services/lecture.service";
import { libraryService } from "@/services/library.service";
import { formatDate } from "@/utils/format";

interface TeacherProfileModalProps {
  open: boolean;
  teacher: Teacher | null;
  onClose: () => void;
}

// Full read-only profile — "Admin can access their profile and see all
// their info" per spec: contact/joining details plus everything this
// teacher owns (students, quizzes, lectures, library uploads), all
// visible to Admin even though the teacher only sees their own.
export function TeacherProfileModal({ open, teacher, onClose }: TeacherProfileModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open || !teacher) return;
    void (async () => {
      setIsLoading(true);
      const [studentList, quizList, lectureList, libraryList] = await Promise.all([
        studentService.getAll({ teacherId: teacher.id }),
        quizService.getAll({ teacherId: teacher.id }),
        lectureService.getAll({ tuitionId: teacher.tuitionId }),
        libraryService.getAll({ tuitionId: teacher.tuitionId }),
      ]);
      setStudents(studentList);
      setQuizzes(quizList);
      setLectures(lectureList.filter((l) => l.uploadedByName === teacher.name && l.uploadedByRole === "teacher"));
      setLibraryFiles(libraryList.filter((f) => f.uploadedById === teacher.id));
      setIsLoading(false);
    })();
  }, [open, teacher]);

  if (!teacher) return null;

  return (
    <Modal open={open} onClose={onClose} title={teacher.name} description={`${teacher.teacherId} · ${teacher.subject}`} widthClassName="max-w-2xl">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Mail className="size-3.5" /> Email
            </p>
            <p className="mt-0.5 truncate font-medium text-slate-700">{teacher.email}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Phone className="size-3.5" /> Phone
            </p>
            <p className="mt-0.5 font-medium text-slate-700">{teacher.phone}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays className="size-3.5" /> Joined
            </p>
            <p className="mt-0.5 font-medium text-slate-700">{formatDate(teacher.joiningDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <Badge tone={statusTone(teacher.status)}>{teacher.status}</Badge>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">{teacher.tuitionName}</span> · Student capacity{" "}
          <span className="font-medium text-slate-700">
            {teacher.assignedStudentCount} / {teacher.studentLimit}
          </span>
        </p>

        {isLoading ? (
          <LoadingState label="Loading profile..." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Users className="size-3.5" /> STUDENTS ({students.length})
              </p>
              {students.length === 0 ? (
                <p className="text-xs text-slate-400">No students assigned.</p>
              ) : (
                <ul className="space-y-1 text-xs text-slate-600">
                  {students.slice(0, 6).map((s) => (
                    <li key={s.id} className="truncate">
                      {s.name} <span className="text-slate-400">({s.studentId})</span>
                    </li>
                  ))}
                  {students.length > 6 && <li className="text-slate-400">+{students.length - 6} more</li>}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <FileQuestion className="size-3.5" /> QUIZZES ({quizzes.length})
              </p>
              {quizzes.length === 0 ? (
                <p className="text-xs text-slate-400">No quizzes created.</p>
              ) : (
                <ul className="space-y-1 text-xs text-slate-600">
                  {quizzes.slice(0, 6).map((q) => (
                    <li key={q.id} className="truncate">
                      {q.title} <span className="text-slate-400">({q.status})</span>
                    </li>
                  ))}
                  {quizzes.length > 6 && <li className="text-slate-400">+{quizzes.length - 6} more</li>}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Video className="size-3.5" /> UPLOADS
              </p>
              <p className="text-xs text-slate-600">{lectures.length} video lectures</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                <LibraryIcon className="size-3.5" /> {libraryFiles.length} library files
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
