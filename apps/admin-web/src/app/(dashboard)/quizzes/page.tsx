"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Send, CalendarClock, BarChart3, FileQuestion } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { QuizBuilder } from "@/presentation/components/quizzes/QuizBuilder";
import { QuizResultsView } from "@/presentation/components/quizzes/QuizResultsView";
import { ScheduleQuizModal } from "@/presentation/components/quizzes/ScheduleQuizModal";
import { quizService } from "@/services/quiz.service";
import { tuitionService } from "@/services/tuition.service";
import { teacherService } from "@/services/teacher.service";
import { Quiz, QuizInput, QuizModel } from "@/domain/models/quiz.model";
import { Tuition } from "@/domain/models/tuition.model";
import { Teacher } from "@/domain/models/teacher.model";
import { formatDate, formatDateTime } from "@/utils/format";

type ViewMode = { type: "list" } | { type: "builder"; quiz: Quiz | null } | { type: "results"; quiz: Quiz };

// Admin has every quiz capability Teacher has (create/edit/delete/publish/
// schedule/results/reset), but scoped globally across every tuition and
// teacher rather than just one teacher's own quizzes.
export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tuitionFilter, setTuitionFilter] = useState("all");
  const [view, setView] = useState<ViewMode>({ type: "list" });
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<Quiz | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const [quizList, tuitionList, teacherList] = await Promise.all([quizService.getAll(), tuitionService.getAll(), teacherService.getAll()]);
      setQuizzes(quizList);
      setTuitions(tuitionList);
      setTeachers(teacherList);
      setIsLoading(false);
    })();
  }, []);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchesSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.teacherName.toLowerCase().includes(search.toLowerCase());
      const matchesTuition = tuitionFilter === "all" || q.tuitionId === tuitionFilter;
      return matchesSearch && matchesTuition;
    });
  }, [quizzes, search, tuitionFilter]);

  function tuitionName(id: string) {
    return tuitions.find((t) => t.id === id)?.tuitionName ?? "Unknown";
  }

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
        <QuizBuilder quiz={view.quiz} tuitions={tuitions} teachers={teachers} onCancel={() => setView({ type: "list" })} onSave={handleSave} />
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
        description="Create, publish, schedule, and review results across every tuition."
        actions={
          <Button onClick={() => setView({ type: "builder", quiz: null })}>
            <Plus className="size-4" /> Create Quiz
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title or teacher" className="max-w-xs" />
        <select
          value={tuitionFilter}
          onChange={(e) => setTuitionFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        >
          <option value="all">All tuitions</option>
          {tuitions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.tuitionName}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingState label="Loading quizzes..." />
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No quizzes found" />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Quiz</Th>
            <Th>Tuition</Th>
            <Th>Teacher</Th>
            <Th>Questions</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {filteredQuizzes.map((quiz) => (
              <Tr key={quiz.id}>
                <Td>
                  <p className="font-medium text-slate-800">{quiz.title}</p>
                  <p className="text-xs text-slate-400">
                    {quiz.subject} · {quiz.course}
                  </p>
                </Td>
                <Td>{tuitionName(quiz.tuitionId)}</Td>
                <Td>{quiz.teacherName}</Td>
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
