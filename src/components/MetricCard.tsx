import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "warning" | "danger" | "info";
}) {
  const toneClasses = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p
            className={cn(
              "mt-1.5 text-2xl font-semibold tracking-tight",
              tone === "danger" ? "text-red-600" : "text-slate-900"
            )}
          >
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={cn("rounded-lg p-2", toneClasses)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
