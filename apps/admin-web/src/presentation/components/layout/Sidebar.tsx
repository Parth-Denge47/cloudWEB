"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Library,
  Video,
  Megaphone,
  FileQuestion,
  GraduationCap as LogoIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tuitions", label: "Tuition Management", icon: Building2 },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/quizzes", label: "Quizzes", icon: FileQuestion },
  { href: "/library", label: "Library", icon: Library },
  { href: "/lectures", label: "Video Lectures", icon: Video },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
];

// Primary left navigation for the Admin panel. Independent from the
// Teacher/Student panel navigation per the spec's "independent
// navigation per panel" requirement.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white lg:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <LogoIcon className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">LMS Admin</p>
          <p className="text-[11px] text-slate-400">Coaching Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <Icon className={clsx("size-4.5", isActive ? "text-brand-600" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-6 py-4 text-[11px] text-slate-400">
        Backend-ready · Mock data mode
      </div>
    </aside>
  );
}
