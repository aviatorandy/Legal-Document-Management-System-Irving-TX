"use client";

import { useState } from "react";
import { ArrowRight, FileText, Gavel, FileX, Handshake } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AuditLogEntry,
  Claim,
  formatCurrency,
  formatShortDate,
  IngestedDoc,
} from "@/lib/data";

export function ClaimDetailModal({
  claim,
  docs,
  auditLog,
  onClose,
  onEscalate,
  onUpdateClaim,
  onAudit,
  onNotify,
}: {
  claim: Claim | null;
  docs: IngestedDoc[];
  auditLog: AuditLogEntry[];
  onClose: () => void;
  onEscalate: (claim: Claim) => void;
  onUpdateClaim: (claim: Claim) => void;
  onAudit: (action: string, target: string) => void;
  onNotify: (title: string, description?: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!claim) return null;

  const linkedDocs = docs.filter((d) => d.claimId === claim.id);
  const alreadyConverted = claim.status === "Converted to Litigation";
  const isTerminal =
    alreadyConverted || claim.status === "Denied" || claim.status === "Settled";
  const history = auditLog
    .filter((a) => a.targetEntity === claim.claimNumber)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  function act(update: Partial<Claim>, auditAction: string, toastTitle: string, toastDesc?: string) {
    onUpdateClaim({ ...claim!, ...update });
    onAudit(auditAction, claim!.claimNumber);
    onNotify(toastTitle, toastDesc);
  }

  return (
    <Modal
      open={!!claim}
      onClose={() => {
        setConfirming(false);
        onClose();
      }}
      title={claim.claimNumber}
      description={claim.title}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Claimant</p>
            <p className="font-medium text-slate-800">{claim.claimantName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="font-medium text-slate-800">{claim.dept}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Incident Date</p>
            <p className="font-medium text-slate-800">{formatShortDate(claim.incidentDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Location</p>
            <p className="font-medium text-slate-800">{claim.incidentLocation}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Initial Demand</p>
            <p className="font-medium text-slate-800">{formatCurrency(claim.initialDemand)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <Badge tone="amber">{claim.status}</Badge>
          </div>
        </div>

        {linkedDocs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Linked Documents ({linkedDocs.length})
            </p>
            <ul className="space-y-1.5">
              {linkedDocs.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{d.fileName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Activity
          </p>
          {history.length > 0 ? (
            <ul className="space-y-1.5 max-h-28 overflow-y-auto">
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

        {alreadyConverted ? (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
            This claim has been converted to litigation matter{" "}
            <span className="font-semibold">{claim.linkedMatterId}</span>.
          </div>
        ) : confirming ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <p className="text-sm text-amber-900">
              This creates a new litigation matter, copies the incident description and all{" "}
              {linkedDocs.length} attachment{linkedDocs.length === 1 ? "" : "s"}, and marks this
              claim <span className="font-semibold">Converted to Litigation</span>. This cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onEscalate(claim);
                  setConfirming(false);
                }}
              >
                <Gavel className="h-3.5 w-3.5" />
                Confirm & Create Matter
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              className="w-full justify-center"
              disabled={isTerminal}
              onClick={() => setConfirming(true)}
            >
              Convert Claim to Litigation Matter
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isTerminal}
                onClick={() =>
                  act(
                    { status: "Denied" },
                    "Issued denial letter",
                    "Denial letter generated",
                    "Queued for mailing to claimant."
                  )
                }
              >
                <FileX className="h-3.5 w-3.5" />
                Issue Denial Letter
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isTerminal}
                onClick={() =>
                  act(
                    { status: "Settled" },
                    "Authorized settlement",
                    "Settlement authorized"
                  )
                }
              >
                <Handshake className="h-3.5 w-3.5" />
                Authorize Settlement
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
