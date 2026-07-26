import clsx from "clsx";

type BadgeTone = "success" | "danger" | "neutral" | "brand" | "warning";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

// Small pill used for statuses (active/suspended), roles, and tags.
export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone]
      )}
    >
      {children}
    </span>
  );
}

// Maps common status strings to a sensible badge tone so callers don't
// have to repeat the same switch statement everywhere.
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "active":
    case "published":
      return "success";
    case "suspended":
    case "closed":
      return "danger";
    case "draft":
      return "neutral";
    case "scheduled":
      return "warning";
    case "archived":
      return "neutral";
    default:
      return "brand";
  }
}
