import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "brand" | "emerald" | "amber" | "red" | "slate";
  hint?: string;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  slate: "bg-slate-100 text-slate-600",
};

// Dashboard summary tile — reused on the global Admin dashboard and the
// per-tuition Tuition Management dashboard.
export function StatCard({ label, value, icon: Icon, tone = "brand", hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={clsx("flex size-9 items-center justify-center rounded-xl", TONE_CLASSES[tone])}>
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
