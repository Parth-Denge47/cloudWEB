"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, LucideIcon } from "lucide-react";
import clsx from "clsx";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

// Per-row "..." actions dropdown, reused across Teacher/Student/Tuition/
// Library/Lecture/Announcement tables so action lists stay consistent.
export function RowActionsMenu({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Row actions"
      >
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-900/5">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              className={clsx(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50",
                action.danger ? "text-red-600" : "text-slate-600"
              )}
            >
              <action.icon className="size-4" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
