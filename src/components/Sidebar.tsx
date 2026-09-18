"use client";

import {
  Scale,
  Gavel,
  FileWarning,
  FolderInput,
  FileCheck2,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "docket" | "claims" | "ingestion" | "contract" | "reporting" | "audit";

export const tabs: { key: TabKey; label: string; icon: typeof Gavel }[] = [
  { key: "docket", label: "Litigation & Matters Docket", icon: Gavel },
  { key: "claims", label: "Claims Intake & Triage", icon: FileWarning },
  { key: "ingestion", label: "Document Ingestion & Triage", icon: FolderInput },
  { key: "contract", label: "Contract Compliance Studio", icon: FileCheck2 },
  { key: "reporting", label: "Reporting & Analytics", icon: BarChart3 },
  { key: "audit", label: "Audit Log", icon: ClipboardList },
];

export function Sidebar({
  activeTab,
  visibleTabs,
  onSelect,
}: {
  activeTab: TabKey;
  visibleTabs: TabKey[];
  onSelect: (key: TabKey) => void;
}) {
  const visible = tabs.filter((t) => visibleTabs.includes(t.key));

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2340]">
          <Scale className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-tight">Concourse</p>
          <p className="text-[11px] text-slate-400 leading-tight">LegalFlow</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visible.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onSelect(t.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                active
                  ? "bg-[#0b2340] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">City of Irving</p>
        <p className="text-[11px] text-slate-400">Office of the City Attorney</p>
      </div>
    </aside>
  );
}
