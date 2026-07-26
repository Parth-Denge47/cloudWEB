"use client";

import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileQuestion,
  Megaphone,
  Library as LibraryIcon,
  Video,
  Building2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { dashboardService } from "@/services/dashboard.service";
import { tuitionService } from "@/services/tuition.service";
import { DashboardStats, ActivityLog } from "@/domain/models/dashboard-stats.model";
import { Tuition } from "@/domain/models/tuition.model";
import { formatRelativeTime } from "@/utils/format";

const PIE_COLORS = ["#2563eb", "#93c5fd"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.getStats(), dashboardService.getRecentActivity(undefined, 8), tuitionService.getAll()]).then(
      ([statsResult, activityResult, tuitionsResult]) => {
        setStats(statsResult);
        setActivity(activityResult);
        setTuitions(tuitionsResult);
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading || !stats) return <LoadingState label="Loading dashboard..." />;

  const studentsPerTuition = tuitions.map((t) => ({ name: t.tuitionCode, students: t.studentCount }));
  const tuitionStatusSplit = [
    { name: "Active", value: stats.activeTuitions },
    { name: "Suspended", value: stats.suspendedTuitions },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Platform-wide overview across every tuition." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Teachers" value={stats.totalTeachers} icon={Users} tone="brand" />
        <StatCard label="Total Students" value={stats.totalStudents} icon={GraduationCap} tone="emerald" />
        <StatCard label="Total Courses" value={stats.totalCourses} icon={BookOpen} tone="brand" />
        <StatCard label="Total Quizzes" value={stats.totalQuizzes} icon={FileQuestion} tone="amber" />
        <StatCard label="Announcements" value={stats.totalAnnouncements} icon={Megaphone} tone="brand" />
        <StatCard label="Library Files" value={stats.libraryFileCount} icon={LibraryIcon} tone="emerald" />
        <StatCard label="Video Lectures" value={stats.videoLectureCount} icon={Video} tone="amber" />
        <StatCard label="Tuitions" value={stats.totalTuitions} icon={Building2} tone="slate" hint={`${stats.activeTuitions} active · ${stats.suspendedTuitions} suspended`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02] xl:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Students per Tuition</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={studentsPerTuition}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#eff6ff" }} contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }} />
              <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Tuition Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tuitionStatusSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {tuitionStatusSplit.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent Activity</h2>
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
      </div>
    </div>
  );
}
