"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/state/auth-context";
import { Sidebar } from "@/presentation/components/layout/Sidebar";
import { Topbar } from "@/presentation/components/layout/Topbar";
import { BottomNav } from "@/presentation/components/layout/BottomNav";
import { LoadingState } from "@/presentation/components/ui/LoadingState";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { student, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !student) router.replace("/login");
  }, [isLoading, student, router]);

  if (isLoading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:p-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
