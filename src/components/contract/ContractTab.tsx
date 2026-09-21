"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Cloud,
  FileSignature,
  Gavel,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Matter } from "@/lib/data";
import { cn } from "@/lib/utils";

type SectionStatus = "flagged" | "resolved";

interface ClauseState {
  section4: SectionStatus;
  section9: SectionStatus;
  section12: SectionStatus;
}

const pipelineStages = [
  "Department Submission",
  "Legal Review",
  "City Council Agenda",
  "Executed",
];

function PipelineStepper({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm overflow-x-auto">
      {pipelineStages.map((stage, i) => {
        const done = i < currentStage;
        const current = i === currentStage;
        return (
          <div key={stage} className="flex items-center gap-1.5 shrink-0">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                done
                  ? "bg-emerald-50 text-emerald-700"
                  : current
                  ? "bg-[#0b2340] text-white"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {done ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              {stage}
            </div>
            {i < pipelineStages.length - 1 && (
              <div className={cn("h-px w-4", done ? "bg-emerald-300" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ContractTab({
  matter,
  onNotify,
  onAudit,
  onUpdateMatter,
}: {
  matter: Matter;
  onNotify: (title: string, description?: string) => void;
  onAudit: (action: string, target: string) => void;
  onUpdateMatter: (matter: Matter) => void;
}) {
  const [clauses, setClauses] = useState<ClauseState>({
    section4: "flagged",
    section9: "flagged",
    section12: "flagged",
  });
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageGenerated, setPackageGenerated] = useState(false);

  const resolvedCount = Object.values(clauses).filter(
    (s) => s === "resolved"
  ).length;

  const isExecuted = matter.status === "Executed";
  const currentStage = isExecuted
    ? 3
    : resolvedCount === 3 && packageGenerated
    ? 2
    : 1;

  function markExecuted() {
    onUpdateMatter({ ...matter, status: "Executed", pendingCouncil: false });
    onAudit("Marked contract Executed", matter.caseNumber);
    onNotify("Contract executed", "Fully signed copy archived to SharePoint.");
  }

  function resolve(key: keyof ClauseState, toastTitle: string) {
    setClauses((prev) => ({ ...prev, [key]: "resolved" }));
    onNotify(toastTitle, "Contract clause updated in working draft.");
    onAudit(toastTitle, "CNT-2026-014");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Reviewing: IT Cloud Infrastructure Agreement
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="font-mono text-xs font-medium text-slate-600">
              {matter.caseNumber}
            </span>
            &nbsp;&middot;&nbsp; Vendor: SkyScale GovCloud Inc. &nbsp;|&nbsp; Value:{" "}
            <span className="font-semibold text-slate-700">{matter.exposureLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isExecuted && <Badge tone="green">Executed</Badge>}
          <Badge tone={resolvedCount === 3 ? "green" : "amber"}>
            {resolvedCount} / 3 Compliance Flags Resolved
          </Badge>
        </div>
      </div>

      <PipelineStepper currentStage={currentStage} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        {/* Left panel: document preview */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="h-3 w-3 rounded-full bg-[#0078D4]" />
            <span className="text-xs font-medium text-slate-500">
              Word Online — Enterprise_Cloud_MSA_v1.docx
            </span>
          </div>
          <div className="px-8 py-8 font-serif text-[15px] leading-relaxed text-slate-800 max-h-[640px] overflow-y-auto">
            <h3 className="text-center font-semibold text-base mb-8 tracking-wide">
              ENTERPRISE CLOUD INFRASTRUCTURE
              <br />
              MASTER SERVICES AGREEMENT
            </h3>

            <p className="font-semibold mb-2">
              SECTION 4 — INDEMNIFICATION
            </p>
            <p className="mb-2 text-slate-700">
              Vendor shall indemnify, defend, and hold harmless the City of
              Irving from any claims, damages, or liabilities arising from
              Vendor&apos;s performance under this Agreement, subject to an
              aggregate indemnification cap of{" "}
              <span
                className={cn(
                  "font-semibold",
                  clauses.section4 === "resolved"
                    ? "text-emerald-700"
                    : "text-slate-900"
                )}
              >
                {clauses.section4 === "resolved" ? "$250,000" : "$2,000,000"}
              </span>
              {" "}per occurrence.
            </p>
            <CalloutBox
              tone={clauses.section4 === "resolved" ? "resolved" : "amber"}
            >
              {clauses.section4 === "resolved"
                ? "RESOLVED: City Standard Indemnification Language applied."
                : "FLAG: One-sided vendor indemnification language may allocate risk beyond the City's approved contracting position. Attorney review required."}
            </CalloutBox>

            <p className="font-semibold mt-6 mb-2">
              SECTION 9 — STATUTORY MANDATES
            </p>
            <p className="mb-2 text-slate-700">
              {clauses.section9 === "resolved"
                ? "Vendor certifies, in accordance with Tex. Gov't Code § 2271.002, that it does not boycott Israel and will not boycott Israel during the term of this Agreement."
                : "Vendor shall comply with all applicable federal, state, and local laws in the performance of this Agreement."}
            </p>
            <CalloutBox
              tone={clauses.section9 === "resolved" ? "resolved" : "red"}
            >
              {clauses.section9 === "resolved"
                ? "RESOLVED: Tex. Gov't Code § 2271.002 verification clause injected."
                : "FLAG: Missing Chapter 2271 Verification."}
            </CalloutBox>

            <p className="font-semibold mt-6 mb-2">
              SECTION 12 — FUNDING &amp; TERM
            </p>
            <p className="mb-2 text-slate-700">
              {clauses.section12 === "resolved"
                ? "This Agreement is subject to annual appropriation by the Irving City Council. In the event sufficient funds are not appropriated for any fiscal year, the City may terminate this Agreement without penalty upon 30 days written notice to Vendor, in accordance with standard City of Irving municipal non-appropriation provisions."
                : "This Agreement shall remain in effect for a term of five (5) years from the Effective Date, renewable upon mutual written consent."}
            </p>
            <CalloutBox
              tone={clauses.section12 === "resolved" ? "resolved" : "amber"}
            >
              {clauses.section12 === "resolved"
                ? "RESOLVED: Municipal non-appropriation clause added per City of Irving standard funding provisions."
                : "FLAG: Missing Municipal Non-Appropriation Provision."}
            </CalloutBox>
          </div>
        </div>

        {/* Right panel: compliance inspector */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-[#0b2340]" />
              <h3 className="text-sm font-semibold text-slate-900">
                Concourse AI Compliance Inspector
              </h3>
            </div>

            <InspectorItem
              title="One-Sided Vendor Indemnification Requires Review"
              statusLabel="Attorney Review Required"
              citation="City Standard Contracting Position"
              rationale="The proposed provision may allocate risk beyond the City's approved contracting position. Legal review is required before acceptance."
              resolved={clauses.section4 === "resolved"}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve("section4", "City Standard Indemnification Language applied")
                  }
                  disabled={clauses.section4 === "resolved"}
                >
                  Apply City Standard Indemnification Language
                </Button>
              }
            />
            <InspectorItem
              title="Missing Chapter 2271 Verification"
              citation="Tex. Gov't Code §2271.002"
              rationale="This $480,000 contract requires review for the applicable written Chapter 2271 verification. The vendor profile indicates more than 10 full-time employees."
              resolved={clauses.section9 === "resolved"}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve("section9", "Chapter 2271 verification clause injected")
                  }
                  disabled={clauses.section9 === "resolved"}
                >
                  Insert Chapter 2271 Verification
                </Button>
              }
            />
            <InspectorItem
              title="Missing Municipal Non-Appropriation Provision"
              citation="Tex. Local Gov't Code § 271.903"
              rationale="Multi-year municipal contracts must include a non-appropriation clause allowing termination without penalty if City Council does not appropriate funds in a subsequent fiscal year."
              resolved={clauses.section12 === "resolved"}
              last
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve(
                      "section12",
                      "Non-appropriation clause injected"
                    )
                  }
                  disabled={clauses.section12 === "resolved"}
                >
                  Insert Non-Appropriation Provision
                </Button>
              }
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Finalize &amp; Route
            </p>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                onNotify(
                  "Version 1.2 saved to Irving Legal SharePoint",
                  "Prepared for M365 SharePoint sync."
                );
                onAudit("Prepared contract updates for M365 SharePoint", "CNT-2026-014");
              }}
            >
              <Cloud className="h-4 w-4" />
              Prepare Updates for M365 SharePoint
            </Button>
            <Button
              variant="primary"
              className="w-full justify-start"
              disabled={isExecuted || resolvedCount < 3}
              onClick={() => {
                setPackageModalOpen(true);
                setPackageGenerated(true);
                onAudit("Generated council agenda signature package", matter.caseNumber);
              }}
            >
              <FileSignature className="h-4 w-4" />
              Generate Adobe Pro Council Signature Package
            </Button>
            {packageGenerated && !isExecuted && (
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={markExecuted}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Contract Executed
              </Button>
            )}
            {isExecuted && (
              <p className="text-xs text-emerald-700 flex items-center gap-1.5 px-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Contract fully executed and archived.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title="Council Agenda Signature Package Prepared"
        description="Adobe Acrobat Pro executive packet"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                CNT-2026-014_Council_Agenda_Packet.pdf prepared
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Bundled contract, compliance summary, and legal sufficiency
                sign-off into a single Adobe Acrobat Pro PDF/A package,
                routed to the City Secretary for agenda placement and
                Council signature.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Legal Sufficiency Sign-Off</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <Gavel className="h-3.5 w-3.5" /> Andy Chang, ACA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Compliance Flags</span>
              <span className="font-medium text-slate-700">
                {resolvedCount} / 3 Resolved
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Routing</span>
              <span className="font-medium text-slate-700">
                City Secretary — Council Agenda
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setPackageModalOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function CalloutBox({
  tone,
  children,
}: {
  tone: "amber" | "red" | "resolved";
  children: React.ReactNode;
}) {
  const classes = {
    amber: "border-amber-300 bg-amber-50 text-amber-900",
    red: "border-red-300 bg-red-50 text-red-900",
    resolved: "border-emerald-300 bg-emerald-50 text-emerald-900",
  }[tone];

  return (
    <div className={cn("flex items-start gap-2 rounded-md border px-3 py-2 mb-2 font-sans text-[13px]", classes)}>
      {tone === "resolved" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}

function InspectorItem({
  title,
  citation,
  rationale,
  resolved,
  action,
  last,
  statusLabel,
}: {
  title: string;
  citation: string;
  rationale: string;
  resolved: boolean;
  action: React.ReactNode;
  last?: boolean;
  statusLabel?: string;
}) {
  return (
    <div
      className={cn(
        "py-3",
        !last && "border-b border-slate-100"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <Badge tone={resolved ? "green" : "amber"}>
          {resolved ? "Resolved" : statusLabel ?? "Flagged"}
        </Badge>
      </div>
      <p className="text-xs font-mono text-slate-400 mb-1.5">{citation}</p>
      <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">
        {rationale}
      </p>
      {action}
    </div>
  );
}
