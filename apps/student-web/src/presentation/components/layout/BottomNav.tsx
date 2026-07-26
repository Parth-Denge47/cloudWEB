"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Video, Library, FileQuestion, Award, Megaphone } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/lectures", label: "Lectures", icon: Video },
  { href: "/library", label: "Library", icon: Library },
  { href: "/quizzes", label: "Quizzes", icon: FileQuestion },
  { href: "/results", label: "Results", icon: Award },
  { href: "/announcements", label: "News", icon: Megaphone },
];

// Primary navigation on small/mobile viewports (including the Capacitor
// Android build). The desktop Sidebar is `hidden` below the `lg`
// breakpoint, so on a phone this bar is the only way to reach any page
// besides the dashboard.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-100 bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex w-full overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                isActive ? "text-brand-600" : "text-slate-400"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
