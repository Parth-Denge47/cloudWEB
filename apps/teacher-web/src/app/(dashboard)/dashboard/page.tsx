"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, FileQuestion, Video, Library as LibraryIcon, Megaphone } from "lucide-react";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { LoadingState } from "@/presentation/components/ui/LoadingState";
import { useAuth } from "@/state/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import { TeacherDashboardStats } from "@/domain/repositories/dashboard.repository";

export default function DashboardPage() {
  const { teacher } = useAuth();
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teacher) return;
    void (async () => {
      const result = await dashboardService.getStats(teacher.id);
      setStats(result);
      setIsLoading(false);
    })();
  }, [teacher]);

  if (isLoading || !stats) return <LoadingState label="Loading dashboard..." />;

  return (
    <div>
      <PageHeader title={`Welcome, ${teacher?.name}`} description={`${teacher?.subject} · ${teacher?.tuitionName}`} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="brand" />
        <StatCard label="Remaining Capacity" value={stats.remainingCapacity} icon={UserCheck} tone="emerald" hint={`Limit: ${stats.studentLimit}`} />
        <StatCard label="Today's Quizzes" value={stats.todaysQuizCount} icon={FileQuestion} tone="amber" />
        <StatCard label="Lectures" value={stats.lectureCount} icon={Video} tone="brand" />
        <StatCard label="Library Files" value={stats.libraryFileCount} icon={LibraryIcon} tone="emerald" />
        <StatCard label="Announcements" value={stats.announcementCount} icon={Megaphone} tone="slate" />
      </div>
    </div>
  );
}
