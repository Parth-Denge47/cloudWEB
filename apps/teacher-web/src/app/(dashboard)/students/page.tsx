"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, KeyRound, LineChart, RotateCcw, GraduationCap } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { StudentFormModal } from "@/presentation/components/students/StudentFormModal";
import { StudentAttemptsModal } from "@/presentation/components/students/StudentAttemptsModal";
import { StudentPerformanceModal } from "@/presentation/components/students/StudentPerformanceModal";
import { ResetPasswordModal } from "@/presentation/components/shared/ResetPasswordModal";
import { useAuth } from "@/state/auth-context";
import { studentService } from "@/services/student.service";
import { Student, StudentInput } from "@/domain/models/student.model";

export default function StudentsPage() {
  const { teacher } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [attemptsTarget, setAttemptsTarget] = useState<Student | null>(null);
  const [performanceTarget, setPerformanceTarget] = useState<Student | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<Student | null>(null);

  async function loadData() {
    if (!teacher) return;
    setIsLoading(true);
    const result = await studentService.getAll({ teacherId: teacher.id });
    setStudents(result);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher]);

  const filteredStudents = useMemo(
    () => students.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase())),
    [students, search]
  );

  async function handleCreateOrUpdate(input: StudentInput) {
    if (editingStudent) {
      const updated = await studentService.update(editingStudent.id, input);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await studentService.create(input);
      setStudents((prev) => [created, ...prev]);
    }
  }

  if (!teacher) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="My Students"
        description={`${students.length} / ${teacher.studentLimit} students · add, edit, and manage your own students.`}
        actions={
          <Button
            onClick={() => {
              setEditingStudent(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
            disabled={students.length >= teacher.studentLimit}
          >
            <Plus className="size-4" /> Add Student
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or Student ID" className="mb-4 max-w-xs" />

      {isLoading ? (
        <LoadingState label="Loading students..." />
      ) : filteredStudents.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students yet" description="Add your first student to get started." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Student</Th>
            <Th>Student ID</Th>
            <Th>Course</Th>
            <Th>Progress</Th>
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
                <Td>
                  <Badge tone="brand">{student.course}</Badge>
                </Td>
                <Td>{student.progressPercent}%</Td>
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
                      { label: "View Performance", icon: LineChart, onClick: () => setPerformanceTarget(student) },
                      { label: "Reset Password", icon: KeyRound, onClick: () => setResetPasswordTarget(student) },
                      { label: "Quiz Attempts", icon: RotateCcw, onClick: () => setAttemptsTarget(student) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <StudentFormModal key={formKey} open={formOpen} student={editingStudent} teacher={teacher} onClose={() => setFormOpen(false)} onSubmit={handleCreateOrUpdate} />

      <StudentAttemptsModal open={Boolean(attemptsTarget)} student={attemptsTarget} teacherId={teacher.id} onClose={() => setAttemptsTarget(null)} />

      <StudentPerformanceModal open={Boolean(performanceTarget)} student={performanceTarget} onClose={() => setPerformanceTarget(null)} />

      <ResetPasswordModal
        key={resetPasswordTarget?.id}
        open={Boolean(resetPasswordTarget)}
        subjectLabel={resetPasswordTarget ? `${resetPasswordTarget.name} (${resetPasswordTarget.studentId})` : ""}
        onClose={() => setResetPasswordTarget(null)}
        onSubmit={async (newPassword) => {
          if (resetPasswordTarget) await studentService.resetPassword(resetPasswordTarget.id, newPassword);
        }}
      />
    </div>
  );
}
