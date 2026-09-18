"use client";

import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Matter } from "@/lib/data";
import { tabs, TabKey } from "@/components/Sidebar";

function StatusPill({ color, label }: { color: "green" | "blue" | "purple"; label: string }) {
  const dot = { green: "bg-emerald-500", blue: "bg-blue-500", purple: "bg-purple-500" }[color];
  return (
    <div className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
      <span className={`h-1.5 w-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </div>
  );
}

export function TopBar({
  activeTab,
  matters,
  onSelectMatter,
  onNewMatter,
}: {
  activeTab: TabKey;
  matters: Matter[];
  onSelectMatter: (matter: Matter) => void;
  onNewMatter: () => void;
}) {
  const activeLabel = tabs.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
          <span className="font-medium text-slate-400">City Attorney</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
          <span className="font-semibold text-slate-800 truncate">{activeLabel}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusPill color="green" label="M365 SharePoint: Synced" />
          <StatusPill color="blue" label="Adobe Acrobat Pro: Connected" />
          <StatusPill color="purple" label="Texas SLA Engine: Active" />
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-1 pr-3 py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b2340] text-white text-[10px] font-semibold">
              AC
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-[11px] font-semibold text-slate-800">Andy Chang</div>
              <div className="text-[10px] text-slate-500">Assistant City Attorney</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <GlobalSearch matters={matters} onSelect={onSelectMatter} />
        <Button className="md:ml-auto" onClick={onNewMatter}>
          <Plus className="h-4 w-4" />
          New Matter Intake
        </Button>
      </div>
    </header>
  );
}
