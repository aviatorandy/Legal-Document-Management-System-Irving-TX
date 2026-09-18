"use client";

import { Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IngestedDoc } from "@/lib/data";

const REDACTABLE_FILENAME_PREFIX = "Irving_PD_Incident_Report_902";

export function isRedactableDoc(doc: IngestedDoc): boolean {
  return doc.fileName.startsWith(REDACTABLE_FILENAME_PREFIX);
}

export function LinkedDocumentsList({
  docs,
  onPreview,
}: {
  docs: IngestedDoc[];
  onPreview: (doc: IngestedDoc) => void;
}) {
  if (docs.length === 0) {
    return <p className="text-sm text-slate-400">No documents linked yet.</p>;
  }

  return (
    <ul className="space-y-0.5">
      {docs.map((d) => {
        const piaCompliant = d.tags.some((t) => t.label === "PIA Compliant");
        return (
          <li
            key={d.id}
            onClick={() => onPreview(d)}
            className="hover:bg-slate-50 cursor-pointer p-1.5 rounded transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate text-sm text-slate-700">{d.fileName}</span>
              {piaCompliant && <Badge tone="green">PIA Compliant</Badge>}
            </div>
            <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 group-hover:underline flex items-center gap-1 shrink-0">
              <Eye size={12} /> Preview{isRedactableDoc(d) && !piaCompliant ? " & Redact" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
