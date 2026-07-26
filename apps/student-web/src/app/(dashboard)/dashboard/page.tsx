"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Video, Library as LibraryIcon, Megaphone, TrendingUp, PlayCircle } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { Badge } from "@/presentation/components/ui/Badge";
import { useAuth } from "@/state/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import { announcementService } from "@/services/announcement.service";
import { StudentDashboardStats } from "@/domain/repositories/dashboard.repository";
import { Announcement } from "@/domain/models/announcement.model";
import { formatDateTime } from "@/utils/format";

export default function DashboardPage() {
  const { student } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    void (async () => {
      const [statsResult, announcementResult] = await Promise.all([
        dashboardService.getStats(student.id),
        announcementService.getAll({ tuitionId: student.tuitionId }),
      ]);
      setStats(statsResult);
      setAnnouncements(announcementResult.slice(0, 4));
      setIsLoading(false);
    })();
  }, [student]);

  if (isLoading || !stats) return <LoadingState label="Loading dashboard..." />;

  return (
    <div>
      <PageHeader title={`Welcome, ${student?.name}`} description={`${student?.course} · ${student?.tuitionName}`} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Upcoming Tests" value={stats.upcomingTestCount} icon={CalendarClock} tone="amber" />
        <StatCard label="Lectures" value={stats.lectureCount} icon={Video} tone="brand" />
        <StatCard label="Library Files" value={stats.libraryFileCount} icon={LibraryIcon} tone="emerald" />
        <StatCard label="Announcements" value={stats.announcementCount} icon={Megaphone} tone="slate" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02] xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Your Progress</h2>
            <TrendingUp className="size-4 text-brand-500" />
          </div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall completion</span>
            <span className="font-medium text-slate-700">{stats.progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${stats.progressPercent}%` }} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/lectures" className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <PlayCircle className="size-5 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-slate-700">Watch Lectures</p>
                <p className="text-xs text-slate-400">Today&apos;s classes</p>
              </div>
            </Link>
            <Link href="/quizzes" className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <CalendarClock className="size-5 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-slate-700">Attempt Quiz</p>
                <p className="text-xs text-slate-400">Upcoming tests</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-sm text-slate-400">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">{a.title}</p>
                    {a.isBroadcast && <Badge tone="warning">Broadcast</Badge>}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{a.message}</p>
                  <p className="mt-1 text-[11px] text-slate-300">{formatDateTime(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
