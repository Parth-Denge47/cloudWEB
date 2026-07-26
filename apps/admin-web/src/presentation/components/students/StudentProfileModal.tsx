"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, CalendarDays, Users, FileQuestion } from "lucide-react";
import { Modal } from "@/presentation/components/ui/Modal";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { Student } from "@/domain/models/student.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";
import { quizAttemptService } from "@/services/quiz-attempt.service";
import { formatDate, formatDateTime } from "@/utils/format";

interface StudentProfileModalProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
}

// Full read-only profile — "Admin can access their profile and see all
// their info" per spec: contact/parent details, progress, and quiz
// attempt history (submitted, terminated, or not yet attempted).
export function StudentProfileModal({ open, student, onClose }: StudentProfileModalProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open || !student) return;
    void (async () => {
      setIsLoading(true);
      const result = await quizAttemptService.getAll({ studentId: student.id });
      setAttempts(result);
      setIsLoading(false);
    })();
  }, [open, student]);

  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose} title={student.name} description={`${student.studentId} · ${student.course}`} widthClassName="max-w-xl">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Mail className="size-3.5" /> Email
            </p>
            <p className="mt-0.5 truncate font-medium text-slate-700">{student.email}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Phone className="size-3.5" /> Phone
            </p>
            <p className="mt-0.5 font-medium text-slate-700">{student.studentPhone}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays className="size-3.5" /> Joined
            </p>
            <p className="mt-0.5 font-medium text-slate-700">{formatDate(student.joiningDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <Badge tone={statusTone(student.status)}>{student.status}</Badge>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 p-4 text-sm">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Users className="size-3.5" /> PARENT / GUARDIAN
          </p>
          <p className="font-medium text-slate-700">{student.parentName}</p>
          <p className="text-xs text-slate-400">{student.parentPhone}</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-medium text-slate-700">{student.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${student.progressPercent}%` }} />
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <FileQuestion className="size-3.5" /> QUIZ ATTEMPTS ({attempts.length})
          </p>
          {isLoading ? (
            <LoadingState label="Loading attempts..." />
          ) : attempts.length === 0 ? (
            <p className="text-xs text-slate-400">No quiz attempts yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {attempts.map((attempt) => (
                <li key={attempt.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                  <div>
                    <p className="font-medium text-slate-700">{attempt.quizTitle}</p>
                    <p className="text-slate-400">{formatDateTime(attempt.startedAt)}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={statusTone(attempt.status)}>{attempt.status.replace("_", " ")}</Badge>
                    {attempt.score !== null && (
                      <p className="mt-1 text-slate-500">
                        {attempt.score}/{attempt.totalMarks}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
