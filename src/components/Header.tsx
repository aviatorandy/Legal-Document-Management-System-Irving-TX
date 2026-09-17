import { Scale } from "lucide-react";

function StatusPill({
  color,
  label,
}: {
  color: "green" | "blue" | "purple";
  label: string;
}) {
  const dot = {
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  }[color];
  return (
    <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
      <span className={`h-2 w-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0b2340]">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-slate-900 truncate">
                City of Irving | Office of the City Attorney
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center rounded-full bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
                POWERED BY CONCOURSE LEGALFLOW
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusPill color="green" label="M365 SharePoint: Synced" />
          <StatusPill color="blue" label="Adobe Acrobat Pro: Connected" />
          <StatusPill color="purple" label="Texas SLA Engine: Active" />
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-1 pr-3 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b2340] text-white text-[11px] font-semibold">
              AC
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-slate-800">
                Andy Chang
              </div>
              <div className="text-[10px] text-slate-500">
                Assistant City Attorney
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
