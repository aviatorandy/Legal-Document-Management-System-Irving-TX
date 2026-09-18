"use client";

import { useState } from "react";
import {
  UploadCloud,
  Sparkles,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IngestedDoc } from "@/lib/data";

const iconFor = (docType: string) => {
  if (docType.includes("Police")) return ShieldCheck;
  if (docType.includes("Financial")) return Receipt;
  if (docType.includes("Photographic")) return ImageIcon;
  return FileText;
};

const toneClass: Record<string, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function IngestionTab({
  docs,
  onRedact,
  onNotify,
  onAudit,
  linkedMatterNumber,
}: {
  docs: IngestedDoc[];
  onRedact: () => void;
  onNotify: (title: string, description?: string) => void;
  onAudit: (action: string, target: string) => void;
  linkedMatterNumber?: string;
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const actionNeededDoc = docs.find((d) => d.status === "Action Required");

  function runTriage() {
    if (running) return;
    setRunning(true);
    setProgress(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / 1000) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timer);
        setRunning(false);
        onNotify(
          "Concourse AI Document Triage complete",
          "All 4 documents extracted & synced to M365 SharePoint."
        );
        onAudit("Ran AI document triage (4 files)", "CLM-2026-089");
      }
    }, 60);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Case #CLM-2026-089: Multi-File Ingestion Bundle
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Pothole & Axle Structural Damage (MacArthur Blvd) — Public Works
          </p>
          {linkedMatterNumber && (
            <p className="text-xs font-medium text-purple-700 mt-1">
              Linked to litigation matter {linkedMatterNumber} — escalated from this claim
            </p>
          )}
        </div>
        <Button variant="primary" onClick={runTriage} disabled={running}>
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Run Concourse AI Document Triage
        </Button>
      </div>

      {actionNeededDoc && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              Action required: juvenile PII detected in {actionNeededDoc.fileName}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              This document cannot be released in response to a public records request until redacted.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={onRedact} className="shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            Redact Now with Adobe Pro
          </Button>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onNotify("File received", "Queued for Concourse AI classification.");
        }}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? "border-[#0b2340] bg-slate-50"
            : "border-slate-300 bg-white"
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-700">
          Drag & drop additional files, or click to browse
        </p>
        <p className="text-xs text-slate-400 mt-1">
          PDF, JPG, PNG, DOCX up to 50MB — auto-classified on ingestion
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() =>
            onNotify("File received", "Queued for Concourse AI classification.")
          }
        >
          Upload Additional Files
        </Button>
      </div>

      {running && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">
              Extracting metadata & syncing to M365...
            </span>
            <span className="text-slate-500">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0b2340] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Document Type</th>
                <th className="px-4 py-3">Auto-Extracted Tags</th>
                <th className="px-4 py-3">Sync Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const Icon = iconFor(d.docType);
                return (
                  <tr
                    key={d.id}
                    className={`border-b border-slate-100 last:border-0 ${
                      d.status === "Action Required" ? "bg-amber-50/60" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">
                          {d.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {d.docType}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                        {d.tags.map((t) => (
                          <span
                            key={t.label}
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass[t.tone]}`}
                          >
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {d.progress >= 100 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          100% Extracted & Synced to M365
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pending triage</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          d.status === "Action Required"
                            ? "red"
                            : d.status === "Redacted & Signed"
                            ? "green"
                            : "slate"
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.id === "d2" && d.status !== "Redacted & Signed" && (
                        <Button size="sm" variant="danger" onClick={onRedact}>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Redact Now
                        </Button>
                      )}
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
