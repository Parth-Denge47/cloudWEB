"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Send, CalendarClock, BarChart3, FileQuestion } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { QuizBuilder } from "@/presentation/components/quizzes/QuizBuilder";
import { QuizResultsView } from "@/presentation/components/quizzes/QuizResultsView";
import { ScheduleQuizModal } from "@/presentation/components/quizzes/ScheduleQuizModal";
import { useAuth } from "@/state/auth-context";
import { quizService } from "@/services/quiz.service";
import { Quiz, QuizInput, QuizModel } from "@/domain/models/quiz.model";
import { formatDate, formatDateTime } from "@/utils/format";

type ViewMode = { type: "list" } | { type: "builder"; quiz: Quiz | null } | { type: "results"; quiz: Quiz };

export default function QuizzesPage() {
  const { teacher } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>({ type: "list" });
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<Quiz | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!teacher) return;
    void (async () => {
      setIsLoading(true);
      const result = await quizService.getAll({ teacherId: teacher.id });
      setQuizzes(result);
      setIsLoading(false);
    })();
  }, [teacher]);

  if (!teacher) return <LoadingState />;

  async function handleSave(input: QuizInput, publish: boolean) {
    let saved: Quiz;
    if (view.type === "builder" && view.quiz) {
      saved = await quizService.update(view.quiz.id, input);
      setQuizzes((prev) => prev.map((q) => (q.id === saved.id ? saved : q)));
    } else {
      saved = await quizService.create(input);
      setQuizzes((prev) => [saved, ...prev]);
    }
    if (publish) {
      saved = await quizService.publish(saved.id);
      setQuizzes((prev) => prev.map((q) => (q.id === saved.id ? saved : q)));
    }
    setView({ type: "list" });
  }

  async function handlePublish(quizId: string) {
    const updated = await quizService.publish(quizId);
    setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsActionLoading(true);
    try {
      await quizService.delete(deleteTarget.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  if (view.type === "builder") {
    return (
      <div>
        <PageHeader title={view.quiz ? "Edit Quiz" : "Create Quiz"} description="MCQ, Multiple Correct, and True/False questions supported." />
        <QuizBuilder quiz={view.quiz} teacher={teacher} onCancel={() => setView({ type: "list" })} onSave={handleSave} />
      </div>
    );
  }

  if (view.type === "results") {
    return <QuizResultsView quiz={view.quiz} onBack={() => setView({ type: "list" })} />;
  }

  return (
    <div>
      <PageHeader
        title="Quizzes"
        description="Create, publish, schedule, and review results for your quizzes."
        actions={
          <Button onClick={() => setView({ type: "builder", quiz: null })}>
            <Plus className="size-4" /> Create Quiz
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState label="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No quizzes yet" description="Create your first quiz to get started." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Quiz</Th>
            <Th>Subject / Course</Th>
            <Th>Questions</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <Tr key={quiz.id}>
                <Td className="font-medium text-slate-800">{quiz.title}</Td>
                <Td>
                  {quiz.subject} · {quiz.course}
                </Td>
                <Td>
                  {quiz.questions.length} ({QuizModel.totalMarks(quiz)} marks)
                </Td>
                <Td>
                  <Badge tone={statusTone(quiz.status)}>{quiz.status}</Badge>
                  {quiz.scheduledAt && <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(quiz.scheduledAt)}</p>}
                </Td>
                <Td>{formatDate(quiz.createdAt)}</Td>
                <Td className="text-right">
                  <RowActionsMenu
                    actions={[
                      { label: "Edit", icon: Pencil, onClick: () => setView({ type: "builder", quiz }) },
                      { label: "View Results", icon: BarChart3, onClick: () => setView({ type: "results", quiz }) },
                      ...(quiz.status !== "published"
                        ? [{ label: "Publish", icon: Send, onClick: () => handlePublish(quiz.id) }]
                        : []),
                      { label: "Schedule...", icon: CalendarClock, onClick: () => setScheduleTarget(quiz) },
                      { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteTarget(quiz) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <ScheduleQuizModal
        key={scheduleTarget?.id}
        open={Boolean(scheduleTarget)}
        quiz={scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        onSchedule={async (scheduledAt) => {
          if (!scheduleTarget) return;
          const updated = await quizService.schedule(scheduleTarget.id, scheduledAt);
          setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Quiz"
        message={`"${deleteTarget?.title}" and all its questions will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
