"use client";

import { useMemo, useState } from "react";
import { ChevronRight, FileWarning } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Claim, ClaimStatus, formatCurrency, formatShortDate } from "@/lib/data";
import { MetricCard } from "@/components/MetricCard";
import { DollarSign, FileClock } from "lucide-react";

const statusTone: Record<ClaimStatus, "amber" | "slate" | "red" | "green" | "purple"> = {
  "Notice Filed": "slate",
  "Under Review": "amber",
  Investigation: "slate",
  Denied: "red",
  Settled: "green",
  "Converted to Litigation": "purple",
};

export function ClaimsTab({
  claims,
  onOpenClaim,
}: {
  claims: Claim[];
  onOpenClaim: (claim: Claim) => void;
}) {
  const [filter, setFilter] = useState<"All" | ClaimStatus>("All");

  const totalDemand = useMemo(
    () => claims.reduce((sum, c) => sum + c.initialDemand, 0),
    [claims]
  );
  const openCount = useMemo(
    () => claims.filter((c) => c.status !== "Settled" && c.status !== "Denied" && c.status !== "Converted to Litigation").length,
    [claims]
  );

  const visible = useMemo(
    () => (filter === "All" ? claims : claims.filter((c) => c.status === filter)),
    [claims, filter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Claims Intake & Triage</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Claims from citizens and vendors under the Texas Tort Claims Act, before they escalate into litigation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard icon={FileClock} label="Open Claims" value={String(openCount)} sub="Not yet settled, denied, or converted" />
        <MetricCard icon={DollarSign} label="Total Initial Demand" value={formatCurrency(totalDemand)} sub="Sum across all claims below" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Notice Filed", "Under Review", "Investigation", "Settled", "Denied", "Converted to Litigation"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === s
                ? "bg-[#0b2340] text-white border-[#0b2340]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Claim #</th>
                <th className="px-4 py-3">Claimant</th>
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">Dept</th>
                <th className="px-4 py-3 text-right">Demand</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onOpenClaim(c)}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                    {c.claimNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-800">{c.claimantName}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[280px]">
                    <div className="truncate">{c.title}</div>
                    <div className="text-xs text-slate-400">{formatShortDate(c.incidentDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.dept}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 whitespace-nowrap">
                    {formatCurrency(c.initialDemand)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    <FileWarning className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                    No claims match this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
