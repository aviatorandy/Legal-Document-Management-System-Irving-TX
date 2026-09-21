"use client";

import { useMemo } from "react";
import { BarChart3, Building2, Gauge, PieChart } from "lucide-react";
import { formatCurrency, getDeadlineStatus, Matter, MatterStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const barColor = "bg-[#0b2340]";

function HorizontalBar({
  label,
  value,
  maxValue,
  displayValue,
}: {
  label: string;
  value: number;
  maxValue: number;
  displayValue: string;
}) {
  const pct = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500 tabular-nums">{displayValue}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ReportingTab({ matters }: { matters: Matter[] }) {
  const byDept = useMemo(() => {
    const map = new Map<string, { count: number; exposure: number }>();
    for (const m of matters) {
      const entry = map.get(m.dept) ?? { count: 0, exposure: 0 };
      entry.count += 1;
      entry.exposure += m.exposure ?? 0;
      map.set(m.dept, entry);
    }
    return Array.from(map.entries())
      .map(([dept, v]) => ({ dept, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [matters]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of matters) {
      map.set(m.type, (map.get(m.type) ?? 0) + (m.exposure ?? 0));
    }
    return Array.from(map.entries())
      .map(([type, exposure]) => ({ type, exposure }))
      .sort((a, b) => b.exposure - a.exposure);
  }, [matters]);

  const byStatus = useMemo(() => {
    const map = new Map<MatterStatus, number>();
    for (const m of matters) {
      map.set(m.status, (map.get(m.status) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [matters]);

  const turnaround = useMemo(() => {
    const total = matters.length;
    const onTrack = matters.filter((m) => {
      const d = getDeadlineStatus(m);
      return !d.overdue && !d.urgent;
    }).length;
    const atRisk = matters.filter((m) => getDeadlineStatus(m).urgent).length;
    const overdue = matters.filter((m) => getDeadlineStatus(m).overdue).length;
    const complianceRate = total > 0 ? Math.round((onTrack / total) * 100) : 0;
    return { total, onTrack, atRisk, overdue, complianceRate };
  }, [matters]);

  const maxDeptCount = Math.max(...byDept.map((d) => d.count), 1);
  const maxTypeExposure = Math.max(...byType.map((t) => t.exposure), 1);
  const maxStatusCount = Math.max(...byStatus.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Reporting & Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          See where financial exposure and caseload are concentrated, and how well matters are keeping pace with their deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-4 w-4 text-emerald-600" />
            <p className="text-xs font-medium text-slate-500">Statutory Turnaround Compliance</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{turnaround.complianceRate}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {turnaround.onTrack} on track · {turnaround.atRisk} at risk (&lt;15 days) · {turnaround.overdue} overdue
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-medium text-slate-500">Departments with Active Matters</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{byDept.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            Highest caseload: {byDept[0]?.dept ?? "—"} ({byDept[0]?.count ?? 0})
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="h-4 w-4 text-purple-600" />
            <p className="text-xs font-medium text-slate-500">Largest Exposure Category</p>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(byType[0]?.exposure ?? 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{byType[0]?.type ?? "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-[#0b2340]" />
            <h3 className="text-sm font-semibold text-slate-900">Caseload by Department</h3>
          </div>
          <div className="space-y-3">
            {byDept.map((d) => (
              <HorizontalBar
                key={d.dept}
                label={d.dept}
                value={d.count}
                maxValue={maxDeptCount}
                displayValue={`${d.count} matter${d.count === 1 ? "" : "s"}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-[#0b2340]" />
            <h3 className="text-sm font-semibold text-slate-900">Financial Exposure by Matter Type</h3>
          </div>
          <div className="space-y-3">
            {byType.map((t) => (
              <HorizontalBar
                key={t.type}
                label={t.type}
                value={t.exposure}
                maxValue={maxTypeExposure}
                displayValue={formatCurrency(t.exposure)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-[#0b2340]" />
            <h3 className="text-sm font-semibold text-slate-900">Matter Status Distribution</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {byStatus.map((s) => (
              <HorizontalBar
                key={s.status}
                label={s.status}
                value={s.count}
                maxValue={maxStatusCount}
                displayValue={`${s.count}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
