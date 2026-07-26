"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Users, GraduationCap, BookOpen, Building2, ShieldCheck, ShieldOff, Pencil, Ban, CheckCircle2, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { Button } from "@/presentation/components/ui/Button";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { Badge, statusTone } from "@/presentation/components/ui/Badge";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { RowActionsMenu } from "@/presentation/components/ui/RowActionsMenu";
import { TuitionFormModal } from "@/presentation/components/tuitions/TuitionFormModal";
import { tuitionService } from "@/services/tuition.service";
import { dashboardService } from "@/services/dashboard.service";
import { Tuition, TuitionInput } from "@/domain/models/tuition.model";
import { DashboardStats } from "@/domain/models/dashboard-stats.model";
import { formatDate } from "@/utils/format";

type PendingAction = { type: "suspend" | "activate"; tuition: Tuition } | null;

export default function TuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Tuition["status"]>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on every open to force a fresh form instance
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    const [tuitionList, statsResult] = await Promise.all([tuitionService.getAll(), dashboardService.getStats()]);
    setTuitions(tuitionList);
    setStats(statsResult);
    setIsLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  const filteredTuitions = useMemo(() => {
    return tuitions.filter((t) => {
      const matchesSearch =
        !search ||
        t.tuitionName.toLowerCase().includes(search.toLowerCase()) ||
        t.tuitionCode.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tuitions, search, statusFilter]);

  async function handleCreateOrUpdate(input: TuitionInput) {
    if (editingTuition) {
      const updated = await tuitionService.update(editingTuition.id, input);
      setTuitions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await tuitionService.create(input);
      setTuitions((prev) => [created, ...prev]);
    }
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;
    setIsActionLoading(true);
    try {
      const { type, tuition } = pendingAction;
      const updated = type === "suspend" ? await tuitionService.suspend(tuition.id) : await tuitionService.activate(tuition.id);
      setTuitions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setPendingAction(null);
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Tuition Management"
        description="Manage every tuition branch operating under this platform."
        actions={
          <Button
            onClick={() => {
              setEditingTuition(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Add Tuition
          </Button>
        }
      />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Tuitions" value={stats.totalTuitions} icon={Building2} tone="brand" />
          <StatCard label="Active" value={stats.activeTuitions} icon={ShieldCheck} tone="emerald" />
          <StatCard label="Suspended" value={stats.suspendedTuitions} icon={ShieldOff} tone="red" />
          <StatCard label="Total Teachers" value={stats.totalTeachers} icon={Users} tone="brand" />
          <StatCard label="Total Students" value={stats.totalStudents} icon={GraduationCap} tone="emerald" />
          <StatCard label="Total Courses" value={stats.totalCourses} icon={BookOpen} tone="amber" />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by tuition name or code" className="max-w-xs" />
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
        <LoadingState label="Loading tuitions..." />
      ) : filteredTuitions.length === 0 ? (
        <EmptyState icon={Building2} title="No tuitions found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTuitions.map((tuition) => (
            <div key={tuition.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{tuition.tuitionName}</p>
                  <p className="font-mono text-xs text-slate-400">{tuition.tuitionCode}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge tone={statusTone(tuition.status)}>{tuition.status}</Badge>
                  <RowActionsMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => {
                          setEditingTuition(tuition);
                          setFormKey((k) => k + 1);
                          setFormOpen(true);
                        },
                      },
                      tuition.status === "active"
                        ? { label: "Suspend", icon: Ban, onClick: () => setPendingAction({ type: "suspend", tuition }) }
                        : { label: "Activate", icon: CheckCircle2, onClick: () => setPendingAction({ type: "activate", tuition }) },
                    ]}
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-500">{tuition.ownerName} · {tuition.address}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 py-2">
                  <p className="text-sm font-semibold text-slate-800">{tuition.teacherCount}</p>
                  <p className="text-[11px] text-slate-400">Teachers</p>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <p className="text-sm font-semibold text-slate-800">{tuition.studentCount}</p>
                  <p className="text-[11px] text-slate-400">Students</p>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <p className="text-sm font-semibold text-slate-800">{tuition.activeCourseCount}</p>
                  <p className="text-[11px] text-slate-400">Courses</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">Since {formatDate(tuition.createdDate)}</span>
                <Link href={`/tuitions/${tuition.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                  Manage <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <TuitionFormModal key={formKey} open={formOpen} tuition={editingTuition} onClose={() => setFormOpen(false)} onSubmit={handleCreateOrUpdate} />

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "suspend" ? "Suspend Tuition" : "Activate Tuition"}
        message={
          pendingAction?.type === "suspend"
            ? `Suspending ${pendingAction.tuition.tuitionName} will immediately:\n\n• Block teacher and student logins\n• Block lecture uploads, library uploads, and quiz creation\n• Block quiz attempts, lecture viewing, and library access\n\nAll existing data, files, quizzes, and lectures are preserved and nothing is deleted.`
            : `Reactivating ${pendingAction?.tuition.tuitionName} immediately restores teacher and student logins. All previous data, quizzes, lectures, and library access resume automatically.`
        }
        confirmLabel={pendingAction?.type === "suspend" ? "Suspend Tuition" : "Activate Tuition"}
        tone={pendingAction?.type === "suspend" ? "danger" : "brand"}
        isLoading={isActionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
