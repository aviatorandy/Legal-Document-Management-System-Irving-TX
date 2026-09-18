"use client";

import { useState } from "react";
import {
  Link2,
  Gavel,
  Upload,
  BellRing,
  CalendarClock,
  DollarSign,
  FileOutput,
  Handshake,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RedactionReviewModal } from "@/components/RedactionReviewModal";
import {
  isRedactableDoc,
  LinkedDocumentsList,
} from "@/components/documents/LinkedDocumentsList";
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
  onUpdateMatter,
  onAudit,
  onNotify,
  onRedactFinalize,
}: {
  matter: Matter | null;
  docs: IngestedDoc[];
  auditLog: AuditLogEntry[];
  claims: Claim[];
  onClose: () => void;
  onUpdateMatter: (matter: Matter) => void;
  onAudit: (action: string, target: string) => void;
  onNotify: (title: string, description?: string) => void;
  onRedactFinalize: (acceptedCount: number) => void;
}) {
  const [dateDraft, setDateDraft] = useState("");
  const [showDatePicker, setShowDatePicker] = useState<"hearing" | "docket" | null>(null);
  const [exposureDraft, setExposureDraft] = useState("");
  const [showExposureInput, setShowExposureInput] = useState(false);
  const [redactingDoc, setRedactingDoc] = useState<IngestedDoc | null>(null);

  if (!matter) return null;

  function handlePreview(doc: IngestedDoc) {
    if (isRedactableDoc(doc)) {
      setRedactingDoc(doc);
    } else {
      onNotify(`Previewing ${doc.fileName}`, "Read-only preview.");
    }
  }

  const deadline = getDeadlineStatus(matter);
  const linkedDocs = docs.filter((d) => d.matterId === matter.id);
  const linkedClaim = matter.linkedClaimId
    ? claims.find((c) => c.id === matter.linkedClaimId)
    : undefined;
  const history = auditLog
    .filter((a) => a.targetEntity === matter.caseNumber)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  function act(update: Partial<Matter>, auditAction: string, toastTitle: string, toastDesc?: string) {
    onUpdateMatter({ ...matter!, ...update });
    onAudit(auditAction, matter!.caseNumber);
    onNotify(toastTitle, toastDesc);
  }

  function confirmDate() {
    if (!dateDraft) return;
    if (showDatePicker === "hearing") {
      act(
        { targetDate: dateDraft, deadlineType: "Municipal Court" },
        "Scheduled court hearing",
        "Court hearing scheduled",
        "Synced to Outlook calendar."
      );
    } else if (showDatePicker === "docket") {
      act(
        { targetDate: dateDraft, deadlineType: "Docket Deadline" },
        "Added docket deadline",
        "Docket deadline added",
        "Synced to Outlook calendar."
      );
    }
    setShowDatePicker(null);
    setDateDraft("");
  }

  function confirmExposure() {
    const numeric = Number(exposureDraft.replace(/[^0-9.]/g, ""));
    if (!numeric) return;
    act(
      { exposure: numeric, exposureLabel: formatCurrency(numeric) },
      "Updated exposure reserve",
      "Exposure reserve updated",
      `New reserve: ${formatCurrency(numeric)}`
    );
    setShowExposureInput(false);
    setExposureDraft("");
  }

  const isContract = matter.type === "Vendor Contract";
  const isOrdinance = matter.type === "Ordinance";
  const isLitigation = matter.type === "Civil Action";
  const isClosed = matter.status.startsWith("Closed") || matter.status === "Executed";

  return (
    <Modal open={!!matter} onClose={onClose} title={matter.caseNumber} description={matter.title}>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge tone={typeTone[matter.type]}>{matter.type}</Badge>
          <Badge tone="slate">{matter.status}</Badge>
          {matter.type === "Civil Action" &&
            matter.deadlineType === "Civil Court Answer" &&
            !deadline.overdue && <Badge tone="amber">Answer Pending</Badge>}
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
            <LinkedDocumentsList docs={linkedDocs} onPreview={handlePreview} />
          ) : (
            <p className="text-sm text-slate-400">No documents linked to this matter yet.</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Activity
          </p>
          {history.length > 0 ? (
            <ul className="space-y-1.5 max-h-32 overflow-y-auto">
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

        {showDatePicker && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center gap-2">
            <input
              type="date"
              value={dateDraft}
              onChange={(e) => setDateDraft(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
            />
            <Button size="sm" onClick={confirmDate}>
              Confirm
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowDatePicker(null)}>
              Cancel
            </Button>
          </div>
        )}

        {showExposureInput && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              placeholder="New exposure amount ($)"
              value={exposureDraft}
              onChange={(e) => setExposureDraft(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
            />
            <Button size="sm" onClick={confirmExposure}>
              Confirm
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowExposureInput(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Action Bar */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Actions
          </p>

          {isContract && (
            <div className="space-y-2">
              <Button
                className="w-full justify-center"
                disabled={matter.status === "Awaiting Council" || isClosed}
                onClick={() =>
                  act(
                    { status: "Awaiting Council", pendingCouncil: true },
                    "Approved for City Council Agenda",
                    "Added to Oct 14 Council Agenda packet"
                  )
                }
              >
                <Gavel className="h-4 w-4" />
                Approve for Council Agenda
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={matter.status === "Executed"}
                  onClick={() =>
                    act(
                      { status: "Executed", pendingCouncil: false },
                      "Uploaded executed contract copy",
                      "Executed copy uploaded",
                      "Archived to SharePoint."
                    )
                  }
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Executed Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={matter.renewalAlertSet}
                  onClick={() =>
                    act(
                      { renewalAlertSet: true },
                      "Set renewal alert",
                      matter.renewalAlertSet ? "Renewal alert already set" : "Renewal alert set",
                      "Will notify 90 days before expiration."
                    )
                  }
                >
                  <BellRing className="h-3.5 w-3.5" />
                  {matter.renewalAlertSet ? "Alert Set" : "Set Renewal Alert"}
                </Button>
              </div>
            </div>
          )}

          {isOrdinance && (
            <div className="space-y-2">
              <Button
                className="w-full justify-center"
                onClick={() => setShowDatePicker("hearing")}
              >
                <CalendarClock className="h-4 w-4" />
                Schedule Court Hearing
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isClosed}
                  onClick={() =>
                    act(
                      { status: "Closed - Compliant" },
                      "Recorded compliance and closed matter",
                      "Marked compliant and closed"
                    )
                  }
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Record Compliance &amp; Close
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isClosed}
                  onClick={() =>
                    act(
                      { status: "Briefing" },
                      "Escalated ordinance matter to civil injunction proceedings",
                      "Escalated to civil injunction track",
                      "Legal Department notified."
                    )
                  }
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Escalate to Civil Injunction
                </Button>
              </div>
            </div>
          )}

          {isLitigation && (
            <div className="space-y-2">
              <Button
                className="w-full justify-center"
                onClick={() => setShowDatePicker("docket")}
              >
                <CalendarClock className="h-4 w-4" />
                Add Docket Deadline
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExposureInput(true)}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Update Exposure Reserve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    act(
                      {},
                      "Generated council brief",
                      "Council brief generated",
                      "Queued for City Attorney review."
                    )
                  }
                >
                  <FileOutput className="h-3.5 w-3.5" />
                  Generate Council Brief
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isClosed}
                  onClick={() =>
                    act(
                      { status: "Closed - Settled" },
                      "Recorded settlement",
                      "Settlement recorded",
                      "Matter closed."
                    )
                  }
                >
                  <Handshake className="h-3.5 w-3.5" />
                  Record Settlement
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <RedactionReviewModal
        open={!!redactingDoc}
        docLabel={redactingDoc?.fileName ?? ""}
        onClose={() => setRedactingDoc(null)}
        onFinalize={(acceptedCount) => {
          onRedactFinalize(acceptedCount);
          onAudit(
            `Applied ${acceptedCount} statutory redactions to Doc #IRV-2026-8819 [User: Paralegal]`,
            matter.caseNumber
          );
          onNotify(
            "Redacted copy generated: Incident_Report_REDACTED.pdf",
            "Underlying metadata stripped."
          );
        }}
        onDownload={() =>
          onNotify(
            "Download started",
            "Incident_Report_REDACTED.pdf saved to your downloads."
          )
        }
      />
    </Modal>
  );
}
