"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, X, Paperclip, FileText, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Matter, Claim } from "@/lib/data";

interface FileTarget {
  kind: "matter" | "claim";
  id: string;
  caseNumber: string;
  title: string;
}

export function OutlookFilingDrawer({
  open,
  onClose,
  matters,
  claims,
  onFile,
}: {
  open: boolean;
  onClose: () => void;
  matters: Matter[];
  claims: Claim[];
  onFile: (target: FileTarget, savedEmailBody: boolean, savedAttachment: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FileTarget | null>(null);
  const [saveBody, setSaveBody] = useState(true);
  const [saveAttachment, setSaveAttachment] = useState(true);
  const [filed, setFiled] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setSaveBody(true);
      setSaveAttachment(true);
      setFiled(false);
    }
  }, [open]);

  const targets = useMemo<FileTarget[]>(() => {
    const matterTargets: FileTarget[] = matters.map((m) => ({
      kind: "matter",
      id: m.id,
      caseNumber: m.caseNumber,
      title: m.title,
    }));
    const claimTargets: FileTarget[] = claims.map((c) => ({
      kind: "claim",
      id: c.id,
      caseNumber: c.claimNumber,
      title: c.title,
    }));
    return [...matterTargets, ...claimTargets];
  }, [matters, claims]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return targets
      .filter(
        (t) =>
          t.caseNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [targets, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0078D4]">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Outlook 365 Legal Add-In</p>
              <p className="text-[11px] text-slate-400">Concourse LegalFlow Simulator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Inbox — Litigation Correspondence</span>
              <span>Today, 9:14 AM</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              Answer &amp; Counterclaim — MacArthur Blvd Matter
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              From: Deborah Klein, Esq. &lt;dklein@klein-associates-law.com&gt;
            </p>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              Counsel, please find attached our client&apos;s Answer and Counterclaim in the
              above-referenced matter, filed with the Dallas County District Clerk this
              morning. We look forward to discussing scheduling at your earliest convenience.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
              <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-700 truncate">
                Answer_and_Counterclaim.pdf
              </span>
            </div>
          </div>

          {!filed ? (
            <>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  File to Matter or Claim
                </p>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={selected ? `${selected.caseNumber} — ${selected.title}` : query}
                    onChange={(e) => {
                      setSelected(null);
                      setQuery(e.target.value);
                    }}
                    placeholder="Search case #, claim #, or title..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
                  />
                </div>
                {!selected && query.trim() && (
                  <div className="mt-1.5 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {results.length === 0 ? (
                      <div className="px-3 py-2.5 text-sm text-slate-400">No matches found</div>
                    ) : (
                      <ul>
                        {results.map((t) => (
                          <li key={`${t.kind}-${t.id}`}>
                            <button
                              onClick={() => {
                                setSelected(t);
                                setQuery("");
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors"
                            >
                              <span className="font-mono text-xs font-medium text-slate-500">
                                {t.caseNumber}
                              </span>
                              <p className="text-sm text-slate-800 truncate">{t.title}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={saveBody}
                    onChange={(e) => setSaveBody(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Save Email Body as PDF
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={saveAttachment}
                    onChange={(e) => setSaveAttachment(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Save Attachment (Answer_and_Counterclaim.pdf)
                </label>
              </div>

              <Button
                className="w-full justify-center"
                disabled={!selected || (!saveBody && !saveAttachment)}
                onClick={() => {
                  if (!selected) return;
                  onFile(selected, saveBody, saveAttachment);
                  setFiled(true);
                }}
              >
                <FileText className="h-4 w-4" />
                File to {selected ? selected.caseNumber : "Matter"}
              </Button>
            </>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Filed to {selected?.caseNumber}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Document repository updated. No manual download or re-upload required.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
