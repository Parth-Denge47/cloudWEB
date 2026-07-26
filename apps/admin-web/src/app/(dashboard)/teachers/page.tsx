"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, KeyRound, Ban, CheckCircle2, Trash2, Users as UsersIcon, IdCard } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { TeacherFormModal } from "@/presentation/components/teachers/TeacherFormModal";
import { TeacherProfileModal } from "@/presentation/components/teachers/TeacherProfileModal";
import { ResetPasswordModal } from "@/presentation/components/shared/ResetPasswordModal";
import { teacherService } from "@/services/teacher.service";
import { tuitionService } from "@/services/tuition.service";
import { Teacher, TeacherInput } from "@/domain/models/teacher.model";
import { Tuition } from "@/domain/models/tuition.model";
import { formatDate } from "@/utils/format";

type PendingAction =
  | { type: "suspend" | "activate" | "delete"; teacher: Teacher }
  | null;

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Teacher["status"]>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<Teacher | null>(null);
  const [profileTarget, setProfileTarget] = useState<Teacher | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [teacherList, tuitionList] = await Promise.all([teacherService.getAll(), tuitionService.getAll()]);
    setTeachers(teacherList);
    setTuitions(tuitionList);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.teacherId.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, statusFilter]);

  async function handleCreateOrUpdate(input: TeacherInput) {
    if (editingTeacher) {
      const updated = await teacherService.update(editingTeacher.id, input);
      setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await teacherService.create(input);
      setTeachers((prev) => [created, ...prev]);
    }
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;
    setIsActionLoading(true);
    try {
      const { type, teacher } = pendingAction;
      if (type === "suspend") {
        const updated = await teacherService.suspend(teacher.id);
        setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else if (type === "activate") {
        const updated = await teacherService.activate(teacher.id);
        setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else if (type === "delete") {
        await teacherService.delete(teacher.id);
        setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
      }
      setPendingAction(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        description="Add, edit, suspend, and manage teachers across every tuition."
        actions={
          <Button
            onClick={() => {
              setEditingTeacher(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Add Teacher
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, Teacher ID, or email" className="max-w-xs" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState label="Loading teachers..." />
      ) : filteredTeachers.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No teachers found" description="Try adjusting your search or filters." />
      ) : (
        <TableContainer>
          <TableHead>
            <Th>Teacher</Th>
            <Th>Teacher ID</Th>
            <Th>Tuition</Th>
            <Th>Subject</Th>
            <Th>Students</Th>
            <Th>Joined</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <Tr key={teacher.id}>
                <Td>
                  <p className="font-medium text-slate-800">{teacher.name}</p>
                  <p className="text-xs text-slate-400">{teacher.email}</p>
                </Td>
                <Td className="font-mono text-xs">{teacher.teacherId}</Td>
                <Td>{teacher.tuitionName}</Td>
                <Td>{teacher.subject}</Td>
                <Td>
                  {teacher.assignedStudentCount} / {teacher.studentLimit}
                </Td>
                <Td>{formatDate(teacher.joiningDate)}</Td>
                <Td>
                  <Badge tone={statusTone(teacher.status)}>{teacher.status}</Badge>
                </Td>
                <Td className="text-right">
                  <RowActionsMenu
                    actions={[
                      { label: "View Profile", icon: IdCard, onClick: () => setProfileTarget(teacher) },
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => {
                          setEditingTeacher(teacher);
                          setFormKey((k) => k + 1);
                          setFormOpen(true);
                        },
                      },
                      { label: "Reset Password", icon: KeyRound, onClick: () => setResetPasswordTarget(teacher) },
                      teacher.status === "active"
                        ? { label: "Suspend", icon: Ban, onClick: () => setPendingAction({ type: "suspend", teacher }) }
                        : { label: "Activate", icon: CheckCircle2, onClick: () => setPendingAction({ type: "activate", teacher }) },
                      { label: "Delete", icon: Trash2, danger: true, onClick: () => setPendingAction({ type: "delete", teacher }) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </TableContainer>
      )}

      <TeacherFormModal
        key={formKey}
        open={formOpen}
        teacher={editingTeacher}
        tuitions={tuitions}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      <ResetPasswordModal
        key={resetPasswordTarget?.id}
        open={Boolean(resetPasswordTarget)}
        subjectLabel={resetPasswordTarget ? `${resetPasswordTarget.name} (${resetPasswordTarget.teacherId})` : ""}
        onClose={() => setResetPasswordTarget(null)}
        onSubmit={async (newPassword) => {
          if (resetPasswordTarget) await teacherService.resetPassword(resetPasswordTarget.id, newPassword);
        }}
      />

      <TeacherProfileModal open={Boolean(profileTarget)} teacher={profileTarget} onClose={() => setProfileTarget(null)} />

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? "Delete Teacher"
            : pendingAction?.type === "suspend"
              ? "Suspend Teacher"
              : "Activate Teacher"
        }
        message={
          pendingAction?.type === "delete"
            ? `This permanently removes ${pendingAction.teacher.name} and cannot be undone.`
            : pendingAction?.type === "suspend"
              ? `${pendingAction.teacher.name} will lose login access immediately. Their data, uploads, and quizzes are preserved.`
              : `${pendingAction?.teacher.name} will regain login access immediately.`
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete" : pendingAction?.type === "suspend" ? "Suspend" : "Activate"}
        tone={pendingAction?.type === "activate" ? "brand" : "danger"}
        isLoading={isActionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
