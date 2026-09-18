"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Sparkles,
  Loader2,
  Check,
  ShieldCheck,
  Download,
  ArrowLeft,
  MousePointerClick,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type EntityStatus = "pending" | "accepted" | "dismissed";

interface RedactionEntity {
  id: string;
  category: string;
  label: string;
  citation: string;
  text: string;
  status: EntityStatus;
  manual?: boolean;
}

type Stage = "preview" | "scanning" | "reviewing" | "burned";

type Segment = { type: "text"; value: string } | { type: "entity"; id: string };

const narrativeSegments: Segment[] = [
  {
    type: "text",
    value:
      "On August 12, 2026, at approximately 3:45 PM, Officer Badge #412 responded to a two-vehicle collision at the intersection of Las Colinas Blvd & O'Connor Rd. The reporting driver provided a Texas driver's license number, ",
  },
  { type: "entity", id: "dl" },
  { type: "text", value: ", and a Social Security Number ending in " },
  { type: "entity", id: "ssn" },
  { type: "text", value: " for insurance verification purposes. A minor passenger, " },
  { type: "entity", id: "minor" },
  {
    type: "text",
    value:
      ", was present in the second vehicle and was evaluated by EMS at the scene with no reported injuries. The driver's listed home address was ",
  },
  { type: "entity", id: "address" },
  { type: "text", value: ", and a contact phone number of " },
  { type: "entity", id: "phone" },
  {
    type: "text",
    value: " was provided for follow-up correspondence regarding the property damage claim.",
  },
];

const supplementalNote =
  "Supplemental note (Paralegal review): Witness statement collected on-scene references the claimant's employer and a secondary contact who declined to be named in the primary narrative above. Click this paragraph in manual redaction mode to stage it for review.";

const initialEntities: RedactionEntity[] = [
  {
    id: "dl",
    category: "Personally Identifying Numbers",
    label: "Driver's License Number",
    citation: "Tex. Transp. Code § 521.049",
    text: "TX-49201948",
    status: "pending",
  },
  {
    id: "ssn",
    category: "Personally Identifying Numbers",
    label: "Social Security Number",
    citation: "Tex. Gov't Code § 552.147",
    text: "***-**-6184",
    status: "pending",
  },
  {
    id: "minor",
    category: "Minor Identifying Information",
    label: "Minor Identifier",
    citation: "Tex. Fam. Code § 58.007",
    text: "Lucas Hernandez (Age 9)",
    status: "pending",
  },
  {
    id: "address",
    category: "Personal Contact Information",
    label: "Home Address",
    citation: "Common-Law Privacy",
    text: "4150 Valley View Ln, Irving, TX 75038",
    status: "pending",
  },
  {
    id: "phone",
    category: "Personal Contact Information",
    label: "Phone Number",
    citation: "Common-Law Privacy",
    text: "(972) 555-0193",
    status: "pending",
  },
];

export function RedactionReviewModal({
  open,
  docLabel,
  onClose,
  onFinalize,
  onDownload,
}: {
  open: boolean;
  docLabel: string;
  onClose: () => void;
  onFinalize: (acceptedCount: number) => void;
  onDownload: () => void;
}) {
  const [stage, setStage] = useState<Stage>("preview");
  const [entities, setEntities] = useState<RedactionEntity[]>(initialEntities);
  const [manualMode, setManualMode] = useState(false);
  const [manualStaged, setManualStaged] = useState(false);

  useEffect(() => {
    if (!open) {
      setStage("preview");
      setEntities(initialEntities);
      setManualMode(false);
      setManualStaged(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const categoryCount = useMemo(
    () => new Set(entities.map((e) => e.category)).size,
    [entities]
  );
  const acceptedCount = entities.filter((e) => e.status === "accepted").length;
  const pendingCount = entities.filter((e) => e.status === "pending").length;

  if (!open) return null;

  function runScan() {
    setStage("scanning");
    setTimeout(() => {
      setEntities((prev) => prev.map((e) => ({ ...e, status: "pending" })));
      setStage("reviewing");
    }, 1000);
  }

  function setEntityStatus(id: string, status: EntityStatus) {
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  function acceptAll() {
    setEntities((prev) =>
      prev.map((e) => (e.status === "dismissed" ? e : { ...e, status: "accepted" }))
    );
  }

  function rejectAll() {
    setEntities((prev) => prev.map((e) => ({ ...e, status: "dismissed" })));
  }

  function stageManualRedaction() {
    if (manualStaged) return;
    setManualStaged(true);
    setEntities((prev) => [
      ...prev,
      {
        id: "manual-note",
        category: "Manual Redaction",
        label: "Supplemental Note (Paralegal-Flagged)",
        citation: "Attorney Work Product / Paralegal Discretion",
        text: supplementalNote,
        status: "accepted",
        manual: true,
      },
    ]);
    setManualMode(false);
  }

  function finalize() {
    setStage("burned");
    onFinalize(acceptedCount);
  }

  function renderEntitySpan(entity: RedactionEntity) {
    if (stage === "burned") {
      if (entity.status === "accepted") {
        return (
          <span
            key={entity.id}
            className="inline-block rounded-sm bg-zinc-950 px-1 text-transparent select-none align-baseline"
          >
            {entity.text}
          </span>
        );
      }
      return <span key={entity.id}>{entity.text}</span>;
    }

    if (stage === "reviewing") {
      if (entity.status === "dismissed") {
        return <span key={entity.id}>{entity.text}</span>;
      }
      return (
        <span
          key={entity.id}
          className={cn(
            "relative inline-flex items-center gap-1 rounded px-1 py-0.5 mx-0.5 border text-inherit",
            entity.status === "accepted"
              ? "bg-amber-200/70 border-amber-500"
              : "bg-amber-100 border-amber-400"
          )}
          title={`${entity.label} — ${entity.citation}`}
        >
          {entity.text}
          <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-900 bg-amber-300/70 rounded px-1 py-0.5 whitespace-nowrap">
            {entity.citation}
          </span>
        </span>
      );
    }

    return <span key={entity.id}>{entity.text}</span>;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Left: document */}
        <div className="flex flex-1 min-w-0 flex-col border-r border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="h-4 w-4 text-slate-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700 truncate">{docLabel}</span>
              <Badge tone={stage === "burned" ? "green" : "amber"}>
                {stage === "burned" ? "Redacted - PIA Compliant" : "Original - Unredacted"}
              </Badge>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 font-serif text-[14px] leading-relaxed text-slate-800">
            <div className="text-center mb-6 border-b border-slate-300 pb-4">
              <p className="text-xs tracking-widest text-slate-500">CITY OF IRVING, TEXAS</p>
              <h3 className="text-base font-semibold mt-1">
                POLICE DEPARTMENT — INCIDENT &amp; PROPERTY DAMAGE REPORT
              </h3>
              <p className="text-xs text-slate-500 mt-1">Report #IRV-2026-8819</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-xs font-sans text-slate-600">
              <div>
                <p className="text-slate-400">Date</p>
                <p className="font-medium text-slate-700">August 12, 2026</p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="font-medium text-slate-700">Las Colinas Blvd &amp; O&apos;Connor Rd</p>
              </div>
              <div>
                <p className="text-slate-400">Officer</p>
                <p className="font-medium text-slate-700">Badge #412</p>
              </div>
            </div>

            <p className="font-semibold text-xs uppercase tracking-wide text-slate-500 mb-2">
              Narrative
            </p>
            <p className="mb-4">
              {narrativeSegments.map((seg, i) =>
                seg.type === "text" ? (
                  <span key={i}>{seg.value}</span>
                ) : (
                  renderEntitySpan(entities.find((e) => e.id === seg.id)!)
                )
              )}
            </p>

            <p
              onClick={() => manualMode && stageManualRedaction()}
              className={cn(
                "text-slate-600 rounded-md p-2 -mx-2 transition-colors",
                manualMode && !manualStaged && "cursor-pointer hover:bg-amber-50 ring-1 ring-amber-300"
              )}
            >
              {manualStaged
                ? renderEntitySpan(entities.find((e) => e.id === "manual-note")!)
                : supplementalNote}
            </p>
          </div>
        </div>

        {/* Right: review drawer */}
        <div className="flex w-[380px] shrink-0 flex-col bg-slate-50">
          {stage === "preview" && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center gap-3">
              <Sparkles className="h-6 w-6 text-slate-400" />
              <p className="text-sm text-slate-500">
                Run an AI exemption scan to detect PII and statutory exemptions before this
                document can be produced in response to a public records request.
              </p>
              <Button onClick={runScan}>
                <Sparkles className="h-4 w-4" />
                Run AI Exemption Scan
              </Button>
            </div>
          )}

          {stage === "scanning" && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center gap-3">
              <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
              <p className="text-sm text-slate-500">
                Scanning for statutory exemptions &amp; PII...
              </p>
            </div>
          )}

          {(stage === "reviewing" || stage === "burned") && (
            <>
              <div className="border-b border-slate-200 bg-white px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {entities.length} sensitive item{entities.length === 1 ? "" : "s"} detected
                  across {categoryCount} statutory exemption categor
                  {categoryCount === 1 ? "y" : "ies"}.
                </p>
                {stage === "reviewing" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={acceptAll}>
                      Accept All
                    </Button>
                    <Button size="sm" variant="outline" onClick={rejectAll}>
                      Reject All
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {entities.map((e) => (
                  <div
                    key={e.id}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 bg-white",
                      e.status === "dismissed" ? "opacity-50 border-slate-200" : "border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">
                          {e.label}
                          {e.manual && (
                            <span className="ml-1.5 text-[10px] font-medium text-purple-600">
                              MANUAL
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                          {e.citation}
                        </p>
                      </div>
                      {stage === "reviewing" && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEntityStatus(e.id, "accepted")}
                            className={cn(
                              "rounded-full p-1.5 transition-colors",
                              e.status === "accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                            title="Accept redaction"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEntityStatus(e.id, "dismissed")}
                            className={cn(
                              "rounded-full p-1.5 transition-colors",
                              e.status === "dismissed"
                                ? "bg-red-100 text-red-700"
                                : "text-slate-400 hover:bg-red-50 hover:text-red-600"
                            )}
                            title="Dismiss suggestion"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      {stage === "burned" && (
                        <Badge tone={e.status === "accepted" ? "green" : "zinc"}>
                          {e.status === "accepted" ? "Redacted" : "Kept"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {stage === "reviewing" && (
                <div className="border-t border-slate-200 bg-white p-4 space-y-2.5">
                  <Button
                    variant={manualMode ? "secondary" : "outline"}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setManualMode((v) => !v)}
                    disabled={manualStaged}
                  >
                    <MousePointerClick className="h-3.5 w-3.5" />
                    {manualStaged
                      ? "Custom Text Staged"
                      : manualMode
                      ? "Click a Paragraph Below to Stage"
                      : "+ Select Custom Text to Redact"}
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full justify-center"
                    onClick={finalize}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Apply Permanent Redactions &amp; Finalize
                  </Button>
                  {pendingCount > 0 && (
                    <p className="text-[11px] text-slate-400 text-center">
                      {pendingCount} item{pendingCount === 1 ? "" : "s"} still pending review
                    </p>
                  )}
                </div>
              )}

              {stage === "burned" && (
                <div className="border-t border-slate-200 bg-white p-4 space-y-2.5">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
                    Redacted copy generated:{" "}
                    <span className="font-mono font-semibold">
                      Incident_Report_REDACTED.pdf
                    </span>
                    . Underlying metadata stripped.
                  </div>
                  <Button className="w-full justify-center" onClick={onDownload}>
                    <Download className="h-4 w-4" />
                    Download Redacted Copy
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={onClose}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Return to Document Repository
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
