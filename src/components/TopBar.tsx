"use client";

import { ChevronRight, ChevronDown, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Claim, Matter } from "@/lib/data";
import { tabs, TabKey } from "@/components/Sidebar";
import { Role, personas } from "@/lib/roles";

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
  claims,
  role,
  onRoleChange,
  onSelectMatter,
  onSelectClaim,
  onNewMatter,
  onOpenOutlook,
}: {
  activeTab: TabKey;
  matters: Matter[];
  claims: Claim[];
  role: Role;
  onRoleChange: (role: Role) => void;
  onSelectMatter: (matter: Matter) => void;
  onSelectClaim: (claim: Claim) => void;
  onNewMatter: () => void;
  onOpenOutlook: () => void;
}) {
  const activeLabel = tabs.find((t) => t.key === activeTab)?.label ?? "";
  const persona = personas[role];

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
          <button
            onClick={onOpenOutlook}
            title="Outlook 365 Legal Add-In"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0078D4] transition-colors"
          >
            <Mail className="h-4 w-4" />
          </button>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as Role)}
              className="appearance-none flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-1 pr-7 py-1 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
              style={{ minWidth: 0 }}
            >
              {(Object.keys(personas) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {personas[r].name} — {r}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-0 flex items-center gap-2 pl-1 pr-7">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b2340] text-white text-[10px] font-semibold">
                {persona.initials}
              </div>
              <div className="hidden sm:block leading-tight min-w-0">
                <div className="text-[11px] font-semibold text-slate-800 truncate">
                  {persona.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{role}</div>
              </div>
            </div>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <GlobalSearch
          matters={matters}
          claims={claims}
          onSelectMatter={onSelectMatter}
          onSelectClaim={onSelectClaim}
        />
        <Button className="md:ml-auto" onClick={onNewMatter}>
          <Plus className="h-4 w-4" />
          New Intake
        </Button>
      </div>
    </header>
  );
}
