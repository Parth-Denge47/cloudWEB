"use client";

import clsx from "clsx";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

// Horizontal tab strip used on the Tuition Detail page (Overview,
// Teachers, Students, Library, Courses, Announcements).
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            active === tab.key
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
