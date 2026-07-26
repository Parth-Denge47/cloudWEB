"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  Library as LibraryIcon,
  Megaphone,
  KeyRound,
  IdCard,
} from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { Tabs } from "@/presentation/components/ui/Tabs";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { TableContainer, TableHead, Th, TableBody, Tr, Td } from "@/presentation/components/ui/Table";
import { TeacherFormModal } from "@/presentation/components/teachers/TeacherFormModal";
import { StudentFormModal } from "@/presentation/components/students/StudentFormModal";
import { LibraryFileModal } from "@/presentation/components/library/LibraryFileModal";
import { AnnouncementFormModal } from "@/presentation/components/announcements/AnnouncementFormModal";
import { ResetPasswordModal } from "@/presentation/components/shared/ResetPasswordModal";
import { TeacherProfileModal } from "@/presentation/components/teachers/TeacherProfileModal";
import { StudentProfileModal } from "@/presentation/components/students/StudentProfileModal";
import { tuitionService } from "@/services/tuition.service";
import { teacherService } from "@/services/teacher.service";
import { studentService } from "@/services/student.service";
import { libraryService } from "@/services/library.service";
import { courseService } from "@/services/course.service";
import { announcementService } from "@/services/announcement.service";
import { dashboardService } from "@/services/dashboard.service";
import { Tuition } from "@/domain/models/tuition.model";
import { Teacher, TeacherInput } from "@/domain/models/teacher.model";
import { Student, StudentInput } from "@/domain/models/student.model";
import { LibraryFile, LibraryFileInput } from "@/domain/models/library-file.model";
import { Course } from "@/domain/models/course.model";
import { Announcement, AnnouncementInput } from "@/domain/models/announcement.model";
import { ActivityLog, DashboardStats } from "@/domain/models/dashboard-stats.model";
import { formatDate, formatRelativeTime } from "@/utils/format";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "teachers", label: "Teachers" },
  { key: "students", label: "Students" },
  { key: "library", label: "Library" },
  { key: "courses", label: "Courses" },
  { key: "announcements", label: "Announcements" },
];

type PendingTuitionAction = { type: "suspend" | "activate" } | null;

// All interactive logic lives here as a Client Component so the route
// file itself can stay a Server Component and export generateStaticParams
// (required for the Capacitor/Android static export build).
export function TuitionDetailClient({ tuitionId }: { tuitionId: string }) {
  const router = useRouter();

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [allTuitions, setAllTuitions] = useState<Tuition[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [formKey, setFormKey] = useState(0); // bumped on every modal open to force a fresh form instance
  const [teacherFormOpen, setTeacherFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [studentFormOpen, setStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [libraryFormOpen, setLibraryFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<LibraryFile | null>(null);
  const [announcementFormOpen, setAnnouncementFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [resetPasswordTeacher, setResetPasswordTeacher] = useState<Teacher | null>(null);
  const [profileTeacher, setProfileTeacher] = useState<Teacher | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [pendingTuitionAction, setPendingTuitionAction] = useState<PendingTuitionAction>(null);
  const [deleteFileTarget, setDeleteFileTarget] = useState<LibraryFile | null>(null);
  const [deleteAnnouncementTarget, setDeleteAnnouncementTarget] = useState<Announcement | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadAll() {
    setIsLoading(true);
    const [tuitionResult, tuitionsResult, teacherList, studentList, fileList, courseList, announcementList, statsResult, activityResult] =
      await Promise.all([
        tuitionService.getById(tuitionId),
        tuitionService.getAll(),
        teacherService.getAll({ tuitionId }),
        studentService.getAll({ tuitionId }),
        libraryService.getAll({ tuitionId }),
        courseService.getAll(tuitionId),
        announcementService.getAll({ tuitionId }),
        dashboardService.getStats(tuitionId),
        dashboardService.getRecentActivity(tuitionId, 8),
      ]);
    setTuition(tuitionResult);
    setAllTuitions(tuitionsResult);
    setTeachers(teacherList);
    setStudents(studentList);
    setLibraryFiles(fileList);
    setCourses(courseList);
    setAnnouncements(announcementList);
    setStats(statsResult);
    setActivity(activityResult);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      if (tuitionId) await loadAll();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuitionId]);

  const activeTeachers = useMemo(() => teachers.filter((t) => t.status === "active"), [teachers]);

  if (isLoading) return <LoadingState label="Loading tuition..." />;
  if (!tuition) return <EmptyState icon={Users} title="Tuition not found" />;

  async function handleTuitionAction() {
    if (!pendingTuitionAction || !tuition) return;
    setIsActionLoading(true);
    try {
      const updated =
        pendingTuitionAction.type === "suspend" ? await tuitionService.suspend(tuition.id) : await tuitionService.activate(tuition.id);
      setTuition(updated);
      setPendingTuitionAction(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleTeacherSubmit(input: TeacherInput) {
    if (editingTeacher) {
      const updated = await teacherService.update(editingTeacher.id, input);
      setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await teacherService.create(input);
      setTeachers((prev) => [created, ...prev]);
      setTuition((prev) => (prev ? { ...prev, teacherCount: prev.teacherCount + 1 } : prev));
    }
  }

  async function handleStudentSubmit(input: StudentInput) {
    if (editingStudent) {
      const updated = await studentService.update(editingStudent.id, input);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await studentService.create(input);
      setStudents((prev) => [created, ...prev]);
      setTuition((prev) => (prev ? { ...prev, studentCount: prev.studentCount + 1 } : prev));
    }
  }

  async function handleLibrarySubmit(input: LibraryFileInput) {
    if (editingFile) {
      const updated = await libraryService.update(editingFile.id, input);
      setLibraryFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    } else {
      const created = await libraryService.upload(input);
      setLibraryFiles((prev) => [created, ...prev]);
    }
  }

  async function handleAnnouncementSubmit(input: AnnouncementInput) {
    if (editingAnnouncement) {
      const updated = await announcementService.update(editingAnnouncement.id, input);
      setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await announcementService.create(input);
      setAnnouncements((prev) => [created, ...prev]);
    }
  }

  return (
    <div>
      <button onClick={() => router.push("/tuitions")} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to Tuitions
      </button>

      <PageHeader
        title={tuition.tuitionName}
        description={`${tuition.tuitionCode} · ${tuition.ownerName} · ${tuition.address}`}
        actions={
          tuition.status === "active" ? (
            <Button variant="danger" onClick={() => setPendingTuitionAction({ type: "suspend" })}>
              <Ban className="size-4" /> Suspend Tuition
            </Button>
          ) : (
            <Button onClick={() => setPendingTuitionAction({ type: "activate" })}>
              <CheckCircle2 className="size-4" /> Activate Tuition
            </Button>
          )
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <Badge tone={statusTone(tuition.status)}>{tuition.status}</Badge>
        <span className="text-xs text-slate-400">Created {formatDate(tuition.createdDate)}</span>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "overview" && stats && (
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              <StatCard label="Teachers" value={stats.totalTeachers} icon={Users} tone="brand" />
              <StatCard label="Students" value={stats.totalStudents} icon={GraduationCap} tone="emerald" />
              <StatCard label="Courses" value={stats.totalCourses} icon={BookOpen} tone="amber" />
              <StatCard label="Library Files" value={stats.libraryFileCount} icon={LibraryIcon} tone="brand" />
              <StatCard label="Announcements" value={stats.totalAnnouncements} icon={Megaphone} tone="slate" />
              <StatCard label="Active Quizzes" value={stats.totalQuizzes} icon={BookOpen} tone="emerald" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent Activity</h2>
              {activity.length === 0 ? (
                <p className="text-sm text-slate-400">No recent activity for this tuition.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {activity.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <div>
                        <p className="text-slate-700">{entry.message}</p>
                        <p className="text-xs text-slate-400">
                          {entry.actorName} · {entry.actorRole}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(entry.timestamp)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === "teachers" && (
          <div>
            <div className="mb-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingTeacher(null);
                  setFormKey((k) => k + 1);
                  setTeacherFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Add Teacher
              </Button>
            </div>
            {teachers.length === 0 ? (
              <EmptyState icon={Users} title="No teachers yet" />
            ) : (
              <TableContainer>
                <TableHead>
                  <Th>Teacher</Th>
                  <Th>Teacher ID</Th>
                  <Th>Subject</Th>
                  <Th>Students</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <Tr key={teacher.id}>
                      <Td>
                        <p className="font-medium text-slate-800">{teacher.name}</p>
                        <p className="text-xs text-slate-400">{teacher.email}</p>
                      </Td>
                      <Td className="font-mono text-xs">{teacher.teacherId}</Td>
                      <Td>{teacher.subject}</Td>
                      <Td>
                        {teacher.assignedStudentCount} / {teacher.studentLimit}
                      </Td>
                      <Td>
                        <Badge tone={statusTone(teacher.status)}>{teacher.status}</Badge>
                      </Td>
                      <Td className="text-right">
                        <RowActionsMenu
                          actions={[
                            { label: "View Profile", icon: IdCard, onClick: () => setProfileTeacher(teacher) },
                            {
                              label: "Edit",
                              icon: Pencil,
                              onClick: () => {
                                setEditingTeacher(teacher);
                                setFormKey((k) => k + 1);
                                setTeacherFormOpen(true);
                              },
                            },
                            { label: "Reset Password", icon: KeyRound, onClick: () => setResetPasswordTeacher(teacher) },
                            teacher.status === "active"
                              ? {
                                  label: "Suspend",
                                  icon: Ban,
                                  onClick: async () => {
                                    const updated = await teacherService.suspend(teacher.id);
                                    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                                  },
                                }
                              : {
                                  label: "Activate",
                                  icon: CheckCircle2,
                                  onClick: async () => {
                                    const updated = await teacherService.activate(teacher.id);
                                    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                                  },
                                },
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </TableContainer>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div>
            <div className="mb-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingStudent(null);
                  setFormKey((k) => k + 1);
                  setStudentFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Add Student
              </Button>
            </div>
            {students.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No students yet" />
            ) : (
              <TableContainer>
                <TableHead>
                  <Th>Student</Th>
                  <Th>Student ID</Th>
                  <Th>Course</Th>
                  <Th>Teacher</Th>
                  <Th>Progress</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <Tr key={student.id}>
                      <Td>
                        <p className="font-medium text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </Td>
                      <Td className="font-mono text-xs">{student.studentId}</Td>
                      <Td>
                        <Badge tone="brand">{student.course}</Badge>
                      </Td>
                      <Td>{student.assignedTeacherName ?? <span className="text-slate-400">Unassigned</span>}</Td>
                      <Td>{student.progressPercent}%</Td>
                      <Td>
                        <Badge tone={statusTone(student.status)}>{student.status}</Badge>
                      </Td>
                      <Td className="text-right">
                        <RowActionsMenu
                          actions={[
                            { label: "View Profile", icon: IdCard, onClick: () => setProfileStudent(student) },
                            {
                              label: "Edit",
                              icon: Pencil,
                              onClick: () => {
                                setEditingStudent(student);
                                setFormKey((k) => k + 1);
                                setStudentFormOpen(true);
                              },
                            },
                            student.status === "active"
                              ? {
                                  label: "Suspend",
                                  icon: Ban,
                                  onClick: async () => {
                                    const updated = await studentService.suspend(student.id);
                                    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                                  },
                                }
                              : {
                                  label: "Activate",
                                  icon: CheckCircle2,
                                  onClick: async () => {
                                    const updated = await studentService.activate(student.id);
                                    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                                  },
                                },
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </TableContainer>
            )}
          </div>
        )}

        {activeTab === "library" && (
          <div>
            <div className="mb-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingFile(null);
                  setFormKey((k) => k + 1);
                  setLibraryFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Upload File
              </Button>
            </div>
            {libraryFiles.length === 0 ? (
              <EmptyState icon={LibraryIcon} title="No files uploaded yet" />
            ) : (
              <TableContainer>
                <TableHead>
                  <Th>File</Th>
                  <Th>Uploaded By</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Actions</Th>
                </TableHead>
                <TableBody>
                  {libraryFiles.map((file) => (
                    <Tr key={file.id}>
                      <Td>
                        <p className="font-medium text-slate-800">{file.title}</p>
                        <p className="text-xs text-slate-400">
                          {file.subject} · {file.course}
                        </p>
                      </Td>
                      <Td>
                        {file.uploadedByName} <span className="text-xs text-slate-400 capitalize">({file.uploadedByRole})</span>
                      </Td>
                      <Td>{formatDate(file.uploadDate)}</Td>
                      <Td className="text-right">
                        <RowActionsMenu
                          actions={[
                            {
                              label: "Edit Details",
                              icon: Pencil,
                              onClick: () => {
                                setEditingFile(file);
                                setFormKey((k) => k + 1);
                                setLibraryFormOpen(true);
                              },
                            },
                            { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteFileTarget(file) },
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </TableContainer>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {courses.length === 0 ? (
              <EmptyState icon={BookOpen} title="No courses configured yet" />
            ) : (
              courses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{course.name}</p>
                    <Badge tone="brand">{course.code}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-sm font-semibold text-slate-800">{course.teachersAssignedCount}</p>
                      <p className="text-[11px] text-slate-400">Teachers</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-sm font-semibold text-slate-800">{course.studentCount}</p>
                      <p className="text-[11px] text-slate-400">Students</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-sm font-semibold text-slate-800">{course.activeQuizCount}</p>
                      <p className="text-[11px] text-slate-400">Quizzes</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{course.lectureCount} lectures uploaded</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <div className="mb-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setFormKey((k) => k + 1);
                  setAnnouncementFormOpen(true);
                }}
              >
                <Plus className="size-4" /> Create Announcement
              </Button>
            </div>
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="No announcements yet" />
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{announcement.title}</p>
                          {announcement.isBroadcast && <Badge tone="warning">Broadcast</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{announcement.message}</p>
                      </div>
                      <RowActionsMenu
                        actions={[
                          {
                            label: "Edit",
                            icon: Pencil,
                            onClick: () => {
                              setEditingAnnouncement(announcement);
                              setFormKey((k) => k + 1);
                              setAnnouncementFormOpen(true);
                            },
                          },
                          { label: "Delete", icon: Trash2, danger: true, onClick: () => setDeleteAnnouncementTarget(announcement) },
                        ]}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{formatDate(announcement.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <TeacherFormModal
        key={`teacher-${formKey}`}
        open={teacherFormOpen}
        teacher={editingTeacher}
        tuitions={allTuitions}
        defaultTuitionId={tuition.id}
        onClose={() => setTeacherFormOpen(false)}
        onSubmit={handleTeacherSubmit}
      />
      <StudentFormModal
        key={`student-${formKey}`}
        open={studentFormOpen}
        student={editingStudent}
        tuitions={allTuitions}
        teachers={activeTeachers}
        defaultTuitionId={tuition.id}
        onClose={() => setStudentFormOpen(false)}
        onSubmit={handleStudentSubmit}
      />
      <LibraryFileModal
        key={`library-${formKey}`}
        open={libraryFormOpen}
        file={editingFile}
        tuitions={allTuitions}
        defaultTuitionId={tuition.id}
        onClose={() => setLibraryFormOpen(false)}
        onSubmit={handleLibrarySubmit}
      />
      <AnnouncementFormModal
        key={`announcement-${formKey}`}
        open={announcementFormOpen}
        announcement={editingAnnouncement}
        tuitions={allTuitions}
        defaultTuitionId={tuition.id}
        onClose={() => setAnnouncementFormOpen(false)}
        onSubmit={handleAnnouncementSubmit}
      />
      <ResetPasswordModal
        key={resetPasswordTeacher?.id}
        open={Boolean(resetPasswordTeacher)}
        subjectLabel={resetPasswordTeacher ? `${resetPasswordTeacher.name} (${resetPasswordTeacher.teacherId})` : ""}
        onClose={() => setResetPasswordTeacher(null)}
        onSubmit={async (newPassword) => {
          if (resetPasswordTeacher) await teacherService.resetPassword(resetPasswordTeacher.id, newPassword);
        }}
      />

      <TeacherProfileModal open={Boolean(profileTeacher)} teacher={profileTeacher} onClose={() => setProfileTeacher(null)} />
      <StudentProfileModal open={Boolean(profileStudent)} student={profileStudent} onClose={() => setProfileStudent(null)} />

      <ConfirmDialog
        open={Boolean(pendingTuitionAction)}
        title={pendingTuitionAction?.type === "suspend" ? "Suspend Tuition" : "Activate Tuition"}
        message={
          pendingTuitionAction?.type === "suspend"
            ? `Suspending ${tuition.tuitionName} will immediately:\n\n• Block teacher and student logins\n• Block lecture uploads, library uploads, and quiz creation\n• Block quiz attempts, lecture viewing, and library access\n\nAll existing data, files, quizzes, and lectures are preserved and nothing is deleted.`
            : `Reactivating ${tuition.tuitionName} immediately restores teacher and student logins. All previous data, quizzes, lectures, and library access resume automatically.`
        }
        confirmLabel={pendingTuitionAction?.type === "suspend" ? "Suspend Tuition" : "Activate Tuition"}
        tone={pendingTuitionAction?.type === "suspend" ? "danger" : "brand"}
        isLoading={isActionLoading}
        onConfirm={handleTuitionAction}
        onCancel={() => setPendingTuitionAction(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteFileTarget)}
        title="Delete File"
        message={`"${deleteFileTarget?.title}" will be permanently removed from the library.`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={async () => {
          if (!deleteFileTarget) return;
          setIsActionLoading(true);
          try {
            await libraryService.delete(deleteFileTarget.id);
            setLibraryFiles((prev) => prev.filter((f) => f.id !== deleteFileTarget.id));
            setDeleteFileTarget(null);
          } finally {
            setIsActionLoading(false);
          }
        }}
        onCancel={() => setDeleteFileTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteAnnouncementTarget)}
        title="Delete Announcement"
        message={`"${deleteAnnouncementTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        isLoading={isActionLoading}
        onConfirm={async () => {
          if (!deleteAnnouncementTarget) return;
          setIsActionLoading(true);
          try {
            await announcementService.delete(deleteAnnouncementTarget.id);
            setAnnouncements((prev) => prev.filter((a) => a.id !== deleteAnnouncementTarget.id));
            setDeleteAnnouncementTarget(null);
          } finally {
            setIsActionLoading(false);
          }
        }}
        onCancel={() => setDeleteAnnouncementTarget(null)}
      />
    </div>
  );
}
