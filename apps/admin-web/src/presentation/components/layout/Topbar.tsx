"use client";

import { useState } from "react";
import { LogOut, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "@/state/auth-context";

// Top bar shown across every Admin page: current user + logout. Kept
// separate from Sidebar so panel-specific topbars (Teacher/Student) can
// be swapped in without touching navigation.
export function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 lg:px-6">
      <div className="lg:hidden">
        <span className="text-sm font-semibold text-brand-700">LMS Admin</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <UserCircle className="size-5" />
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">{user?.name ?? "Admin"}</span>
            <ChevronDown className="size-4 text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-900/5">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
