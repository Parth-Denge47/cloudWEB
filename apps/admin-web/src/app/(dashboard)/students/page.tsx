"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, KeyRound, Trash2, Repeat, IdCard, RotateCcw, GraduationCap, Ban, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { StudentFormModal } from "@/presentation/components/students/StudentFormModal";
import { ReassignTeacherModal } from "@/presentation/components/students/ReassignTeacherModal";
import { StudentProfileModal } from "@/presentation/components/students/StudentProfileModal";
import { ResetPasswordModal } from "@/presentation/components/shared/ResetPasswordModal";
import { studentService } from "@/services/student.service";
import { teacherService } from "@/services/teacher.service";
import { tuitionService } from "@/services/tuition.service";
import { Student, StudentInput } from "@/domain/models/student.model";
import { Teacher } from "@/domain/models/teacher.model";
import { Tuition } from "@/domain/models/tuition.model";
import { CourseCode } from "@/domain/models/enums";

type PendingAction = { type: "delete" | "resetQuiz" | "suspend" | "activate"; student: Student } | null;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<"all" | CourseCode>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [reassignTarget, setReassignTarget] = useState<Student | null>(null);
  const [profileTarget, setProfileTarget] = useState<Student | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<Student | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [studentList, teacherList, tuitionList] = await Promise.all([
      studentService.getAll(),
      teacherService.getAll(),
      tuitionService.getAll(),
    ]);
    setStudents(studentList);
    setTeachers(teacherList);
    setTuitions(tuitionList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = courseFilter === "all" || s.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [students, search, courseFilter]);

  async function handleCreateOrUpdate(input: StudentInput) {
    if (editingStudent) {
      const updated = await studentService.update(editingStudent.id, input);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await studentService.create(input);
      setStudents((prev) => [created, ...prev]);
    }
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;
    setIsActionLoading(true);
    try {
      const { type, student } = pendingAction;
      if (type === "delete") {
        await studentService.delete(student.id);
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
      } else if (type === "resetQuiz") {
        await studentService.resetQuizAttempt(student.id, "all");
      } else if (type === "suspend") {
        const updated = await studentService.suspend(student.id);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else if (type === "activate") {
        const updated = await studentService.activate(student.id);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
      setPendingAction(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Student Management"
        description="Add, edit, and manage students — assign teachers, reset attempts, and track progress."
        actions={
          <Button
            onClick={() => {
              setEditingStudent(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Add Student
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, Student ID, or email" className="max-w-xs" />
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value as typeof courseFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        >
          <option value="all">All courses</option>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState label="Loading students..." />
      ) : filteredStudents.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students found" description="Try adjusting your search or filters." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Student</Th>
            <Th>Student ID</Th>
            <Th>Tuition</Th>
            <Th>Course</Th>
            <Th>Teacher</Th>
            <Th>Progress</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <Tr key={student.id}>
                <Td>
                  <p className="font-medium text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.email}</p>
                </Td>
                <Td className="font-mono text-xs">{student.studentId}</Td>
                <Td>{student.tuitionName}</Td>
                <Td>
                  <Badge tone="brand">{student.course}</Badge>
                </Td>
                <Td>{student.assignedTeacherName ?? <span className="text-slate-400">Unassigned</span>}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${student.progressPercent}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{student.progressPercent}%</span>
                  </div>
                </Td>
                <Td>
                  <Badge tone={statusTone(student.status)}>{student.status}</Badge>
                </Td>
                <Td className="text-right">
                  <RowActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => {
                          setEditingStudent(student);
                          setFormKey((k) => k + 1);
                          setFormOpen(true);
                        },
                      },
                      { label: "View Profile", icon: IdCard, onClick: () => setProfileTarget(student) },
                      { label: "Reassign Teacher", icon: Repeat, onClick: () => setReassignTarget(student) },
                      { label: "Reset Password", icon: KeyRound, onClick: () => setResetPasswordTarget(student) },
                      {
                        label: "Reset Quiz Attempts",
                        icon: RotateCcw,
                        onClick: () => setPendingAction({ type: "resetQuiz", student }),
                      },
                      student.status === "active"
                        ? { label: "Suspend", icon: Ban, onClick: () => setPendingAction({ type: "suspend", student }) }
                        : { label: "Activate", icon: CheckCircle2, onClick: () => setPendingAction({ type: "activate", student }) },
                      { label: "Delete", icon: Trash2, danger: true, onClick: () => setPendingAction({ type: "delete", student }) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <StudentFormModal
        key={formKey}
        open={formOpen}
        student={editingStudent}
        tuitions={tuitions}
        teachers={teachers}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      <ReassignTeacherModal
        key={reassignTarget?.id}
        open={Boolean(reassignTarget)}
        student={reassignTarget}
        teachers={teachers.filter((t) => t.tuitionId === reassignTarget?.tuitionId && t.status === "active")}
        onClose={() => setReassignTarget(null)}
        onSubmit={async (teacherId, teacherName) => {
          if (!reassignTarget) return;
          const updated = await studentService.reassignTeacher(reassignTarget.id, teacherId, teacherName);
          setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        }}
      />

      <StudentProfileModal open={Boolean(profileTarget)} student={profileTarget} onClose={() => setProfileTarget(null)} />

      <ResetPasswordModal
        key={resetPasswordTarget?.id}
        open={Boolean(resetPasswordTarget)}
        subjectLabel={resetPasswordTarget ? `${resetPasswordTarget.name} (${resetPasswordTarget.studentId})` : ""}
        onClose={() => setResetPasswordTarget(null)}
        onSubmit={async (newPassword) => {
          if (resetPasswordTarget) await studentService.resetPassword(resetPasswordTarget.id, newPassword);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? "Delete Student"
            : pendingAction?.type === "resetQuiz"
              ? "Reset Quiz Attempts"
              : pendingAction?.type === "suspend"
                ? "Suspend Student"
                : "Activate Student"
        }
        message={
          pendingAction?.type === "delete"
            ? `This permanently removes ${pendingAction.student.name} and cannot be undone.`
            : pendingAction?.type === "resetQuiz"
              ? `This resets every quiz/test attempt for ${pendingAction?.student.name}, including tests that were already submitted or terminated. The student will be able to retake them.`
              : pendingAction?.type === "suspend"
                ? `${pendingAction.student.name} will immediately lose login access. Their data, progress, and results are preserved.`
                : `${pendingAction?.student.name} will regain login access immediately.`
        }
        confirmLabel={
          pendingAction?.type === "delete"
            ? "Delete"
            : pendingAction?.type === "resetQuiz"
              ? "Reset Attempts"
              : pendingAction?.type === "suspend"
                ? "Suspend"
                : "Activate"
        }
        tone={pendingAction?.type === "delete" || pendingAction?.type === "suspend" ? "danger" : "brand"}
        isLoading={isActionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
