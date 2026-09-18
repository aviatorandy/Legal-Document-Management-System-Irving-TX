"use client";

import { FileText, Link2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  AuditLogEntry,
  Claim,
  formatCurrency,
  getDeadlineStatus,
  IngestedDoc,
  Matter,
} from "@/lib/data";

const typeTone: Record<string, "navy" | "blue" | "amber" | "zinc"> = {
  "Vendor Contract": "blue",
  Ordinance: "zinc",
  "Civil Action": "navy",
};

export function MatterDetailModal({
  matter,
  docs,
  auditLog,
  claims,
  onClose,
}: {
  matter: Matter | null;
  docs: IngestedDoc[];
  auditLog: AuditLogEntry[];
  claims: Claim[];
  onClose: () => void;
}) {
  if (!matter) return null;

  const deadline = getDeadlineStatus(matter);
  const linkedDocs = docs.filter((d) => d.matterId === matter.id);
  const linkedClaim = matter.linkedClaimId
    ? claims.find((c) => c.id === matter.linkedClaimId)
    : undefined;
  const history = auditLog
    .filter((a) => a.targetEntity === matter.caseNumber)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Modal open={!!matter} onClose={onClose} title={matter.caseNumber} description={matter.title}>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge tone={typeTone[matter.type]}>{matter.type}</Badge>
          <Badge tone="slate">{matter.status}</Badge>
        </div>

        {linkedClaim && (
          <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm text-purple-800">
            <Link2 className="h-4 w-4 shrink-0" />
            Escalated from claim{" "}
            <span className="font-semibold">{linkedClaim.claimNumber}</span> — incident details
            and attachments carried over automatically.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="font-medium text-slate-800">{matter.dept}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Lead Counsel</p>
            <p className="font-medium text-slate-800">Andy Chang, ACA</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Financial Exposure</p>
            <p className="font-medium text-slate-800">
              {matter.exposure !== null ? formatCurrency(matter.exposure) : matter.exposureLabel}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Deadline</p>
            <p
              className={`font-medium ${
                deadline.urgent || deadline.overdue ? "text-red-600" : "text-slate-800"
              }`}
            >
              {deadline.label}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Documents ({linkedDocs.length})
          </p>
          {linkedDocs.length > 0 ? (
            <ul className="space-y-1.5">
              {linkedDocs.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{d.fileName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No documents linked to this matter yet.</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Activity
          </p>
          {history.length > 0 ? (
            <ul className="space-y-1.5">
              {history.map((h) => (
                <li key={h.id} className="text-sm text-slate-600">
                  <span className="text-slate-400">
                    {new Date(h.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>{" "}
                  — {h.action}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No activity recorded yet.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
