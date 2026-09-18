"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  DollarSign,
  AlertTriangle,
  Landmark,
  ChevronRight,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/Badge";
import {
  FilterKey,
  filterPills,
  formatCurrency,
  getDeadlineStatus,
  Matter,
  MatterStatus,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const statusTone: Record<MatterStatus, "slate" | "amber" | "blue" | "green" | "red" | "purple" | "zinc"> = {
  "Under Review": "amber",
  "Legal Redline": "purple",
  Briefing: "blue",
  Filed: "zinc",
  Investigation: "slate",
  Negotiation: "blue",
  "Awaiting Council": "purple",
  Discovery: "slate",
  "Closed - Settled": "green",
  Executed: "green",
  "Closed - Compliant": "green",
};

const typeTone: Record<string, "navy" | "blue" | "amber" | "zinc"> = {
  "Vendor Contract": "blue",
  Ordinance: "zinc",
  "Civil Action": "navy",
};

export function DocketTab({
  matters,
  onOpenCase,
}: {
  matters: Matter[];
  onOpenCase: (matter: Matter) => void;
}) {
  const [filter, setFilter] = useState<FilterKey>("All");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: matters.length };
    for (const m of matters) c[m.type] = (c[m.type] ?? 0) + 1;
    return c;
  }, [matters]);

  const totalExposure = useMemo(
    () => matters.reduce((sum, m) => sum + (m.exposure ?? 0), 0),
    [matters]
  );

  const urgentSlaCount = useMemo(
    () => matters.filter((m) => getDeadlineStatus(m).urgent).length,
    [matters]
  );

  const pendingCouncilCount = useMemo(
    () => matters.filter((m) => m.pendingCouncil).length,
    [matters]
  );

  const visibleMatters = useMemo(
    () => (filter === "All" ? matters : matters.filter((m) => m.type === filter)),
    [matters, filter]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Briefcase}
          label="Active Matters"
          value={String(matters.length)}
          sub="Open across all case types"
        />
        <MetricCard
          icon={DollarSign}
          label="Total Financial Exposure"
          value={formatCurrency(totalExposure)}
          sub="Sum of quantifiable claims & contracts"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Urgent Texas SLAs (< 15 Days)"
          value={String(urgentSlaCount)}
          sub="Claims requiring immediate statutory notice/answer"
          tone="danger"
        />
        <MetricCard
          icon={Landmark}
          label="Contracts Pending Council"
          value={String(pendingCouncilCount)}
          sub="Awaiting City Secretary agenda packet"
          tone="info"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterPills.map((p) => (
          <button
            key={p.key}
            onClick={() => setFilter(p.key)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === p.key
                ? "bg-[#0b2340] text-white border-[#0b2340]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {p.label} ({counts[p.key] ?? 0})
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Case #</th>
                <th className="px-4 py-3">Matter</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dept</th>
                <th className="px-4 py-3">Texas SLA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Financial Exposure</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visibleMatters.map((m) => {
                const deadline = getDeadlineStatus(m);
                const borderColor = deadline.overdue
                  ? "border-l-red-500"
                  : deadline.urgent
                  ? "border-l-amber-400"
                  : "border-l-transparent";
                return (
                <tr
                  key={m.id}
                  onClick={() => onOpenCase(m)}
                  className={cn(
                    "border-b border-l-4 border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors group",
                    borderColor
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                    {m.caseNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-800 max-w-[320px]">
                    {m.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={typeTone[m.type]}>{m.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {m.dept}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        deadline.urgent || deadline.overdue ? "text-red-600" : "text-slate-600"
                      )}
                    >
                      {deadline.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[m.status]}>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 whitespace-nowrap">
                    {m.exposureLabel}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
